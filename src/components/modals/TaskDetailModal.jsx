import { X, Calendar, MapPin, Users, CheckSquare, Clock, ArrowRight, MessageSquare, Paperclip, Check, Play, Upload, XCircle, DollarSign, Store, Edit, Trash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const TaskDetailModal = ({ task, onClose, onSelectWorker, onSelectEvent, onEditTask }) => {
    const { permissions, currentUser } = useAuth();
    const { events, workers, vendors, tasks, updateTask, updateTaskStatus, deleteTask } = useData();

    if (!task) return null;

    // Use live task data from context to ensure updates are reflected immediately
    const liveTask = tasks.find(t => t.id === task.id) || task;

    // Derived values
    const event = events.find(e => e.id === liveTask.eventId);
    const worker = workers.find(w => w.id === liveTask.assignee);
    const vendor = vendors?.find(v => v.id === liveTask.vendorId);

    const handleToggleSubtask = (itemId) => {
        if (!liveTask.checklistItems) return;

        const updatedItems = liveTask.checklistItems.map(item =>
            item.id === itemId ? { ...item, done: !item.done } : item
        );

        const doneCount = updatedItems.filter(i => i.done).length;

        updateTask({
            ...liveTask,
            checklistItems: updatedItems,
            checklistDone: doneCount
        });
    };

    const handleStatusChange = (newStatus) => {
        updateTaskStatus(liveTask.id, newStatus);
    };

    const handleToggleLegacySubtask = (index) => {
        // Upgrade legacy task to modern format on first interaction
        const total = liveTask.checklistTotal || 0;
        const doneCount = liveTask.checklistDone || 0;

        // Generate items based on current count
        // Assume first 'doneCount' items are completed
        const newItems = Array.from({ length: total }, (_, i) => ({
            id: Date.now() + i,
            text: `Subtask ${i + 1}`,
            done: i < doneCount
        }));

        // Toggle the specific item clicked
        newItems[index].done = !newItems[index].done;

        // Recalculate done count
        const newDoneCount = newItems.filter(i => i.done).length;

        updateTask({
            ...liveTask,
            checklistItems: newItems,
            checklistDone: newDoneCount
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex items-start justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${liveTask.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                                liveTask.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                                    'bg-green-50 text-green-600 border border-green-100'
                                }`}>
                                {liveTask.priority} Priority
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${liveTask.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-100' :
                                liveTask.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                    liveTask.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                        'bg-gray-50 text-gray-600 border border-gray-100'
                                }`}>
                                {liveTask.status}
                            </span>
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-1">{liveTask.title}</h2>
                        {event && (
                            <button onClick={() => onSelectEvent(event)} className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                {event.name} <ArrowRight size={14} />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEditTask(liveTask)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
                            <Edit size={20} />
                        </button>
                        {currentUser?.role === 'owner' && (
                            <button
                                onClick={() => {
                                    if (window.confirm('Delete this task?')) {
                                        deleteTask(liveTask.id);
                                        onClose();
                                    }
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <Trash size={20} />
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
                    {/* Main Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{liveTask.description}</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Key Details</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <Calendar size={18} className="text-gray-400" />
                                        <span className="font-semibold w-24">Due Date:</span>
                                        <span>{liveTask.dueDate}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <MapPin size={18} className="text-gray-400" />
                                        <span className="font-semibold w-24">Location:</span>
                                        <span>{liveTask.location || 'N/A'}</span>
                                    </div>
                                    {worker && (
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <Users size={18} className="text-gray-400" />
                                            <span className="font-semibold w-24">Assignee:</span>
                                            <button onClick={() => onSelectWorker(worker)} className="text-primary-600 hover:underline font-medium">
                                                {worker.name}
                                            </button>
                                        </div>
                                    )}
                                    {liveTask.budget && (
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <DollarSign size={18} className="text-gray-400" />
                                            <span className="font-semibold w-24">Budget:</span>
                                            <span className="font-mono">₹{parseInt(liveTask.budget).toLocaleString()}</span>
                                        </div>
                                    )}
                                    {vendor && (
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <Store size={18} className="text-gray-400" />
                                            <span className="font-semibold w-24">Vendor:</span>
                                            <span className="text-purple-600 font-medium">{vendor.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Checklist */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <CheckSquare size={18} className="text-primary-600" />
                                    Subtasks
                                </h3>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                    {liveTask.checklistDone}/{liveTask.checklistTotal}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                                <div
                                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(liveTask.checklistDone / liveTask.checklistTotal) * 100}%` }}
                                />
                            </div>
                            <div className="space-y-3">
                                {/* Real Checklist Items */}
                                {liveTask.checklistItems && liveTask.checklistItems.length > 0 ? (
                                    liveTask.checklistItems.map((item, i) => (
                                        <div
                                            key={item.id || i}
                                            onClick={() => handleToggleSubtask(item.id)}
                                            className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                        >
                                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.done
                                                ? 'bg-primary-500 border-primary-500 text-white'
                                                : 'border-gray-300 text-transparent group-hover:border-primary-400'
                                                }`}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className={`text-sm ${item.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                {item.text}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    // Fallback for older tasks without explicit items (using counters)
                                    [...Array(liveTask.checklistTotal || 0)].map((_, i) => (
                                        <div
                                            key={i}
                                            onClick={() => handleToggleLegacySubtask(i)}
                                            className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                        >
                                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${i < liveTask.checklistDone
                                                ? 'bg-primary-500 border-primary-500 text-white'
                                                : 'border-gray-300 text-transparent group-hover:border-primary-400'
                                                }`}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className={`text-sm ${i < liveTask.checklistDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                Legacy Phase {i + 1} completion requirement
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-3 shrink-0">
                    <div className="flex-1 flex gap-2">
                        <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                            <MessageSquare size={18} />
                            <span className="hidden sm:inline">Comments</span>
                        </button>
                        <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                            <Paperclip size={18} />
                            <span className="hidden sm:inline">Files</span>
                        </button>
                    </div>

                    <div className="flex gap-3 flex-1 md:justify-end">
                        {(permissions.isWorker || currentUser.role === 'owner') && liveTask.status === 'Open' && (
                            <button
                                onClick={() => handleStatusChange('In Progress')}
                                className="flex-1 md:flex-none px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                            >
                                <Play size={18} /> Start Task
                            </button>
                        )}
                        {(permissions.isWorker || currentUser.role === 'owner') && liveTask.status === 'In Progress' && (
                            <button
                                onClick={() => handleStatusChange('Submitted')}
                                className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                            >
                                <Upload size={18} /> Submit for Approval
                            </button>
                        )}
                        {permissions.canApprove && (liveTask.status === 'Submitted' || liveTask.status === 'Pending') && (
                            <>
                                <button
                                    onClick={() => handleStatusChange('In Progress')}
                                    className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <XCircle size={18} /> Reject
                                </button>
                                <button
                                    onClick={() => handleStatusChange('Approved')}
                                    className="flex-1 md:flex-none px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                                >
                                    <Check size={18} /> Approve
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
