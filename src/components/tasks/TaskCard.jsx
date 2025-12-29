import React from 'react';
import { Clock, MapPin, MoreVertical, CheckSquare, Upload, Check, XCircle, Users, MessageCircle, Play, Circle, CheckCircle, AlertOctagon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const TaskCard = ({ task, onClick, inEventContext = false }) => {
    const { permissions } = useAuth();
    const { workers, events, weddings, vendors, updateTaskStatus, updateTask } = useData();

    const worker = workers.find(w => w.id === task.assignee);
    const vendor = vendors.find(v => v.id === (task.vendorId || task.assignee)); // Handle if assignee is vendor ID or separate field

    // Resolve Event Context
    const event = events.find(e => e.id.toString() === task.eventId?.toString());
    const wedding = event?.weddingId ? weddings.find(w => w.id.toString() === event.weddingId.toString()) : null;
    const contextLabel = wedding ? `${wedding.name} • ${event.name}` : event?.name;
    const contextColor = event?.type === 'Wedding' ? 'text-pink-600' : 'text-indigo-600';

    const handleWhatsApp = (e, person) => {
        e.stopPropagation();
        const phone = person.phone || person.contact || '919876543210'; // Fallback for demo
        const message = `Hi ${person.name}, regarding task: "${task.title}"...`;
        window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const [feedback, setFeedback] = React.useState(null);
    const [showRejectPrompt, setShowRejectPrompt] = React.useState(false);
    const [rejectReason, setRejectReason] = React.useState('');

    const handleAction = async (e, status, message) => {
        e.stopPropagation();
        setFeedback(message);
        await updateTaskStatus(task.id, status);
        setTimeout(() => setFeedback(null), 400);
    };

    return (
        <div onClick={onClick} className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-card-hover hover:border-primary-100 transition-all duration-300 cursor-pointer group overflow-hidden">
            {feedback && (
                <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-full shadow-lg">
                        <CheckCircle size={16} className="text-green-400" />
                        {feedback}
                    </div>
                </div>
            )}

            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${task.priority === 'High' ? 'bg-red-500 shadow-sm shadow-red-200' : task.priority === 'Medium' ? 'bg-yellow-500 shadow-sm shadow-yellow-200' : 'bg-green-500 shadow-sm shadow-green-200'}`} />
                        <h4 className="font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">{task.title}</h4>
                    </div>
                    <p className="text-sm text-gray-500 font-medium line-clamp-2">{task.description}</p>
                    {/* Event Context Label */}
                    {!inEventContext && contextLabel && (
                        <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${contextColor}`}>
                            <span className="opacity-70">in</span> {contextLabel}
                        </div>
                    )}
                </div>
                {/* Action Buttons / Status Badge - Visible in ALL contexts */}
                <div onClick={(e) => e.stopPropagation()}>
                    {task.status === 'Open' ? (
                        <button
                            onClick={(e) => handleAction(e, 'In Progress', 'Task Started!')}
                            className="flex items-center gap-1 active:scale-95 px-3 py-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors text-xs font-bold"
                        >
                            <Play size={14} className="fill-current" /> Start
                        </button>
                    ) : task.status === 'In Progress' ? (
                        <button
                            onClick={(e) => {
                                const needsBudget = task.isBudgetRelated && (!task.budget || task.budget <= 0);
                                const needsVendor = task.isVendorRelated && !task.vendorId;

                                if (needsBudget || needsVendor) {
                                    e.stopPropagation();
                                    setFeedback(needsBudget ? 'Budget Info Required!' : 'Vendor Info Required!');
                                    setTimeout(() => setFeedback(null), 1500);
                                    // Optionally trigger the modal open if we want to be helpful, 
                                    // but simply blocking and showing feedback is safer/clearer for now 
                                    // as the user will naturally click the card body next.
                                    // To be extra helpful, let's trigger the card click:
                                    onClick();
                                } else {
                                    handleAction(e, 'Submitted', 'Sent for Review!');
                                }
                            }}
                            className="group p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Mark for Review"
                        >
                            <Circle size={24} className="group-hover:hidden" />
                            <CheckCircle size={24} className="hidden group-hover:block" />
                        </button>
                    ) : (
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${task.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                            task.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                'bg-gray-50 text-gray-600 border-gray-100'
                            }`}>
                            {task.status}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-start justify-between gap-4 text-xs font-medium text-gray-500 mb-4">
                <div className="flex flex-wrap gap-4 pt-1">
                    {task.rejectionNote && task.status === 'Open' && (
                        <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2 py-1 rounded-md font-bold animate-pulse">
                            <AlertOctagon size={14} />
                            <span>Action Required</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                        <Clock size={14} className="text-primary-500" />
                        <span>{task.dueDate}</span>
                    </div>
                    {task.checklist && task.checklist.length > 0 && (
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                            <CheckSquare size={14} className="text-primary-500" />
                            <span>
                                {task.checklist.filter(i => i.completed).length}/{task.checklist.length}
                            </span>
                        </div>
                    )}
                    {task.location && (
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                            <MapPin size={14} className="text-primary-500" />
                            <span className="truncate max-w-[100px]">{task.location}</span>
                        </div>
                    )}
                </div>

                {/* Worker/Vendor Details - Merged & Compact */}
                <div className="flex flex-col items-end gap-1 ml-auto shrink-0">
                    {worker && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-[8px] text-white font-bold">
                                    {worker.name.charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-gray-600">{worker.name}</span>
                            </div>
                            <button
                                onClick={(e) => handleWhatsApp(e, worker)}
                                className="p-1 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                title="Message on WhatsApp"
                            >
                                <MessageCircle size={14} />
                            </button>
                        </div>
                    )}
                    {vendor && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[8px] text-purple-700 font-bold border border-purple-200">
                                    {vendor.name.charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-gray-600">{vendor.name} (Vendor)</span>
                            </div>
                            <button
                                onClick={(e) => handleWhatsApp(e, vendor)}
                                className="p-1 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                title="Message on WhatsApp"
                            >
                                <MessageCircle size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-gray-600">
                        <CheckSquare size={14} className="text-primary-500" />
                        <span>{task.checklistDone}/{task.checklistTotal} items</span>
                    </div>
                    <span className="font-bold text-gray-900">
                        {task.checklistTotal > 0 ? Math.round((task.checklistDone / task.checklistTotal) * 100) : 0}%
                    </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${task.checklistTotal > 0 ? (task.checklistDone / task.checklistTotal) * 100 : 0}%` }}
                    />
                </div>
            </div>

            {permissions.canApprove && task.status === 'Submitted' && (
                <div className="mt-4 pt-3 border-t border-gray-50 flex flex-col gap-2">
                    {showRejectPrompt ? (
                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                            <input
                                type="text"
                                placeholder="Reason for rejection (Required)..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-900 placeholder:text-red-300 focus:ring-2 focus:ring-red-500 outline-none"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (!rejectReason.trim()) return;
                                        setFeedback('Task Rejected');
                                        await updateTask({ ...task, status: 'Open', rejectionNote: rejectReason });
                                        setTimeout(() => setFeedback(null), 1000);
                                        setShowRejectPrompt(false);
                                        setRejectReason('');
                                    }}
                                    disabled={!rejectReason.trim()}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
                                >
                                    Confirm Reject
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowRejectPrompt(false); setRejectReason(''); }}
                                    className="px-3 bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-green-700 shadow-sm shadow-green-200">
                                <Check size={14} /> Approve
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowRejectPrompt(true); }}
                                className="flex-1 bg-red-50 text-red-600 border border-red-100 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-100"
                            >
                                <XCircle size={14} /> Reject
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskCard;
