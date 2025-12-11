import React, { useState } from 'react';
import { X, CheckSquare, Users, Plus, Award, Briefcase } from 'lucide-react';
import { useData } from '../../context/DataContext';

const NewEventModal = ({ isOpen, onClose }) => {
    const { workers } = useData();
    const [budgetThreshold, setBudgetThreshold] = useState('500000');
    const [enableAutoEscalation, setEnableAutoEscalation] = useState(true);
    const [primaryLead, setPrimaryLead] = useState('');
    const [departmentLeads, setDepartmentLeads] = useState([]);
    const [showAddDeptLead, setShowAddDeptLead] = useState(false);
    const [newDeptCategory, setNewDeptCategory] = useState('');
    const [newDeptLead, setNewDeptLead] = useState('');

    const departmentCategories = [
        'Decor & Ambiance',
        'Catering & Hospitality',
        'Technical & AV',
        'Logistics & Transport',
        'Registration & Guest Management',
        'Entertainment',
        'Photography & Videography',
        'Security'
    ];

    const availableLeads = workers.filter(w => w.available);

    const addDepartmentLead = () => {
        if (newDeptCategory && newDeptLead) {
            const leadInfo = availableLeads.find(l => l.id === newDeptLead);
            setDepartmentLeads([...departmentLeads, {
                id: Date.now(),
                category: newDeptCategory,
                leadId: newDeptLead,
                leadName: leadInfo?.name || ''
            }]);
            setNewDeptCategory('');
            setNewDeptLead('');
            setShowAddDeptLead(false);
        }
    };

    const removeDepartmentLead = (id) => {
        setDepartmentLeads(departmentLeads.filter(d => d.id !== id));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl" style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
                {/* Fixed Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl" style={{ flexShrink: 0 }}>
                    <h2 className="text-lg font-bold">Create New Event</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-4 space-y-4" style={{ overflowY: 'auto', flex: 1 }}>
                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Event Name *</label>
                        <input
                            type="text"
                            placeholder="e.g., Sharma-Patel Wedding"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    {/* ... Add other fields as per original App.jsx content ... */}
                    {/* I will include the rest of the form fields to ensure completeness */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name *</label>
                        <input
                            type="text"
                            placeholder="e.g., Sharma Family"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type *</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="">Select event type...</option>
                            <option>Wedding</option>
                            <option>Corporate Event</option>
                            <option>Birthday Party</option>
                            <option>Conference</option>
                            <option>Product Launch</option>
                            <option>Festival</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Approval Settings */}
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <CheckSquare size={16} className="text-indigo-600" />
                            Approval Settings
                        </h3>

                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-start gap-3 mb-3">
                                <input
                                    type="checkbox"
                                    id="autoEscalate"
                                    checked={enableAutoEscalation}
                                    onChange={(e) => setEnableAutoEscalation(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 text-indigo-600 rounded"
                                />
                                <div className="flex-1">
                                    <label htmlFor="autoEscalate" className="text-sm font-semibold text-gray-900 cursor-pointer">
                                        Auto-escalate high-budget tasks to Owner
                                    </label>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        Tasks exceeding the threshold will require your approval
                                    </p>
                                </div>
                            </div>

                            {enableAutoEscalation && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Budget Threshold for Owner Approval
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                                        <input
                                            type="number"
                                            value={budgetThreshold}
                                            onChange={(e) => setBudgetThreshold(e.target.value)}
                                            placeholder="500000"
                                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lead Assignment */}
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Users size={16} className="text-indigo-600" />
                            Assign Event Leads
                        </h3>

                        {/* Primary Lead */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Primary Lead (Overall Responsibility) *
                            </label>
                            <select
                                value={primaryLead}
                                onChange={(e) => setPrimaryLead(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Select primary lead...</option>
                                {availableLeads.map(lead => (
                                    <option key={lead.id} value={lead.id}>
                                        {lead.name} - {lead.skills[0]}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Can see and approve all tasks in this event
                            </p>
                        </div>

                        {/* Department Leads */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Department Leads (Optional)
                                </label>
                                <button
                                    onClick={() => setShowAddDeptLead(!showAddDeptLead)}
                                    className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1"
                                >
                                    <Plus size={16} />
                                    Add Department Lead
                                </button>
                            </div>

                            {/* Add Department Lead Form */}
                            {showAddDeptLead && (
                                <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
                                        <select
                                            value={newDeptCategory}
                                            onChange={(e) => setNewDeptCategory(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">Select department...</option>
                                            {departmentCategories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Lead</label>
                                        <select
                                            value={newDeptLead}
                                            onChange={(e) => setNewDeptLead(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">Select lead...</option>
                                            {availableLeads.filter(l => l.id !== primaryLead).map(lead => (
                                                <option key={lead.id} value={lead.id}>
                                                    {lead.name} - {lead.skills[0]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={addDepartmentLead}
                                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
                                        >
                                            Add
                                        </button>
                                        <button
                                            onClick={() => setShowAddDeptLead(false)}
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Display Added Department Leads */}
                            {departmentLeads.length > 0 ? (
                                <div className="space-y-2">
                                    {departmentLeads.map(dept => (
                                        <div key={dept.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <div className="flex-1">
                                                <div className="font-semibold text-sm text-indigo-900">{dept.category}</div>
                                                <div className="text-xs text-indigo-700">{dept.leadName}</div>
                                            </div>
                                            <button
                                                onClick={() => removeDepartmentLead(dept.id)}
                                                className="text-red-600 hover:text-red-700 p-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 italic">
                                    No department leads assigned. Primary lead will handle all approvals.
                                </p>
                            )}
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
                        Create Event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewEventModal;
