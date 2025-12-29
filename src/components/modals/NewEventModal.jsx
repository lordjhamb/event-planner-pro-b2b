import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Users, Plus, Award, Calendar, DollarSign, ChevronRight, ArrowLeft, Settings } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { WEDDING_TEMPLATES } from '../../data/weddingTemplates';

const NewEventModal = ({ isOpen, onClose, eventToEdit }) => {
    const { workers, addEvent, updateEvent, updateWedding, createWedding, templates, weddings, events, tasks } = useData();

    // Mode State: 'selection', 'wedding-wizard', 'single-event'
    const [mode, setMode] = useState('selection');
    const [step, setStep] = useState(1); // For Wizard

    // --- Wedding Wizard State ---
    const [weddingData, setWeddingData] = useState({
        name: '',
        clientName: '',
        brideName: '',
        groomName: '',
        startDate: '',
        endDate: '',
        budget: '',
        type: '', // Template Name
        primaryLeadId: ''
    });
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [weddingEvents, setWeddingEvents] = useState([]); // [{name, type, budget, date, ...}]
    const [creationMethod, setCreationMethod] = useState('ai'); // 'ai', 'copy', 'manual'
    const [sourceWeddingId, setSourceWeddingId] = useState('');


    // --- Single Event Form State (Legacy) ---
    const [singleEventData, setSingleEventData] = useState({
        name: '', client: '', type: '', status: 'Active',
        startDate: '', endDate: '', budget: '', description: '',
        primaryLeadId: '', departmentLeads: []
    });
    const [showAddDeptLead, setShowAddDeptLead] = useState(false);
    const [newDeptCategory, setNewDeptCategory] = useState('');
    const [newDeptLead, setNewDeptLead] = useState('');

    // --- Effects ---
    useEffect(() => {
        if (isOpen) {
            if (eventToEdit) {
                // Editing existing single event
                setMode('single-event');
                setSingleEventData({
                    name: eventToEdit.name || '',
                    client: eventToEdit.client || eventToEdit.clientName || '',
                    status: eventToEdit.status || 'Active',
                    type: eventToEdit.type || eventToEdit.weddingType || 'Wedding',
                    startDate: eventToEdit.startDate ? eventToEdit.startDate.split('T')[0] : (eventToEdit.dates ? eventToEdit.dates.split(' - ')[0] : ''),
                    endDate: eventToEdit.endDate ? eventToEdit.endDate.split('T')[0] : (eventToEdit.dates && eventToEdit.dates.includes(' - ') ? eventToEdit.dates.split(' - ')[1] : ''),
                    budget: (eventToEdit.budget || eventToEdit.totalBudget || '').toString(),
                    description: eventToEdit.description || '',
                    primaryLeadId: eventToEdit.primaryLeadId ? eventToEdit.primaryLeadId.toString() : '',
                    departmentLeads: eventToEdit.departmentLeads || []
                });
            } else {
                // New Creation
                setMode('selection');
                setStep(1);
                resetForms();
            }
        }
    }, [isOpen, eventToEdit]);

    const resetForms = () => {
        setWeddingData({ name: '', clientName: '', brideName: '', groomName: '', startDate: '', endDate: '', budget: '', type: '', primaryLeadId: '' });
        setWeddingEvents([]);
        setSelectedTemplate(null);
        setSingleEventData({ name: '', client: '', type: '', status: 'Active', startDate: '', endDate: '', budget: '', description: '', primaryLeadId: '', departmentLeads: [] });
    };

    // --- Handlers ---

    // 1. Template Selection Handler (Smart Budget Allocation)
    const handleTemplateSelect = (tmpl) => {
        setSelectedTemplate(tmpl);
        setWeddingData(prev => ({ ...prev, type: tmpl.name }));

        // Auto-populate events from template
        if (tmpl.default_events) {
            const totalBudget = parseFloat(weddingData.budget) || 0;

            const mappedEvents = tmpl.default_events.map((evt, idx) => {
                // Calculate budget based on share, or fallback to suggested if total is 0
                let allocatedBudget = 0;
                if (totalBudget > 0 && evt.budget_share) {
                    allocatedBudget = Math.round(totalBudget * evt.budget_share);
                } else {
                    // If no total budget set, or no share defined, use the suggested absolute value from template
                    allocatedBudget = evt.suggested_budget || 0;
                }

                return {
                    id: idx, // temp id
                    name: evt.name,
                    type: evt.type,
                    budget: allocatedBudget,
                    departmentLeads: [],
                    date: '',
                    day_offset: evt.day_offset,
                    description: evt.description || '',
                    suggested_guests: evt.suggested_guests,
                    suggested_budget: evt.suggested_budget, // Keep reference for UI
                    defaultTasks: evt.defaultTasks || []
                };
            });
            setWeddingEvents(mappedEvents);
        }
    };

    // 1b. Copy Wedding Handler
    const handleCopyWedding = (wId) => {
        setSourceWeddingId(wId);
        // Loose equality or toString to handle Number vs String mismatch
        const sourceWedding = weddings.find(w => w.id.toString() === wId.toString());
        if (!sourceWedding) return;

        // Copy the wedding type so the dashboard renders correctly
        setWeddingData(prev => ({
            ...prev,
            type: sourceWedding.weddingType || 'Custom Wedding'
        }));

        // Fetch source events (ensure ID match)
        const sourceEvts = events.filter(e => e.weddingId && e.weddingId.toString() === wId.toString());

        // Calculate Wedding Date Diff (New Start - Old Start)
        // If new start date is not set, we can't calculate relative dates accurately, so we might skip date setting.
        // Or we assume the offsets relative to start date.

        const parseDate = (dStr) => {
            if (!dStr) return null;
            const d = new Date(dStr);
            return isNaN(d.getTime()) ? null : d;
        };

        const sourceStart = parseDate(sourceWedding.startDate);
        const newStart = parseDate(weddingData.startDate) || new Date();

        let dateDiffTime = 0;
        if (sourceStart && newStart) {
            dateDiffTime = newStart.getTime() - sourceStart.getTime();
        }

        const mappedEvents = sourceEvts.map(evt => {
            // Tasks for this event
            const evtTasks = tasks.filter(t => t.eventId && t.eventId.toString() === evt.id.toString());

            // Calculate Day Offset
            let dayOffset = 0;
            // Try to parse the event date. Handles "YYYY-MM-DD" or "Dec 13" if year is current
            let evtDate = parseDate(evt.dates ? evt.dates.split(' - ')[0] : null);

            // If we have a source wedding start date and this event has a Date, calculate offset
            if (sourceStart && evtDate) {
                dayOffset = Math.round((evtDate.getTime() - sourceStart.getTime()) / (1000 * 60 * 60 * 24));
            } else if (evt.day_offset !== undefined) {
                // Fallback to existing day_offset if available
                dayOffset = evt.day_offset;
            }

            if (isNaN(dayOffset)) dayOffset = 0;

            // Calculate New Date
            let newDate = '';
            if (weddingData.startDate) {
                const baseStart = new Date(weddingData.startDate);
                if (!isNaN(baseStart.getTime())) {
                    const nd = new Date(baseStart);
                    nd.setDate(nd.getDate() + dayOffset);
                    newDate = nd.toISOString().split('T')[0];
                }
            }

            // Transform Tasks
            const transformedTasks = evtTasks.map(t => {
                // Calculate task due date offset relative to EVENT date
                let dueOffset = 0;
                const tDate = parseDate(t.dueDate);

                if (tDate && evtDate) {
                    dueOffset = Math.round((tDate.getTime() - evtDate.getTime()) / (1000 * 60 * 60 * 24));
                } else if (t.due_date_offset !== undefined) {
                    dueOffset = t.due_date_offset;
                }

                if (isNaN(dueOffset)) dueOffset = 0;

                return {
                    title: t.title,
                    subtasks: t.checklist ? t.checklist.map(i => i.text) : [],
                    due_date_offset: dueOffset
                };
            });

            return {
                id: evt.id, // reference old id if needed, or use random
                name: evt.name,
                type: evt.type || 'Other',
                budget: evt.budget || 0, // Suggest old budget
                departmentLeads: [],
                date: newDate,
                day_offset: dayOffset,
                description: evt.description || '',
                suggested_budget: evt.budget,
                defaultTasks: transformedTasks
            };
        });

        setWeddingEvents(mappedEvents);
    };

    // 1c. Manual Creation Handler
    const handleManualSetup = () => {
        setWeddingEvents([]);
        // Maybe add one default "Wedding Day" event?
        setWeddingEvents([{
            name: 'Wedding Ceremony',
            type: 'Wedding',
            budget: 0,
            date: weddingData.startDate || '',
            day_offset: 0,
            description: 'Main ceremony',
            defaultTasks: []
        }]);
    };

    // 2. Submit Wedding
    const handleCreateWedding = async () => {
        try {
            await createWedding({
                name: weddingData.name || `${weddingData.brideName} & ${weddingData.groomName}'s Wedding`,
                clientName: weddingData.clientName || `${weddingData.brideName} & ${weddingData.groomName}`,
                brideName: weddingData.brideName,
                groomName: weddingData.groomName,
                weddingType: weddingData.type,
                totalBudget: parseFloat(weddingData.budget) || 0,
                startDate: weddingData.startDate || null,
                endDate: weddingData.startDate || null,
                status: 'Upcoming'
            }, weddingEvents.map(e => ({ ...e, primaryLeadId: weddingData.primaryLeadId })));
            onClose();
        } catch (err) {
            alert("Failed to create wedding: " + err.message);
        }
    };

    // 3. Submit Single Event (Legacy)
    const handleSingleEventSubmit = async () => {
        const eventPayload = {
            name: singleEventData.name,
            client: singleEventData.client,
            status: singleEventData.status,
            dates: singleEventData.startDate,
            location: 'TBD',
            budget: singleEventData.budget,
            description: singleEventData.description,
            primaryLeadId: singleEventData.primaryLeadId,
            departmentLeads: singleEventData.departmentLeads,
            workers: eventToEdit?.workers || [],
            weddingId: eventToEdit?.weddingId // Preserve wedding link
        };

        if (eventToEdit) {
            const isWedding = weddings.some(w => w.id.toString() === eventToEdit.id.toString());
            if (isWedding) {
                await updateWedding({ ...eventPayload, id: eventToEdit.id });
            } else {
                await updateEvent({ ...eventPayload, id: eventToEdit.id });
            }
        } else {
            await addEvent(eventPayload);
        }
        onClose();
    };


    // --- Renders ---

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">

                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        {mode !== 'selection' && !eventToEdit && (
                            <button onClick={() => {
                                if (mode === 'wedding-wizard' && step > 1) setStep(step - 1);
                                else setMode('selection');
                            }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-gray-500" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-2xl font-heading font-bold text-gray-900">
                                {eventToEdit ? 'Edit Event' : mode === 'selection' ? 'Create New' : mode === 'wedding-wizard' ? 'New Wedding Wizard' : 'New Single Event'}
                            </h2>
                            {mode === 'wedding-wizard' && <p className="text-sm text-gray-500">Step {step} of 4</p>}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">

                    {/* MODE: SELECTION */}
                    {mode === 'selection' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full content-center py-8">
                            <button onClick={() => setMode('wedding-wizard')} className="group text-left p-8 rounded-2xl border-2 border-gray-100 hover:border-primary-500 hover:bg-primary-50 transition-all flex flex-col gap-4">
                                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                                    💒
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Multi-Event Wedding</h3>
                                    <p className="text-gray-500 text-sm">Create a full wedding layout with multiple sub-events (Mehndi, Sangeet, etc.) using cultural templates.</p>
                                </div>
                            </button>

                            <button onClick={() => setMode('single-event')} className="group text-left p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col gap-4">
                                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                                    📅
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Single Event</h3>
                                    <p className="text-gray-500 text-sm">Create a standalone corporate event, birthday, or individual party without complex hierarchy.</p>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* MODE: WEDDING WIZARD */}
                    {mode === 'wedding-wizard' && (
                        <div className="space-y-6">
                            {/* Step 1: Basics */}
                            {step === 1 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-gray-900 border-b pb-2">Client Details</h3>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bride's Name</label>
                                                <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-primary-500 focus:ring-0 transition-all"
                                                    value={weddingData.brideName} onChange={e => setWeddingData({ ...weddingData, brideName: e.target.value })} placeholder="Jane" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Groom's Name</label>
                                                <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-primary-500 focus:ring-0 transition-all"
                                                    value={weddingData.groomName} onChange={e => setWeddingData({ ...weddingData, groomName: e.target.value })} placeholder="John" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Budget</label>
                                                <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:border-primary-500 focus:ring-0 transition-all"
                                                    value={weddingData.budget} onChange={e => setWeddingData({ ...weddingData, budget: e.target.value })} placeholder="5000000" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-bold text-gray-900 border-b pb-2">Dates & Lead</h3>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Wedding Date</label>
                                                <input type="date" className="w-full p-3 bg-gray-50 rounded-xl"
                                                    value={weddingData.startDate} onChange={e => setWeddingData({ ...weddingData, startDate: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lead Planner</label>
                                                <select
                                                    value={weddingData.primaryLeadId}
                                                    onChange={(e) => setWeddingData({ ...weddingData, primaryLeadId: e.target.value })}
                                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-primary-500 transition-all"
                                                >
                                                    <option value="">Select Lead Planner...</option>
                                                    {workers.filter(w => w.role === 'Logistics Lead' || w.role === 'Design Lead').map(w => (
                                                        <option key={w.id} value={w.id}>{w.name} ({w.role})</option>
                                                    ))}
                                                    <option disabled>---</option>
                                                    {workers.map(w => (
                                                        <option key={w.id} value={w.id}>{w.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button
                                            disabled={!weddingData.brideName || !weddingData.groomName || !weddingData.startDate}
                                            onClick={() => setStep(2)}
                                            className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            Next: Select Wedding Type <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Creation Method Selection */}
                            {step === 2 && (
                                <div className="space-y-8 animate-slide-up">
                                    <h3 className="font-bold text-gray-900 text-center text-xl">How do you want to create this wedding?</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* AI / Template */}
                                        <button
                                            onClick={() => {
                                                setCreationMethod('ai');
                                                setStep(3);
                                            }}
                                            className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-primary-500 hover:bg-primary-50 transition-all flex flex-col items-center text-center gap-4"
                                        >
                                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">✨</div>
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-900">Use Template</h4>
                                                <p className="text-sm text-gray-500 mt-1">Select from cultural templates (Punjabi, Bengali, etc.) with pre-set events and tasks.</p>
                                            </div>
                                        </button>

                                        {/* Copy Existing */}
                                        <button
                                            onClick={() => {
                                                setCreationMethod('copy');
                                                setStep(3);
                                            }}
                                            className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center text-center gap-4"
                                        >
                                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">📂</div>
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-900">Copy Previous</h4>
                                                <p className="text-sm text-gray-500 mt-1">Duplicate an existing wedding's structure, events, and tasks (excluding people).</p>
                                            </div>
                                        </button>

                                        {/* Manual */}
                                        <button
                                            onClick={() => {
                                                setCreationMethod('manual');
                                                handleManualSetup();
                                                setStep(4);
                                            }}
                                            className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-gray-500 hover:bg-gray-50 transition-all flex flex-col items-center text-center gap-4"
                                        >
                                            <div className="w-16 h-16 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">🛠️</div>
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-900">Manual</h4>
                                                <p className="text-sm text-gray-500 mt-1">Start from scratch with a blank slate. Best for completely custom workflows.</p>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="flex justify-start pt-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="px-6 py-2 text-gray-500 font-bold hover:text-gray-900 flex items-center gap-2"
                                        >
                                            <ArrowLeft size={16} /> Back
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Selection (Template OR Wedding) */}
                            {step === 3 && creationMethod === 'ai' && (
                                <div className="space-y-6 animate-slide-up">
                                    <h3 className="font-bold text-gray-900 text-center text-xl">Select Cultural Template *</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {WEDDING_TEMPLATES.map(tmpl => (
                                            <div
                                                key={tmpl.id}
                                                onClick={() => {
                                                    handleTemplateSelect(tmpl);
                                                    setStep(4);
                                                }}
                                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg ${weddingData.type === tmpl.name ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' : 'border-gray-100 hover:border-primary-200 bg-white'}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-4xl">{tmpl.icon}</span>
                                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{tmpl.events_count}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-gray-900">{tmpl.name}</h4>
                                                    <p className="text-sm text-gray-500 leading-relaxed">{tmpl.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Custom Option */}
                                        <div
                                            onClick={() => {
                                                handleTemplateSelect({ name: 'Custom Wedding', default_events: [] });
                                                setStep(4);
                                            }}
                                            className="p-6 rounded-2xl border-2 border-dashed border-gray-300 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50 text-gray-500"
                                        >
                                            <Settings size={32} />
                                            <h4 className="font-bold text-lg">Custom Wedding</h4>
                                            <p className="text-sm">Build your own flow</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-start pt-4">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="px-6 py-2 text-gray-500 font-bold hover:text-gray-900 flex items-center gap-2"
                                        >
                                            <ArrowLeft size={16} /> Back
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && creationMethod === 'copy' && (
                                <div className="space-y-6 animate-slide-up">
                                    <h3 className="font-bold text-gray-900 text-center text-xl">Select Wedding to Copy</h3>

                                    <div className="max-w-md mx-auto">
                                        <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Existing Wedding</label>
                                        <select
                                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-blue-500 transition-all text-lg"
                                            onChange={(e) => {
                                                const wId = e.target.value;
                                                if (wId) handleCopyWedding(wId);
                                            }}
                                            value={sourceWeddingId}
                                        >
                                            <option value="">Select a wedding...</option>
                                            {weddings.map(w => (
                                                <option key={w.id} value={w.id}>
                                                    {w.name} ({w.startDate})
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-sm text-gray-500 mt-3 text-center">
                                            We will copy all events, tasks, and checklists. Dates will be shifted to match your new start date.
                                        </p>
                                    </div>

                                    <div className="flex justify-between pt-8">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="px-6 py-2 text-gray-500 font-bold hover:text-gray-900 flex items-center gap-2"
                                        >
                                            <ArrowLeft size={16} /> Back
                                        </button>

                                        <button
                                            disabled={!sourceWeddingId}
                                            onClick={() => setStep(4)}
                                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            Next: Review Events <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Customize Events */}
                            {step === 4 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex justify-between items-center">
                                        <span>Based on <strong>{weddingData.type}</strong> tradition. Select events to include:</span>
                                        <div className="text-xs font-bold bg-white px-2 py-1 rounded border border-blue-200">
                                            {weddingEvents.length} Events Selected
                                        </div>
                                    </div>

                                    <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                                        {/* Default / Selected Events */}
                                        {weddingEvents.map((evt, idx) => (
                                            <div key={idx} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 group">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shadow-sm">
                                                            <CheckSquare size={16} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">{evt.name}</h4>
                                                            <p className="text-xs text-gray-500">{evt.description || 'Custom Event'}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setWeddingEvents(weddingEvents.filter((_, i) => i !== idx))}
                                                        className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap gap-4 pl-11">
                                                    <div>
                                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                                                            <Calendar size={14} className="text-gray-400" />
                                                            <input
                                                                type="date"
                                                                className="bg-transparent border-none p-0 text-xs font-bold text-gray-700 w-[110px] focus:ring-0"
                                                                value={evt.date}
                                                                onChange={(e) => {
                                                                    const newEvents = [...weddingEvents];
                                                                    newEvents[idx].date = e.target.value;
                                                                    setWeddingEvents(newEvents);
                                                                }}
                                                            />
                                                        </div>
                                                        {evt.day_offset !== undefined && (
                                                            <p className="text-[10px] text-gray-400 mt-1 pl-1">Suggested: {evt.day_offset === 0 ? 'Wedding Day' : `${Math.abs(evt.day_offset)} days ${evt.day_offset < 0 ? 'before' : 'after'}`}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                                                            <Users size={14} className="text-gray-400" />
                                                            <input
                                                                type="text"
                                                                placeholder="Guests"
                                                                className="bg-transparent border-none p-0 text-xs font-bold text-gray-700 w-[80px] focus:ring-0"
                                                                value={evt.guests || ''}
                                                                onChange={(e) => {
                                                                    const newEvents = [...weddingEvents];
                                                                    newEvents[idx].guests = e.target.value;
                                                                    setWeddingEvents(newEvents);
                                                                }}
                                                            />
                                                        </div>
                                                        {evt.suggested_guests && <p className="text-[10px] text-gray-400 mt-1 pl-1">Est: {evt.suggested_guests}</p>}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                                                            <DollarSign size={14} className="text-gray-400" />
                                                            <input
                                                                type="number"
                                                                placeholder="Budget"
                                                                className="bg-transparent border-none p-0 text-xs font-bold text-gray-700 w-[80px] focus:ring-0"
                                                                value={evt.budget}
                                                                onChange={(e) => {
                                                                    const newEvents = [...weddingEvents];
                                                                    newEvents[idx].budget = e.target.value;
                                                                    setWeddingEvents(newEvents);
                                                                }}
                                                            />
                                                        </div>
                                                        {evt.suggested_budget && <p className="text-[10px] text-gray-400 mt-1 pl-1">Est: ₹{(evt.suggested_budget / 100000).toFixed(1)}L</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Display Optional Events specifically if available in template */}
                                        {selectedTemplate && selectedTemplate.optional_events && selectedTemplate.optional_events.map((optEvt, idx) => {
                                            // Check if already added
                                            const isAdded = weddingEvents.some(e => e.name === optEvt.name);
                                            if (isAdded) return null;

                                            return (
                                                <div key={`opt-${idx}`} className="p-3 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors opacity-70 hover:opacity-100">
                                                    <div>
                                                        <h4 className="font-bold text-gray-600">{optEvt.name} (Optional)</h4>
                                                        <p className="text-xs text-gray-400">{optEvt.description}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setWeddingEvents([...weddingEvents, {
                                                            ...optEvt,
                                                            id: Date.now() + idx,
                                                            budget: optEvt.suggested_budget || 0,
                                                            date: '', // Calculate from Wedding Date if possible? For now empty
                                                            defaultTasks: optEvt.defaultTasks || []
                                                        }])}
                                                        className="text-primary-600 text-sm font-bold hover:underline flex items-center gap-1"
                                                    >
                                                        <Plus size={14} /> Add
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        <button
                                            onClick={() => setWeddingEvents([...weddingEvents, { name: 'New Custom Event', type: 'Other', budget: 0, date: '', description: '', defaultTasks: [] }])}
                                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={18} /> Add Custom Event
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div className="text-sm">
                                            <div className="font-bold text-gray-700">Total Estimated: <span className="text-primary-600">₹{(weddingEvents.reduce((acc, curr) => acc + (parseFloat(curr.budget) || 0), 0) / 100000).toFixed(2)}L</span></div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setStep(creationMethod === 'manual' ? 3 : 3)} // Back to template selection or copy selection
                                                className="px-6 py-2 text-gray-500 font-bold hover:text-gray-900"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleCreateWedding}
                                                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                            >
                                                <Award size={18} /> Create Wedding
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                    }


                    {/* MODE: SINGLE EVENT (Legacy Form Refactored) */}
                    {
                        mode === 'single-event' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Event Name *</label>
                                        <input type="text" value={singleEventData.name} onChange={(e) => setSingleEventData({ ...singleEventData, name: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Client Name *</label>
                                        <input type="text" value={singleEventData.client} onChange={(e) => setSingleEventData({ ...singleEventData, client: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Event Date</label>
                                        <input type="date" value={singleEventData.startDate} onChange={(e) => setSingleEventData({ ...singleEventData, startDate: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Type</label>
                                        <select value={singleEventData.type} onChange={(e) => setSingleEventData({ ...singleEventData, type: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                                            <option value="">Select Type...</option>
                                            <option>Corporate</option>
                                            <option>Birthday</option>
                                            <option>Wedding</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
                                        <select
                                            value={singleEventData.status}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;

                                                // 60% Completion Rule Validation
                                                if (newStatus === 'Completed' && eventToEdit) {
                                                    const isWeddingObj = weddings.some(w => w.id.toString() === eventToEdit.id.toString());

                                                    // Filter tasks based on context (Wedding vs Event)
                                                    const relatedTasks = tasks.filter(t => {
                                                        if (isWeddingObj) {
                                                            return t.weddingId && t.weddingId.toString() === eventToEdit.id.toString();
                                                        } else {
                                                            return t.eventId && t.eventId.toString() === eventToEdit.id.toString();
                                                        }
                                                    });

                                                    const total = relatedTasks.length;
                                                    const completed = relatedTasks.filter(t => t.status === 'Approved' || t.status === 'Completed').length;

                                                    if (total > 0) {
                                                        const percentage = (completed / total) * 100;
                                                        if (percentage < 60) {
                                                            alert(`Cannot mark as Completed.\n\nOnly ${Math.round(percentage)}% of tasks are finished.\nYou need at least 60% completion.`);
                                                            return;
                                                        }
                                                    }
                                                }

                                                setSingleEventData({ ...singleEventData, status: newStatus });
                                            }}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                                        >
                                            <option value="Active">Active (In Progress)</option>
                                            <option value="Upcoming">Upcoming</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Total Budget</label>
                                        <input type="number" value={singleEventData.budget} onChange={(e) => setSingleEventData({ ...singleEventData, budget: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Primary Lead</label>
                                        <select value={singleEventData.primaryLeadId} onChange={(e) => setSingleEventData({ ...singleEventData, primaryLeadId: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                                            <option value="">Select Lead...</option>
                                            {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-100 flex justify-end">
                                    <button onClick={handleSingleEventSubmit} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700">
                                        {eventToEdit ? 'Update Event' : 'Create Event'}
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div >
            </div >
        </div >
    );
};

export default NewEventModal;
