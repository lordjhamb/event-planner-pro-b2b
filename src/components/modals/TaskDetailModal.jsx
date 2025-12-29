import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, CheckSquare, DollarSign, Briefcase, Trash2, Pencil, Check, Store, ShieldAlert, LifeBuoy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { createWhatsAppLink, getTaskAssignmentMessage } from '../../utils/whatsapp';

const TaskDetailModal = ({ task, onClose, onSelectWorker, onSelectEvent, onEditTask }) => {
    // Safety check for Auth Context
    const auth = useAuth() || {};
    const permissions = auth.permissions || {};
    const currentUser = auth.currentUser || {};

    // Safety check for Data Context
    const dataContext = useData() || {};
    const {
        events = [],
        workers = [],
        vendors = [],
        tasks = [],
        inventory = [],
        updateTask = () => { },
        updateTaskStatus = () => { },
        deleteTask = () => { },
        inventoryRequests = [],
        requestInventory = () => { },
        updateInventoryRequestStatus = () => { },
        markInventoryUsed = () => { },
        logInventoryTransaction = () => { }
    } = dataContext;

    const [transItem, setTransItem] = useState('');
    const [transQty, setTransQty] = useState('');
    const [editingBudget, setEditingBudget] = useState(false);
    const [tempBudget, setTempBudget] = useState('');
    const [showVendorPicker, setShowVendorPicker] = useState(false);
    const [showRejectPrompt, setShowRejectPrompt] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showHelpPrompt, setShowHelpPrompt] = useState(false);
    const [helpNoteInput, setHelpNoteInput] = useState('');

    if (!task) return null;

    // Use live task data from context to ensure updates are reflected immediately
    // Safe access to tasks array
    const liveTask = (tasks && tasks.length > 0 ? tasks.find(t => t.id === task.id) : task) || task;

    // Safety check if liveTask ended up null (unlikely but possible)
    if (!liveTask) return null;

    // Derived values with safety checks
    const event = events?.find(e => e.id === liveTask.eventId);
    const worker = workers?.find(w => w.id === liveTask.assignee);
    const vendor = vendors?.find(v => v.id === liveTask.vendorId);

    // Handler for inline inventory actions
    const handleInventoryAction = (actionType) => {
        if (!transItem || !transQty) return;

        const notePrefix = actionType === 'check-out' ? 'Requested: ' : 'Used: ';

        if (logInventoryTransaction) {
            logInventoryTransaction({
                itemId: transItem,
                eventId: liveTask.eventId,
                taskId: liveTask.id,
                type: 'Check-Out',
                quantity: parseInt(transQty),
                notes: `${notePrefix} via Task UI`
            });
        }
        setTransItem('');
        setTransQty('');
    };

    const handleToggleSubtask = (index) => {
        if (!liveTask.checklist || !Array.isArray(liveTask.checklist)) return;

        const updatedChecklist = [...liveTask.checklist];
        if (!updatedChecklist[index]) return;

        updatedChecklist[index] = { ...updatedChecklist[index], completed: !updatedChecklist[index].completed };

        const doneCount = updatedChecklist.filter(i => i && i.completed).length;

        updateTask({
            ...liveTask,
            checklist: updatedChecklist,
            checklistDone: doneCount,
            checklistTotal: updatedChecklist.length
        });
    };

    const handleStatusChange = (newStatus) => {
        updateTaskStatus(liveTask.id, newStatus);
    };

    const saveBudget = () => {
        if (!tempBudget) return;
        updateTask({ ...liveTask, budget: parseInt(tempBudget) });
        setEditingBudget(false);
    };

    const saveVendor = (vId) => {
        updateTask({ ...liveTask, vendorId: vId });
        setShowVendorPicker(false);
    };

    // Derived stats
    const checklist = (liveTask.checklist && Array.isArray(liveTask.checklist)) ? liveTask.checklist : [];
    const totalItems = checklist.length || liveTask.checklistTotal || 0;
    const completedItems = checklist.length > 0
        ? checklist.filter(i => i && i.completed).length
        : (liveTask.checklistDone || 0);
    const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    // Strict Validation Logic based on checkboxes
    const needsBudget = liveTask.isBudgetRelated && (!liveTask.budget || liveTask.budget <= 0);
    const needsVendor = liveTask.isVendorRelated && !liveTask.vendorId;

    // Can only submit if requirements depend on the flags
    const canSubmit = !needsBudget && !needsVendor;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex items-start justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                                {liveTask.priority} Priority
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                                {liveTask.status}
                            </span>
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-1">{liveTask.title}</h2>
                        {event && (
                            <button onClick={() => onSelectEvent(event)} className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                {event.name} <span className="text-gray-400">→</span>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEditTask(liveTask)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
                            <Pencil size={20} />
                        </button>
                        <button
                            onClick={() => setShowHelpPrompt(true)}
                            title="Request Help / Add Note"
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                        >
                            <LifeBuoy size={20} />
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
                                <Trash2 size={20} />
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
                    {/* Rejection Banner */}
                    {liveTask.helpNote && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-4 animate-pulse mb-4">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                                <LifeBuoy size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-bold text-orange-900 mb-1">Help / Note Added</h4>
                                    <button
                                        onClick={() => updateTask({ ...liveTask, helpNote: null })}
                                        className="text-orange-400 hover:text-orange-700 text-xs font-bold"
                                    >
                                        Resolve / Clear
                                    </button>
                                </div>
                                <p className="text-sm text-orange-800 leading-relaxed">
                                    "{liveTask.helpNote}"
                                </p>
                            </div>
                        </div>
                    )}
                    {liveTask.rejectionNote && liveTask.status === 'Open' && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4 animate-pulse">
                            <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-red-900 mb-1">Task Rejected</h4>
                                <p className="text-sm text-red-700 leading-relaxed">
                                    {liveTask.rejectionNote}
                                </p>
                                <div className="mt-2 text-xs font-medium text-red-500">
                                    Please address the issues and re-submit.
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{liveTask.description || 'No description provided.'}</p>
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
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => onSelectWorker(worker)} className="text-primary-600 hover:underline font-medium">
                                                    {worker.name}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {/* Always show budget if it exists, OR if it's required */}
                                    {(liveTask.budget || liveTask.isBudgetRelated) && (
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <DollarSign size={18} className={needsBudget ? "text-red-500" : "text-gray-400"} />
                                            <span className="font-semibold w-24">Budget:</span>
                                            {liveTask.budget && liveTask.budget > 0 ? (
                                                <span className="font-mono">₹{parseInt(liveTask.budget).toLocaleString()}</span>
                                            ) : (
                                                <span className="text-red-500 italic text-xs">Required</span>
                                            )}
                                        </div>
                                    )}
                                    {/* Always show vendor if it exists, OR if it's required */}
                                    {(vendor || liveTask.isVendorRelated) && (
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <Store size={18} className={needsVendor ? "text-red-500" : "text-gray-400"} />
                                            <span className="font-semibold w-24">Vendor:</span>
                                            {vendor ? (
                                                <span className="text-purple-600 font-medium">{vendor.name}</span>
                                            ) : (
                                                <span className="text-red-500 italic text-xs">Required</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Inline Prompts - ONLY show if flags are ticked AND data is missing */}
                        {(needsBudget || needsVendor) && liveTask.status !== 'Submitted' && liveTask.status !== 'Approved' && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-4 animate-pulse">
                                <h4 className="flex items-center gap-2 text-red-800 font-bold text-sm mb-2">
                                    <ShieldAlert size={16} />
                                    Action Required to Complete
                                </h4>
                                <div className="flex flex-col gap-2">
                                    {needsBudget && (
                                        <button
                                            onClick={() => { setEditingBudget(true); setTempBudget(''); }}
                                            className="flex items-center justify-between p-2 bg-white rounded border border-red-200 text-sm text-red-700 hover:bg-red-50"
                                        >
                                            <span><span className="font-bold">+</span> Enter Actual Amount Spent</span>
                                        </button>
                                    )}
                                    {needsVendor && (
                                        <button
                                            onClick={() => setShowVendorPicker(true)}
                                            className="flex items-center justify-between p-2 bg-white rounded border border-red-200 text-sm text-red-700 hover:bg-red-50"
                                        >
                                            <span><span className="font-bold">+</span> Select Vendor Used</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Inline Budget Editor */}
                        {editingBudget && (
                            <div className="bg-white p-3 border border-primary-100 rounded-xl shadow-lg mb-4">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Enter Amount</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        className="flex-1 border border-gray-200 rounded-lg p-2 text-sm"
                                        placeholder="e.g. 50000"
                                        value={tempBudget}
                                        onChange={e => setTempBudget(e.target.value)}
                                        autoFocus
                                    />
                                    <button onClick={saveBudget} className="bg-primary-600 text-white px-3 rounded-lg text-sm font-bold">Save</button>
                                    <button onClick={() => setEditingBudget(false)} className="text-gray-400 hover:text-gray-600 px-2">Cancel</button>
                                </div>
                            </div>
                        )}

                        {/* Inline Vendor Picker */}
                        {showVendorPicker && (
                            <div className="bg-white p-3 border border-primary-100 rounded-xl shadow-lg mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-gray-500 block">Select Vendor</label>
                                    <button onClick={() => setShowVendorPicker(false)} className="text-gray-400 hover:text-gray-600">Close</button>
                                </div>
                                <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                                    {vendors?.map(v => (
                                        <button
                                            key={v.id}
                                            onClick={() => saveVendor(v.id)}
                                            className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center justify-between group"
                                        >
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">{v.name}</span>
                                            <span className="text-xs text-gray-400">{v.category}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inventory Section (New Inline) */}
                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">Inventory & Equipment</h3>

                            {/* 1. Request New Item Form */}
                            <div className="space-y-3 mb-6">
                                <p className="text-xs text-gray-500">Request additional items:</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-2">
                                        <select
                                            className="w-full text-sm p-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                                            value={transItem}
                                            onChange={(e) => setTransItem(e.target.value)}
                                        >
                                            <option value="">Select Item...</option>
                                            {inventory?.map(item => (
                                                <option key={item.id} value={item.id}>{item.name} ({item.availableQuantity})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full text-sm p-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                            placeholder="Qty"
                                            value={transQty}
                                            onChange={(e) => setTransQty(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (transItem && transQty) {
                                            requestInventory(liveTask.id, transItem, parseInt(transQty));
                                            setTransItem('');
                                            setTransQty('');
                                        }
                                    }}
                                    disabled={!transItem || !transQty}
                                    className="w-full py-2 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold hover:bg-orange-200 transition-colors disabled:opacity-50"
                                >
                                    Request Item
                                </button>
                            </div>

                            {/* 2. List of Requests */}
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase">Requested Items</h4>
                                {inventoryRequests?.filter(r => r.taskId?.toString() === liveTask.id?.toString()).map(req => {
                                    const item = inventory.find(i => i.id === req.itemId);
                                    if (!item) return null;

                                    return (
                                        <div key={req.id} className="bg-white p-3 rounded-lg border border-orange-100 shadow-sm flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-bold text-gray-800">{item.name}</div>
                                                <div className="text-xs text-gray-500">Qty: {req.quantity} • <span className={`font-bold ${req.status === 'Approved' ? 'text-green-600' :
                                                    req.status === 'Rejected' ? 'text-red-600' :
                                                        req.status === 'Used' ? 'text-purple-600' : 'text-orange-500'
                                                    }`}>{req.status}</span></div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                {/* Lead/Owner: Approve/Reject */}
                                                {permissions.canApprove && req.status === 'Requested' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateInventoryRequestStatus(req.id, 'Approved')}
                                                            className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Approve"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateInventoryRequestStatus(req.id, 'Rejected')}
                                                            className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Reject"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </>
                                                )}

                                                {/* Worker: Log Used */}
                                                {req.status === 'Approved' && (
                                                    <button
                                                        onClick={() => markInventoryUsed(req.id)}
                                                        className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-bold hover:bg-purple-100 border border-purple-200"
                                                    >
                                                        Log Used
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {inventoryRequests.filter(r => r.taskId === liveTask.id).length === 0 && (
                                    <p className="text-xs text-gray-400 italic text-center py-2">No items requested yet.</p>
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
                                {completedItems}/{totalItems}
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                            <div
                                className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="space-y-3">
                            {/* Real Checklist Items */}
                            {checklist.length > 0 ? (
                                checklist.map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleToggleSubtask(i)}
                                        className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                    >
                                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.completed
                                            ? 'bg-primary-500 border-primary-500 text-white'
                                            : 'border-gray-300 text-transparent group-hover:border-primary-400'
                                            }`}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className={`text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                            {item.text}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-400 text-sm italic">
                                    No subtasks
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-3 shrink-0">
                    <div className="flex-1 flex gap-2">
                        <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                            <span className="hidden sm:inline">Comments</span>
                        </button>
                    </div>

                    <div className="flex gap-3 flex-1 md:justify-end">
                        {(permissions.isWorker || currentUser.role === 'owner') && liveTask.status === 'Open' && (
                            <button
                                onClick={() => handleStatusChange('In Progress')}
                                className="flex-1 md:flex-none px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                            >
                                Start Task
                            </button>
                        )}
                        {(permissions.isWorker || currentUser.role === 'owner') && liveTask.status === 'In Progress' && (
                            <button
                                onClick={() => handleStatusChange('Submitted')}
                                disabled={!canSubmit}
                                title={!canSubmit ? "Pending Budget or Vendor Verification" : "Submit for Approval"}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 ${!canSubmit
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30'
                                    }`}
                            >
                                {canSubmit ? 'Submit for Approval' : 'Requirements Pending'}
                            </button>
                        )}
                        {permissions.canApprove && (liveTask.status === 'Submitted' || liveTask.status === 'Pending') && (
                            <>
                                {showRejectPrompt ? (
                                    <div className="flex-1 flex flex-col md:flex-row gap-2 animate-fade-in w-full md:w-auto">
                                        <input
                                            type="text"
                                            placeholder="Reason for rejection..."
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            className="flex-1 border border-red-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-red-50 text-red-900 placeholder-red-300"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    if (!rejectReason.trim()) return;
                                                    updateTask({ ...liveTask, status: 'Open', rejectionNote: rejectReason });
                                                    setRejectReason('');
                                                    setShowRejectPrompt(false);
                                                }}
                                                disabled={!rejectReason.trim()}
                                                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => { setShowRejectPrompt(false); setRejectReason(''); }}
                                                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setShowRejectPrompt(true)}
                                            className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('Approved')}
                                            className="flex-1 md:flex-none px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                                        >
                                            Approve
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* Help Input Modal Overlay */}
            {showHelpPrompt && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 rounded-3xl animate-fade-in">
                    <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <LifeBuoy className="text-orange-500" /> Add Help Note
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            This note will be visible to everyone on the task. Use this to ask for help or flag an issue.
                        </p>
                        <textarea
                            value={helpNoteInput}
                            onChange={(e) => setHelpNoteInput(e.target.value)}
                            placeholder="Describe what you need help with..."
                            className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm resize-none mb-4 bg-gray-50"
                            autoFocus
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => { setShowHelpPrompt(false); setHelpNoteInput(''); }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (helpNoteInput.trim()) {
                                        updateTask({ ...liveTask, helpNote: helpNoteInput });
                                        setShowHelpPrompt(false);
                                        setHelpNoteInput('');
                                    }
                                }}
                                disabled={!helpNoteInput.trim()}
                                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                            >
                                Add Note
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetailModal;
