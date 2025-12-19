import React, { useState } from 'react';
import { X, CheckSquare, Users, Plus, Award, Briefcase, Calendar, Info, DollarSign } from 'lucide-react';
import { useData } from '../../context/DataContext';

const NewEventModal = ({ isOpen, onClose, eventToEdit }) => {
    const { workers, addEvent, updateEvent } = useData();
    const [budgetThreshold, setBudgetThreshold] = useState('500000');
    const [enableAutoEscalation, setEnableAutoEscalation] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    const [eventType, setEventType] = useState('');
    const [status, setStatus] = useState('Active');
    const [dates, setDates] = useState(''); // Assuming single date string or range for simplicity now
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budget, setBudget] = useState('');
    const [description, setDescription] = useState('');

    const [primaryLead, setPrimaryLead] = useState('');
    const [departmentLeads, setDepartmentLeads] = useState([]);
    const [showAddDeptLead, setShowAddDeptLead] = useState(false);
    const [newDeptCategory, setNewDeptCategory] = useState('');
    const [newDeptLead, setNewDeptLead] = useState('');

    // Load data when eventToEdit changes
    React.useEffect(() => {
        if (eventToEdit) {
            setName(eventToEdit.name || '');
            setClient(eventToEdit.client || '');
            setStatus(eventToEdit.status || 'Active');
            // Simple type inference or default
            setEventType('Wedding');

            // Handle Dates
            if (eventToEdit.dates) {
                // If dates is a range string "2024-01-01 - 2024-01-03"
                const parts = eventToEdit.dates.split(' - ');
                if (parts.length === 2) {
                    setStartDate(parts[0]);
                    setEndDate(parts[1]);
                } else {
                    setStartDate(eventToEdit.dates);
                }
            }

            setBudget(eventToEdit.budget?.toString() || '');
            setDescription(eventToEdit.description || '');
            setPrimaryLead(eventToEdit.primaryLeadId || '');
            setDepartmentLeads(eventToEdit.departmentLeads || []);
        } else {
            // Reset form
            setName('');
            setClient('');
            setEventType('');
            setStartDate('');
            setEndDate('');
            setBudget('');
            setDescription('');
            setPrimaryLead('');
            setDepartmentLeads([]);
        }
    }, [eventToEdit, isOpen]);

    const handleSubmit = async () => {
        const eventData = {
            name,
            client,
            status,
            dates: endDate ? `${startDate} - ${endDate}` : startDate,
            location: 'TBD', // Add field if needed
            budget: budget,
            description,
            primaryLeadId: primaryLead,
            departmentLeads,
            workers: eventToEdit?.workers || [] // Preserve existing workers
        };

        if (eventToEdit) {
            await updateEvent({ ...eventData, id: eventToEdit.id });
        } else {
            await addEvent(eventData);
        }
        onClose();
    };

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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900">{eventToEdit ? 'Edit Event' : 'Create New Event'}</h2>
                        <p className="text-sm text-gray-500">{eventToEdit ? 'Update event details and assignments' : 'Set up event details and assign leadership'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
                            <Info size={16} className="text-primary-600" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Event Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Sharma-Patel Wedding"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Client Name *</label>
                                <input
                                    type="text"
                                    value={client}
                                    onChange={(e) => setClient(e.target.value)}
                                    placeholder="e.g., Sharma Family"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Event Type *</label>
                                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all">
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
                            {eventToEdit && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Active">Active</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Start Date *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">End Date *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Approval Settings */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
                            <Award size={16} className="text-primary-600" />
                            Approval Settings
                        </h3>
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-900 block mb-1">
                                        Auto-escalate to Owner when:
                                    </label>
                                    <p className="text-xs text-gray-500">
                                        Any task budget exceeding this limit will require owner approval.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-600">Enabled</span>
                                    <div
                                        onClick={() => setEnableAutoEscalation(!enableAutoEscalation)}
                                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${enableAutoEscalation ? 'bg-primary-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${enableAutoEscalation ? 'left-6' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            </div>

                            {enableAutoEscalation && (
                                <div className="animate-slide-down">
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5">Task Budget Threshold (₹)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                        <input
                                            type="number"
                                            value={budgetThreshold}
                                            onChange={(e) => setBudgetThreshold(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
                            <Users size={16} className="text-primary-600" />
                            Assign Event Leads
                        </h3>

                        <div className="p-5 bg-gradient-to-br from-primary-50 to-indigo-50 rounded-2xl border border-primary-100">
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Primary Lead (Overall Responsibility) *
                            </label>
                            <select
                                value={primaryLead}
                                onChange={(e) => setPrimaryLead(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
                            >
                                <option value="">Select primary lead...</option>
                                {availableLeads.map(lead => (
                                    <option key={lead.id} value={lead.id}>
                                        {lead.name} - {lead.skills[0]}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs font-medium text-primary-600 mt-2 flex items-center gap-1">
                                <CheckSquare size={12} /> Can see and approve all tasks in this event
                            </p>
                        </div>

                        {/* Department Leads */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-bold text-gray-700">
                                    Department Leads (Optional)
                                </label>
                                <button
                                    onClick={() => setShowAddDeptLead(!showAddDeptLead)}
                                    className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-1"
                                >
                                    <Plus size={14} /> Add Lead
                                </button>
                            </div>

                            {/* Add Department Lead Form */}
                            {showAddDeptLead && (
                                <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Department</label>
                                            <select
                                                value={newDeptCategory}
                                                onChange={(e) => setNewDeptCategory(e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="">Select department...</option>
                                                {departmentCategories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Lead</label>
                                            <select
                                                value={newDeptLead}
                                                onChange={(e) => setNewDeptLead(e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="">Select lead...</option>
                                                {availableLeads.filter(l => l.id !== primaryLead).map(lead => (
                                                    <option key={lead.id} value={lead.id}>
                                                        {lead.name} - {lead.skills[0]}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => setShowAddDeptLead(false)}
                                            className="px-4 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={addDepartmentLead}
                                            className="px-4 py-1.5 text-xs font-bold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                        >
                                            Add Lead
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                {departmentLeads.map(dept => (
                                    <div key={dept.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                {dept.leadName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900">{dept.category}</div>
                                                <div className="text-xs font-medium text-gray-500">Lead: {dept.leadName}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeDepartmentLead(dept.id)}
                                            className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
                        onClick={handleSubmit}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
                    >
                        {eventToEdit ? 'Update Event' : 'Create Event'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewEventModal;
