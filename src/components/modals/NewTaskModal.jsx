import React, { useState } from 'react';
import { X, CheckSquare, Users, Award, Tag, DollarSign, Camera, FileText, Upload, Check, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const NewTaskModal = ({ isOpen, onClose, selectedEvent }) => {
    const { currentUser } = useAuth();
    const { workers, vendors } = useData();

    const [isBudgetRelated, setIsBudgetRelated] = useState(false);
    const [isVendorRelated, setIsVendorRelated] = useState(false);
    const [requiresApproval, setRequiresApproval] = useState(false);
    const [requiresImageUpload, setRequiresImageUpload] = useState(false);
    const [referenceImage, setReferenceImage] = useState(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl" style={{ maxHeight: '75vh', display: 'flex', flexDirection: 'column' }}>
                {/* Fixed Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl" style={{ flexShrink: 0 }}>
                    <h2 className="text-lg font-bold">Create New Task</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-4 space-y-4" style={{ overflowY: 'auto', flex: 1 }}>
                    {selectedEvent && (
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <div className="text-xs text-indigo-600 font-medium mb-1">Adding task to:</div>
                            <div className="font-semibold text-indigo-900">{selectedEvent.name}</div>
                        </div>
                    )}

                    {/* Basic Fields */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                        <input
                            type="text"
                            placeholder="e.g., Setup Main Stage"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                            rows="3"
                            placeholder="Describe the task in detail..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="">Select worker...</option>
                            {workers.map(worker => (
                                <option key={worker.id} value={worker.id}>
                                    {worker.name} - {worker.skills[0]} {worker.available ? '✓' : '(Busy)'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Department & Approval Section */}
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <CheckSquare size={16} className="text-indigo-600" />
                            Department & Approval
                        </h3>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Department Category</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                    <option value="">General</option>
                                    <option value="decor">Decor & Ambiance</option>
                                    <option value="catering">Catering & Hospitality</option>
                                    <option value="technical">Technical & AV</option>
                                    {/* ... other options */}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Task Budget (₹)</label>
                                <input
                                    type="number"
                                    placeholder="e.g., 50000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Award size={14} className="text-blue-600" />
                                Task Approver
                            </label>

                            <div className="mb-2">
                                <div className="flex items-center gap-2 p-2 bg-white rounded border border-blue-300">
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {currentUser.role === 'lead' ? currentUser.name : 'Rahul Kumar'} (You)
                                        </div>
                                        <div className="text-xs text-gray-600">Auto-assigned as task creator</div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                                        <Check size={12} />
                                        Approver
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Task Requirements Section - Simplified */}
                    <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Task Requirements</label>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="budgetRelated"
                                    checked={isBudgetRelated}
                                    onChange={(e) => setIsBudgetRelated(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                    <label htmlFor="budgetRelated" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                                        <DollarSign size={16} className="text-green-600" />
                                        Budget Related
                                    </label>
                                </div>
                            </div>
                            {/* ... other checkboxes ... */}
                        </div>
                    </div>

                </div>

                {/* Fixed Footer */}
                <div className="p-4 flex gap-3 border-t border-gray-200 bg-white rounded-b-2xl" style={{ flexShrink: 0 }}>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewTaskModal;
