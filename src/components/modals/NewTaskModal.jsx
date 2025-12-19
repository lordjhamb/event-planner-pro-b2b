
import React, { useState } from 'react';
import { X, CheckSquare, Users, Tag, DollarSign, Check, Info, Calendar, Store, ShieldCheck, Camera, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const NewTaskModal = ({ isOpen, onClose, selectedEvent, taskToEdit }) => {
    const { currentUser } = useAuth();
    const { workers, events, vendors, addTask, updateTask } = useData();

    const [taskBudget, setTaskBudget] = useState('');
    const [isBudgetRelated, setIsBudgetRelated] = useState(false);
    const [isVendorRelated, setIsVendorRelated] = useState(false);
    const [requiresApproval, setRequiresApproval] = useState(false);
    const [requiresPhotoProof, setRequiresPhotoProof] = useState(false);

    // Auto-assignment Logic
    const [approver, setApprover] = useState(currentUser.role === 'lead' ? currentUser : { name: 'Owner', role: 'owner' });
    const [showChangeApprover, setShowChangeApprover] = useState(false);
    const [isAutoEscalated, setIsAutoEscalated] = useState(false);

    // Checklist Logic
    const [checklistItems, setChecklistItems] = useState([]);
    const [newChecklistItem, setNewChecklistItem] = useState('');

    const [selectedEventId, setSelectedEventId] = useState(selectedEvent?.id || '');

    // Form Refs for non-controlled inputs (Quick fix)
    const titleRef = React.useRef(null);
    const descriptionRef = React.useRef(null);
    const priorityRef = React.useRef(null);
    const dueDateRef = React.useRef(null);
    const assigneeRef = React.useRef(null);
    const vendorRef = React.useRef(null);


    const addChecklistItem = () => {
        if (newChecklistItem.trim()) {
            setChecklistItems([...checklistItems, { id: Date.now(), text: newChecklistItem, done: false }]);
            setNewChecklistItem('');
        }
    };

    const removeChecklistItem = (id) => {
        setChecklistItems(checklistItems.filter(item => item.id !== id));
    };

    // Handle Budget Escalation
    React.useEffect(() => {
        if (!selectedEvent || !taskBudget) return;

        const threshold = selectedEvent.budgetThreshold || 500000; // Default 5L
        const budgetValue = parseFloat(taskBudget);

        if (budgetValue > threshold) {
            setIsAutoEscalated(true);
            setRequiresApproval(true);
            // Force Owner Approval
            setApprover({ name: 'Owner (Auto-escalated)', role: 'owner' });
        } else {
            setIsAutoEscalated(false);
            if (!requiresApproval) {
                // Revert to default logic
                setApprover(currentUser.role === 'lead' ? currentUser : { name: 'Owner', role: 'owner' });
            }
        }
    }, [taskBudget, selectedEvent, requiresApproval, currentUser]);

    // Reset or Pre-fill Form when Modal Opens
    React.useEffect(() => {
        if (isOpen) {
            if (taskToEdit) {
                // Edit Mode: Pre-fill
                setTaskBudget(taskToEdit.budget || '');
                setIsBudgetRelated(taskToEdit.isBudgetRelated);
                setIsVendorRelated(taskToEdit.isVendorRelated);
                setRequiresApproval(taskToEdit.requiresApproval);
                setRequiresPhotoProof(taskToEdit.requiresPhotoProof);
                setApprover(taskToEdit.approver || (currentUser.role === 'lead' ? currentUser : { name: 'Owner', role: 'owner' }));
                setChecklistItems(taskToEdit.checklistItems || []);
                setSelectedEventId(taskToEdit.eventId);

                // Pre-fill Refs (setTimeout to ensure DOM is ready if needed, though usually fine here)
                setTimeout(() => {
                    if (titleRef.current) titleRef.current.value = taskToEdit.title;
                    if (descriptionRef.current) descriptionRef.current.value = taskToEdit.description;
                    if (priorityRef.current) priorityRef.current.value = taskToEdit.priority;
                    if (dueDateRef.current) dueDateRef.current.value = taskToEdit.dueDate;
                    if (assigneeRef.current) assigneeRef.current.value = taskToEdit.assignee;
                    if (vendorRef.current) vendorRef.current.value = taskToEdit.vendorId || '';
                }, 0);

            } else {
                // Create Mode: Reset
                setTaskBudget('');
                setIsBudgetRelated(false);
                setIsVendorRelated(false);
                setRequiresApproval(false);
                setRequiresPhotoProof(false);
                setApprover(currentUser.role === 'lead' ? currentUser : { name: 'Owner', role: 'owner' });
                setShowChangeApprover(false);
                setIsAutoEscalated(false);
                setChecklistItems([]);
                setNewChecklistItem('');
                setSelectedEventId(selectedEvent?.id || '');

                // Reset Refs
                if (titleRef.current) titleRef.current.value = '';
                if (descriptionRef.current) descriptionRef.current.value = '';
                if (priorityRef.current) priorityRef.current.value = 'Medium';
                if (dueDateRef.current) dueDateRef.current.value = '';
                if (assigneeRef.current) assigneeRef.current.value = '';
                if (vendorRef.current) vendorRef.current.value = '';
            }
        }
    }, [isOpen, selectedEvent, currentUser, taskToEdit]);


    const handleCreateTask = () => {
        if (!selectedEventId && !selectedEvent) {
            alert('Please select an event');
            return;
        }

        const taskData = {
            id: taskToEdit ? taskToEdit.id : Date.now(), // Keep ID if editing
            eventId: selectedEventId || selectedEvent.id,
            title: titleRef.current?.value || 'New Task',
            description: descriptionRef.current?.value || '',
            priority: priorityRef.current?.value || 'Medium',
            dueDate: dueDateRef.current?.value || new Date().toISOString().split('T')[0],
            assignee: assigneeRef.current?.value,
            vendorId: vendorRef.current?.value,
            status: requiresApproval ? 'Submitted' : (taskToEdit ? taskToEdit.status : 'Pending'), // Keep status if editing unless approval needed
            budget: taskBudget,
            isBudgetRelated,
            isVendorRelated,
            requiresApproval,
            requiresPhotoProof,
            checklistItems: checklistItems,
            checklistTotal: checklistItems.length,
            checklistDone: taskToEdit ? taskToEdit.checklistDone : 0, // Preserve progress if editing
            approver: approver,
            createdAt: taskToEdit ? taskToEdit.createdAt : new Date().toISOString()
        };

        if (taskToEdit) {
            updateTask(taskData);
        } else {
            addTask(taskData);
        }
        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
                        <p className="text-sm text-gray-500">{taskToEdit ? 'Update task details' : 'Assign specific work to your team'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Event Selection Context */}
                    {selectedEvent ? (
                        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <Tag size={20} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Adding task to event</div>
                                <div className="font-bold text-indigo-900">{selectedEvent.name}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-700">Select Event *</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none"
                                    value={selectedEventId}
                                    onChange={(e) => setSelectedEventId(e.target.value)}
                                >
                                    <option value="">Select an event...</option>
                                    {events.map(event => (
                                        <option key={event.id} value={event.id}>{event.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Basic Fields */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
                            <Info size={16} className="text-primary-600" />
                            Task Details
                        </h3>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Task Title *</label>
                            <input
                                ref={titleRef}
                                type="text"
                                placeholder="e.g., Setup Main Stage"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                            <textarea
                                ref={descriptionRef}
                                rows="3"
                                placeholder="Describe the task in detail..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Priority</label>
                                <select ref={priorityRef} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all">
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Due Date</label>
                                <input
                                    ref={dueDateRef}
                                    type="date"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Assign To</label>
                            <select ref={assigneeRef} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all">
                                <option value="">Select worker...</option>
                                {workers.map(worker => (
                                    <option key={worker.id} value={worker.id}>
                                        {worker.name} - {worker.skills[0]} {worker.available ? '✓' : '(Busy)'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Auto-Assignment & Approver Section */}
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold text-blue-800 flex items-center gap-2">
                                <ShieldCheck size={14} className="text-blue-600" />
                                Assigned Approver
                            </label>
                            {!isAutoEscalated && (
                                <button
                                    onClick={() => setShowChangeApprover(!showChangeApprover)}
                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline"
                                >
                                    Change Approver?
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-200 shadow-sm transition-all">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                {approver.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-bold text-gray-900">
                                    {approver.id === currentUser.id ? `${approver.name} (You)` : approver.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {isAutoEscalated ? 'Auto-escalated due to high budget' : 'Auto-set as task creator'}
                                </div>
                            </div>
                            {isAutoEscalated && (
                                <div className="flex items-center gap-1 text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 rounded-md border border-red-100">
                                    <DollarSign size={10} />
                                    Review Required
                                </div>
                            )}
                        </div>

                        {showChangeApprover && !isAutoEscalated && (
                            <div className="mt-3 p-3 bg-white border border-gray-200 rounded-xl animate-fade-in">
                                <p className="text-xs font-bold text-gray-500 mb-2">Select new approver:</p>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="approver"
                                            checked={approver.id === currentUser.id}
                                            onChange={() => {
                                                setApprover(currentUser);
                                                setShowChangeApprover(false);
                                            }}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-xs font-medium text-gray-700">{currentUser.name} (Me)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="approver"
                                            checked={approver.role === 'owner' && approver.id !== currentUser.id}
                                            onChange={() => {
                                                setApprover({ name: 'Owner', role: 'owner' });
                                                setShowChangeApprover(false);
                                            }}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-xs font-medium text-gray-700">Event Owner / Primary Lead</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Checklist Builder */}
                    <div className="pt-4 border-t border-gray-100">
                        <label className="block text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckSquare size={16} className="text-primary-600" />
                            Checklist / Sub-tasks
                        </label>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a sub-task..."
                                    value={newChecklistItem}
                                    onChange={(e) => setNewChecklistItem(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                />
                                <button
                                    onClick={addChecklistItem}
                                    disabled={!newChecklistItem.trim()}
                                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {checklistItems.length > 0 && (
                                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                    {checklistItems.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm animate-fade-in">
                                            <span className="text-sm text-gray-700">{item.text}</span>
                                            <button
                                                onClick={() => removeChecklistItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {checklistItems.length === 0 && (
                                <p className="text-xs text-gray-400 text-center italic">No sub-tasks added yet</p>
                            )}
                        </div>
                    </div>

                    {/* Task Requirements Section */}
                    <div className="pt-4 border-t border-gray-100">
                        <label className="block text-sm font-bold text-gray-900 mb-4">Task Configuration</label>
                        <div className="space-y-4">

                            {/* Budget Related */}
                            <div className={`border rounded - xl transition - all duration - 300 ${isBudgetRelated ? 'border-green-200 bg-green-50/50' : 'border-gray-200 hover:border-green-200'} `}>
                                <label className="flex items-center gap-3 p-3 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isBudgetRelated}
                                            onChange={(e) => setIsBudgetRelated(e.target.checked)}
                                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-green-600 checked:border-green-600 transition-colors"
                                        />
                                        <Check size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                    </div>
                                    <div className="flex-1 font-bold text-gray-700 flex items-center gap-2">
                                        <div className={`p - 1.5 rounded - lg ${isBudgetRelated ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'} `}>
                                            <DollarSign size={16} />
                                        </div>
                                        <span>Budget Related</span>
                                    </div>
                                </label>

                                {isBudgetRelated && (
                                    <div className="px-4 pb-4 animate-slide-down">
                                        <div className="pl-11">
                                            <p className="text-xs text-gray-500 mb-3">Worker will be required to enter the actual amount spent upon completion.</p>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Estimated Budget (₹)</label>
                                            <input
                                                type="number"
                                                placeholder="e.g., 50000"
                                                value={taskBudget}
                                                onChange={(e) => setTaskBudget(e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            />
                                            {isAutoEscalated && (
                                                <div className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1">
                                                    <Info size={12} />
                                                    Exceeds approval threshold (₹{selectedEvent?.budgetThreshold?.toLocaleString() || '5,00,000'}). Owner approval required.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Vendor Related */}
                            <div className={`border rounded - xl transition - all duration - 300 ${isVendorRelated ? 'border-purple-200 bg-purple-50/50' : 'border-gray-200 hover:border-purple-200'} `}>
                                <label className="flex items-center gap-3 p-3 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isVendorRelated}
                                            onChange={(e) => setIsVendorRelated(e.target.checked)}
                                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-purple-600 checked:border-purple-600 transition-colors"
                                        />
                                        <Check size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                    </div>
                                    <div className="flex-1 font-bold text-gray-700 flex items-center gap-2">
                                        <div className={`p - 1.5 rounded - lg ${isVendorRelated ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'} `}>
                                            <Store size={16} />
                                        </div>
                                        <span>Vendor Related</span>
                                    </div>
                                </label>

                                {isVendorRelated && (
                                    <div className="px-4 pb-4 animate-slide-down">
                                        <div className="pl-11">
                                            <p className="text-xs text-gray-500 mb-3">Worker must provide vendor details on completion.</p>
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Preferred Vendor (Optional)</label>
                                            <select ref={vendorRef} className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all">
                                                <option value="">Select a vendor...</option>
                                                {vendors.map(vendor => (
                                                    <option key={vendor.id} value={vendor.id}>{vendor.name} ({vendor.category})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Require Approval */}
                            <div className={`border rounded - xl transition - all duration - 300 ${requiresApproval ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 hover:border-blue-200'} `}>
                                <label className="flex items-center gap-3 p-3 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={requiresApproval}
                                            onChange={(e) => setRequiresApproval(e.target.checked)}
                                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 transition-colors"
                                        />
                                        <Check size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                    </div>
                                    <div className="flex-1 font-bold text-gray-700 flex items-center gap-2">
                                        <div className={`p - 1.5 rounded - lg ${requiresApproval ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'} `}>
                                            <ShieldCheck size={16} />
                                        </div>
                                        <span>Require Approval</span>
                                    </div>
                                </label>

                                {requiresApproval && (
                                    <div className="px-4 pb-4 animate-slide-down">
                                        <div className="pl-11">
                                            <p className="text-xs text-blue-600 bg-blue-100/50 p-2 rounded-lg border border-blue-200">
                                                {isAutoEscalated
                                                    ? "Auto-escalated to Owner due to high budget."
                                                    : `Task will be reviewed by ${approver.name}.`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Photo Proof */}
                            <div className={`border rounded - xl transition - all duration - 300 ${requiresPhotoProof ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200 hover:border-orange-200'} `}>
                                <label className="flex items-center gap-3 p-3 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={requiresPhotoProof}
                                            onChange={(e) => setRequiresPhotoProof(e.target.checked)}
                                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-orange-600 checked:border-orange-600 transition-colors"
                                        />
                                        <Check size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                    </div>
                                    <div className="flex-1 font-bold text-gray-700 flex items-center gap-2">
                                        <div className={`p - 1.5 rounded - lg ${requiresPhotoProof ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'} `}>
                                            <Camera size={16} />
                                        </div>
                                        <span>Photo Proof Required</span>
                                    </div>
                                </label>

                                {requiresPhotoProof && (
                                    <div className="px-4 pb-4 animate-slide-down">
                                        <div className="pl-11">
                                            <label className="block text-xs font-bold text-gray-600 mb-1.5">Minimum Photos Required</label>
                                            <select className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all">
                                                <option value="1">1 Photo</option>
                                                <option value="2">2 Photos</option>
                                                <option value="3">3 Photos</option>
                                                <option value="5">5+ Photos</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Summary Box (Only visible if at least one requirement is checked) */}
                    {(isBudgetRelated || isVendorRelated || requiresApproval || requiresPhotoProof) && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Completion Requirements Summary</h4>
                            <ul className="space-y-1">
                                {isBudgetRelated && <li className="text-sm text-gray-700 flex items-center gap-2"><Check size={14} className="text-green-500" /> Enter actual budget spent</li>}
                                {isVendorRelated && <li className="text-sm text-gray-700 flex items-center gap-2"><Check size={14} className="text-purple-500" /> Provide vendor details</li>}
                                {requiresPhotoProof && <li className="text-sm text-gray-700 flex items-center gap-2"><Check size={14} className="text-orange-500" /> Upload photos</li>}
                                {requiresApproval && <li className="text-sm text-gray-700 flex items-center gap-2"><Check size={14} className="text-blue-500" /> Submit for modification approval</li>}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4 shrink-0">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateTask}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
                    >
                        {taskToEdit ? 'Save Changes' : 'Create Task'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewTaskModal;
