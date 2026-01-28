import React, { useState } from 'react';
import { ChevronRight, Calendar, MapPin, Award, FileText, DollarSign, Users, CheckSquare, Plus, AlertCircle, Briefcase, MessageSquare, Send, Trash, Package, Activity, Edit, ChevronDown, Check, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import TaskCard from '../tasks/TaskCard';
import ChatInterface from '../chat/ChatInterface';
import FinanceTransactionModal from '../modals/FinanceTransactionModal';
import QuotePreviewModal from '../modals/QuotePreviewModal';
import SubEventSwitcher from './SubEventSwitcher';
import LiveEventMode from '../live/LiveEventMode';

const EventDetail = ({ event: propEvent, onBack, onSelectTask, onSelectWorker, onNewTask, onEnterLiveMode, onEditEvent, onSwitchEvent }) => {
    const { permissions, currentUser } = useAuth();
    const { tasks, workers, deleteEvent, deleteWedding, finance, addFinanceTransaction, inventory, inventoryRequests, events, weddings, updateTaskStatus } = useData();
    const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEventDeleteConfirm, setShowEventDeleteConfirm] = useState(false);
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [financeModalType, setFinanceModalType] = useState('Expense');
    const [filterStatus, setFilterStatus] = useState('all');
    const [activeTab, setActiveTab] = useState('info'); // info, finance, tasks, timeline, chat
    const [activeChat, setActiveChat] = useState('group'); // 'group' or userId
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, senderId: 'group', text: "Let's coordinate the floral arrangements here.", timestamp: '10:30 AM', isSystem: false },
        { id: 2, senderId: 'sys', text: "Event created by Sharma Family", timestamp: '10:00 AM', isSystem: true }
    ]);

    const handleSendMessage = (text, chatId) => {
        const newMessage = {
            id: Date.now(),
            senderId: 'me',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystem: false
        };

        setMessages([...messages, newMessage]);
    };

    if (!propEvent) return null;

    // Derived State: Always prefer the event from context to get live updates
    const event = events.find(e => e.id === propEvent.id) || propEvent;

    if (isLiveMode) return <LiveEventMode event={event} onClose={() => setIsLiveMode(false)} />;

    const eventTasks = tasks.filter(t => t.eventId === event.id);
    const eventWorkers = workers.filter(w => (event.workers || []).includes(w.id));
    const completedTasksCount = eventTasks.filter(t => t.status === 'Approved').length;
    const totalBudget = event.budget;
    const spentBudget = event.spent;
    const budgetPercentage = (spentBudget / totalBudget) * 100;

    const visibleTasks = filterStatus === 'all'
        ? eventTasks
        : eventTasks.filter(t => t.status === filterStatus);

    // Finance Data
    const eventTransactions = finance ? finance.filter(f => f.eventId === event.id || f.eventId === event.id.toString()) : [];
    const totalExpenses = eventTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    // Use actual expenses if available, else fallback to event.spent
    const displaySpent = totalExpenses > 0 ? totalExpenses : spentBudget;
    const displayBudgetPercentage = (displaySpent / totalBudget) * 100;

    // Timeline Data
    const timelineTasks = [...eventTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const handleContextAwareBack = () => {
        if (event.weddingId) {
            const parentWedding = weddings.find(w => w.id.toString() === event.weddingId.toString());
            if (parentWedding) {
                onSwitchEvent(parentWedding);
                return;
            }
        }
        onBack();
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div className="space-y-6 animate-fade-in">
                        {/* Event Leadership Team */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award size={20} className="text-primary-600" />
                                Event Leadership Team
                            </h3>
                            {/* Primary Lead */}
                            {event.primaryLeadId && (
                                <div className="mb-4">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Primary Lead</div>
                                    <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {(workers.find(w => w.id === event.primaryLeadId)?.name || 'PL').split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-gray-900 text-lg">
                                                    {workers.find(w => w.id === event.primaryLeadId)?.name || 'Primary Lead'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Can approve all tasks • Full event oversight
                                                </div>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-1 text-xs bg-primary-600 text-white px-3 py-1.5 rounded-full font-bold shadow-sm">
                                                <Award size={12} /> Primary
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Department Leads */}
                            {event.departmentLeads && event.departmentLeads.length > 0 && (
                                <div>
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Department Leads</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {event.departmentLeads.map(dept => (
                                            <div key={dept.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                    {(dept.leadName || 'DL').split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm text-gray-900">{dept.leadName}</div>
                                                    <div className="text-xs text-gray-500">{dept.category}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Overview Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-primary-600" />
                                Overview
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div className="flex justify-between py-3 border-b border-gray-50">
                                    <span className="text-gray-500">Event Type</span>
                                    <span className="font-semibold text-gray-900">Wedding</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-50">
                                    <span className="text-gray-500">Expected Guests</span>
                                    <span className="font-semibold text-gray-900">500</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-50">
                                    <span className="text-gray-500">Venue</span>
                                    <span className="font-semibold text-gray-900 text-right max-w-[200px] truncate">{event.location}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-50">
                                    <span className="text-gray-500">Team Size</span>
                                    <span className="font-semibold text-gray-900">{eventWorkers.length} Members</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'finance':
                return permissions.canViewBudget ? (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsQuoteModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
                            >
                                <FileText size={16} className="text-gray-500 group-hover:text-primary-600 transition-colors" />
                                <span>Generate Quote</span>
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <DollarSign size={20} className="text-green-600" />
                                Budget Overview
                            </h3>

                            <div className="mb-8">
                                <div className="flex items-end justify-between mb-2">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Budget Utilization</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-gray-900">₹{(displaySpent / 100000).toFixed(2)}L</span>
                                            <span className="text-gray-400 font-medium">/ ₹{(totalBudget / 100000).toFixed(2)}L</span>
                                        </div>
                                    </div>
                                    <span className={`text-lg font-bold ${displayBudgetPercentage > 90 ? 'text-red-600' : 'text-green-600'}`}>
                                        {displayBudgetPercentage.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${displayBudgetPercentage > 90 ? 'bg-red-500' : displayBudgetPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        style={{ width: `${Math.min(displayBudgetPercentage, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-sm text-gray-500">
                                    <span>Spent: ₹{displaySpent.toLocaleString()}</span>
                                    <span>Remaining: ₹{(totalBudget - displaySpent).toLocaleString()}</span>
                                </div>
                            </div>
                            {/* Mock Breakdown */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide flex justify-between items-center">
                                    <span>Recent Transactions</span>
                                    <button
                                        onClick={() => {
                                            setFinanceModalType('Expense');
                                            setIsFinanceModalOpen(true);
                                        }}
                                        className="text-xs text-primary-600 font-bold hover:underline"
                                    >
                                        + Add Transaction
                                    </button>
                                </h4>
                                {eventTransactions.length > 0 ? (
                                    <div className="space-y-2">
                                        {eventTransactions.map((t, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                        <DollarSign size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-sm">{t.category || 'General'}</div>
                                                        <div className="text-xs text-gray-500">{t.notes || 'No description'}</div>
                                                    </div>
                                                </div>
                                                <div className={`font-bold text-sm ${t.type === 'Income' ? 'text-green-600' : 'text-gray-900'}`}>
                                                    {t.type === 'Income' ? '+' : '-'} ₹{parseFloat(t.amount).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-gray-400 text-sm italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        No transactions recorded yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : <div className="p-8 text-center text-gray-500">You don't have permission to view budget.</div>;
            case 'tasks':
                return (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-in overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                                {['all', 'Open', 'In Progress', 'Submitted', 'Approved'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filterStatus === status
                                            ? 'bg-primary-600 text-white shadow-md'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        {status === 'all' ? 'All' : status}
                                    </button>
                                ))}
                            </div>
                            <button onClick={onNewTask} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-700 shadow-sm whitespace-nowrap">
                                <Plus size={16} /> New Task
                            </button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {visibleTasks.length > 0 ? (
                                visibleTasks.map(task => (
                                    <TaskCard key={task.id} task={task} onClick={() => onSelectTask(task)} inEventContext={true} />
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckSquare size={32} className="text-gray-400" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">No tasks found</h4>
                                    <p className="text-gray-500 text-sm">No tasks match the current filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'chat':
                return (
                    <ChatInterface
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        currentUser="me"
                        users={eventWorkers}
                        activeChatId={activeChat}
                        onChatSelect={setActiveChat}
                    />
                );
            case 'timeline':
                return (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
                        <h3 className="font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Calendar size={20} className="text-primary-600" />
                            Project Timeline
                        </h3>
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {timelineTasks.map((task, index) => (
                                <div key={task.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    {/* Icon */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                                        <Calendar size={16} />
                                    </div>

                                    {/* Content */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="font-bold text-gray-900">{task.title}</div>
                                            <time className="font-heading font-bold text-xs text-primary-600">{task.dueDate}</time>
                                        </div>
                                        <div className="text-slate-500 text-sm line-clamp-2 mb-2">{task.description || 'No description provided.'}</div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'inventory':
                return (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2">
                                <Package size={20} className="text-primary-600" />
                                Event Inventory
                            </h3>
                            <button
                                onClick={() => {
                                    // Could open a modal to request new items directly for the event
                                    // For now, we'll guide them to tasks as that's the established flow
                                    alert("To request inventory, please add it to a specific Task.");
                                }}
                                className="text-sm text-primary-600 font-bold hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                + Request Item via Task
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-100">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3">Item</th>
                                        <th className="px-4 py-3">Quantity</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Task</th>
                                        <th className="px-4 py-3">Requested By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {/* Aggregate requests from context */}
                                    {(() => {
                                        // 1. Get all requests linked to tasks in this event
                                        const eventTaskIds = tasks.filter(t => t.eventId === event.id).map(t => t.id);
                                        const eventRequests = inventoryRequests?.filter(req => eventTaskIds.includes(req.taskId)) || [];

                                        if (eventRequests.length === 0) {
                                            return (
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-400 italic">
                                                        No inventory items requested for this event yet.
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return eventRequests.map(req => {
                                            const item = inventory?.find(i => i.id === req.itemId);
                                            const task = tasks.find(t => t.id === req.taskId);
                                            const requestUser = workers.find(w => w.id === req.requestedBy) || { name: 'Unknown' };

                                            return (
                                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-gray-900">
                                                        {item?.name || 'Unknown Item'}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-gray-600">
                                                        {req.quantity}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold capitalize ${req.status === 'Approved' ? 'bg-green-50 text-green-700' :
                                                            req.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                                                                req.status === 'Used' ? 'bg-purple-50 text-purple-700' :
                                                                    'bg-orange-50 text-orange-700'
                                                            }`}>
                                                            {req.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate" title={task?.title}>
                                                        {task?.title || 'Unknown Task'}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500">
                                                        {requestUser.name}
                                                    </td>
                                                </tr>
                                            );
                                        });
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default: return null;
        }
    };



    // --- WEDDING SUMMARY RENDERER ---
    // If "event" is actually a Wedding object (has weddingType and no weddingId), render the summary view.
    if (event.weddingType && !event.weddingId) {
        // 1. Calculate Aggregates
        // Ensure events is available (added to useData destructuring)
        const weddingEvents = events?.filter(e => e.weddingId && e.weddingId.toString() === event.id.toString()) || [];
        const weddingTasks = tasks?.filter(t => t.weddingId && t.weddingId.toString() === event.id.toString()) || [];

        const totalBudget = parseFloat(event.totalBudget || event.budget) || 0;
        const totalSpent = weddingEvents.reduce((acc, e) => acc + (parseFloat(e.spent) || 0), 0);
        const remaining = totalBudget - totalSpent;
        const percentSpent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

        // Progress based on completed tasks or event progress
        const overallProgress = weddingEvents.length > 0
            ? Math.round(weddingEvents.reduce((acc, e) => acc + (e.progress || 0), 0) / weddingEvents.length)
            : 0;

        const complTasks = weddingTasks.filter(t => t.status === 'Approved' || t.status === 'Completed').length;

        // Days until first event
        const getTime = (dateStr) => {
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? 9999999999999 : d.getTime();
        };
        const sortedEvents = [...weddingEvents].sort((a, b) => getTime(a.dates) - getTime(b.dates));
        const firstEventDate = sortedEvents.length > 0 && !isNaN(new Date(sortedEvents[0].dates))
            ? new Date(sortedEvents[0].dates)
            : (event.startDate ? new Date(event.startDate) : new Date());
        const diffTime = firstEventDate - new Date();
        const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return (
            <div className="space-y-6 pb-20 lg:pb-8 animate-fade-in">
                {/* Header / Back */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors font-medium">
                        <ChevronRight size={18} className="rotate-180" />
                        <span>Back to Dashboard</span>
                    </button>

                    <div className="flex items-center gap-3">
                        {/* Jump to Sub-Event Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium shadow-md hover:bg-zinc-800 transition-colors">
                                <Calendar size={16} />
                                <span>Jump to Sub-Event</span>
                                <ChevronDown size={16} className="text-zinc-500" />
                            </button>
                            <div className="absolute top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-focus-within:block z-50 left-0 md:left-auto md:right-0">
                                <div className="p-2 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">Select Event</div>
                                {weddingEvents.map(evt => (
                                    <button
                                        key={evt.id}
                                        onClick={() => onSwitchEvent(evt)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center justify-between"
                                    >
                                        {evt.name}
                                        <ChevronRight size={14} className="text-gray-300" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Edit Wedding */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onEditEvent(event); }}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors shadow-sm"
                        >
                            <Edit size={16} />
                            <span>Edit Details</span>
                        </button>

                        {/* Delete Wedding Button */}
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
                            title="Delete Wedding"
                        >
                            <Trash size={18} />
                        </button>


                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
                        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-scale-up">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="font-heading font-bold text-xl text-center text-gray-900 mb-2">Delete Wedding?</h3>
                            <p className="text-gray-500 text-center mb-6 text-sm">
                                Are you sure you want to delete <span className="font-bold text-gray-800">{event.name}</span>?
                                This will permanently remove all {weddingEvents.length} events and {weddingTasks.length} tasks.
                                <br /><br />
                                <span className="text-red-600 font-bold uppercase text-xs">This action cannot be undone.</span>
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 text-gray-700 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        deleteWedding(event.id);
                                        onBack();
                                    }}
                                    className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sub-Event Switcher & Tabs */}
                {/* Tabs */}
                <div className="flex justify-end mb-6">

                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 overflow-x-auto w-full md:w-auto">
                        {['Info', 'Finance', 'Tasks', 'Timeline', 'Chat'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.toLowerCase()
                                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'info' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                            {/* Header */}
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center text-3xl">
                                        💒
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-heading font-bold text-gray-900">{event.name}</h1>
                                        <p className="text-gray-500">{event.weddingType} • {weddingEvents.length} Events Plan</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-xl border-2 font-bold uppercase tracking-wider text-sm ${event.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' :
                                    event.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                        event.status === 'Upcoming' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            'bg-indigo-50 text-indigo-600 border-indigo-100' // Active
                                    }`}>
                                    {event.status || 'Active'}
                                </div>
                            </div>

                            {/* ASCII-Style Summary Box (approximated with Tailwind to look like the design) */}
                            <div className="bg-slate-900 text-slate-200 rounded-xl p-6 font-mono text-sm leading-relaxed shadow-lg relative overflow-hidden">
                                {/* Decorative 'window' controls */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                                </div>

                                <div className="flex items-center gap-2 mb-6 text-emerald-400 font-bold border-b border-slate-700 pb-2">
                                    <Activity size={16} /> WEDDING SUMMARY
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                    {/* Col 1 */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-slate-500">Overall Progress:</span>
                                                <span className="font-bold text-white">{overallProgress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-800 rounded-sm h-3 border border-slate-700">
                                                <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full" style={{ width: `${overallProgress}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Total Budget:</span>
                                                <span className="font-bold text-white">₹{(totalBudget).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Amount Spent:</span>
                                                <span className="font-bold text-yellow-400">₹{(totalSpent).toLocaleString()} ({percentSpent}%)</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Remaining:</span>
                                                <span className="font-bold text-emerald-400">₹{(remaining).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Col 2 */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between p-2 bg-slate-800/50 rounded border border-slate-800">
                                            <span className="text-slate-400">Total Events:</span>
                                            <span className="font-bold text-white">{weddingEvents.length}</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-slate-800/50 rounded border border-slate-800">
                                            <span className="text-slate-400">Total Tasks:</span>
                                            <span className="font-bold text-white">{weddingTasks.length} <span className="text-slate-500 font-normal">({complTasks} completed)</span></span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-slate-800/50 rounded border border-slate-800">
                                            <span className="text-slate-400">Team Size:</span>
                                            <span className="font-bold text-white max-w-[150px] truncate text-right">
                                                {Array.from(new Set([...(event.workers || []), ...weddingEvents.flatMap(e => e.workers || [])])).length} members
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-2 mt-2 border-t border-slate-800 text-emerald-400">
                                            <span>Days Until First Event:</span>
                                            <span className="font-bold">{daysUntil > 0 ? daysUntil : 'Started!'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-slate-800 text-left text-[10px] text-slate-600 font-sans uppercase tracking-widest flex justify-between">
                                    <span>System Status: Online</span>
                                    <span>ID: {event.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sub Events List Shortcut */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 text-xl">Event Timeline</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sortedEvents.map((evt, idx) => (
                                    <div key={evt.id} onClick={() => onSwitchEvent(evt)} className="bg-white p-5 rounded-xl border border-gray-100 hover:border-primary-500 hover:shadow-md cursor-pointer transition-all flex flex-col gap-3 group">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Event {idx + 1}</span>
                                            <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-600 transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg group-hover:text-primary-700 transition-colors">{evt.name}</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <Calendar size={14} />
                                                {evt.dates}
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                                            <span className={`px-2 py-1 rounded-full font-bold ${evt.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                                {evt.status}
                                            </span>
                                            <span className="text-gray-400">{evt.progress}% Done</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}


                {activeTab === 'finance' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Financial Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Total Budget</p>
                                    <h3 className="text-2xl font-bold text-gray-900">₹{(totalBudget).toLocaleString()}</h3>
                                </div>
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <DollarSign size={24} />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Total Spent</p>
                                    <h3 className="text-2xl font-bold text-gray-900">₹{(totalSpent).toLocaleString()}</h3>
                                </div>
                                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                                    <CheckSquare size={24} />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Remaining</p>
                                    <h3 className={`text-2xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>₹{(remaining).toLocaleString()}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${remaining < 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    <Activity size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Breakdown by Event */}
                        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold text-lg text-gray-900">Budget Breakdown by Event</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Event</th>
                                            <th className="px-6 py-4">Allocated Budget</th>
                                            <th className="px-6 py-4">Spent</th>
                                            <th className="px-6 py-4">Remaining</th>
                                            <th className="px-6 py-4">Usage</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {sortedEvents.map(evt => {
                                            const evtBudget = parseFloat(evt.budget || 0);
                                            const evtSpent = parseFloat(evt.spent || 0);
                                            const evtRemaining = evtBudget - evtSpent;
                                            const usage = evtBudget > 0 ? (evtSpent / evtBudget) * 100 : 0;

                                            // Get recent transaction count
                                            const subEventTransactions = finance.filter(f => f.eventId === evt.id.toString());

                                            return (
                                                <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{evt.name}</div>
                                                        <div className="text-xs text-gray-500">{subEventTransactions.length} transactions</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-gray-600">₹{evtBudget.toLocaleString()}</td>
                                                    <td className="px-6 py-4 font-mono text-gray-900 font-bold">₹{evtSpent.toLocaleString()}</td>
                                                    <td className={`px-6 py-4 font-mono font-bold ${evtRemaining < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                        ₹{evtRemaining.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 w-32">
                                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${usage > 100 ? 'bg-red-500' : usage > 80 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                                                style={{ width: `${Math.min(usage, 100)}%` }}
                                                            />
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1 text-right">{usage.toFixed(1)}%</div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {sortedEvents.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">No sub-events found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Summary Counters */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm min-w-[150px]">
                                <span className="text-sm text-gray-500 block">Total Tasks</span>
                                <span className="text-xl font-bold text-gray-900">{weddingTasks.length}</span>
                            </div>
                            <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm min-w-[150px]">
                                <span className="text-sm text-gray-500 block">Completed</span>
                                <span className="text-xl font-bold text-green-600">{complTasks}</span>
                            </div>
                            <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm min-w-[150px]">
                                <span className="text-sm text-gray-500 block">Pending</span>
                                <span className="text-xl font-bold text-orange-500">{weddingTasks.length - complTasks}</span>
                            </div>
                        </div>

                        {/* Task List Grouped by Event */}
                        <div className="space-y-4">
                            {sortedEvents.map(evt => {
                                const evtTasks = weddingTasks.filter(t => t.eventId === evt.id.toString());
                                if (evtTasks.length === 0) return null;

                                return (
                                    <div key={evt.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                        <div
                                            className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => onSwitchEvent(evt)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-gray-900">{evt.name}</h3>
                                                <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-500">{evtTasks.length} tasks</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-primary-600 text-sm font-medium">
                                                View Event <ChevronRight size={16} />
                                            </div>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {evtTasks.map(task => (
                                                <div
                                                    key={task.id}
                                                    className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer"
                                                    onClick={() => onSelectTask(task)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {/* Action Button (Replacing Checkbox) */}
                                                        <div className="mr-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                            {task.status === 'Open' ? (
                                                                <button
                                                                    onClick={() => updateTaskStatus(task.id, 'In Progress')}
                                                                    className="w-8 h-8 rounded-full bg-white border-2 border-blue-200 text-blue-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all shadow-sm flex items-center justify-center p-0"
                                                                    title="Start Task"
                                                                >
                                                                    <Play size={14} className="ml-0.5" />
                                                                </button>
                                                            ) : task.status === 'In Progress' ? (
                                                                <button
                                                                    onClick={() => updateTaskStatus(task.id, 'Submitted')}
                                                                    className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-gray-300 hover:border-green-500 hover:text-green-500 hover:bg-green-50 transition-all shadow-sm flex items-center justify-center p-0"
                                                                    title="Mark as Done"
                                                                >
                                                                    <CheckSquare size={16} />
                                                                </button>
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center border border-gray-200">
                                                                    {(task.status === 'Completed' || task.status === 'Approved') ? <CheckSquare size={16} className="text-green-500" /> : <CheckSquare size={16} />}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{task.title}</div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                                                                {task.priority} Priority • {task.category}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {/* Assigned To Name */}
                                                        <div className="text-xs font-medium text-gray-500 max-w-[80px] truncate text-right">
                                                            {(() => {
                                                                const assignedWorker = workers.find(w => w.id?.toString() === task.assignee?.toString());
                                                                return assignedWorker ? assignedWorker.name.split(' ')[0] : <span className="text-gray-300 italic">Unassigned</span>;
                                                            })()}
                                                        </div>

                                                        {/* Status Badge */}
                                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${task.status === 'Completed' || task.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                            task.status === 'Submitted' ? 'bg-orange-100 text-orange-700' :
                                                                task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {task.status}
                                                        </div>
                                                    </div>
                                                </div>

                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            {weddingTasks.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                    <CheckSquare size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">No tasks created for this wedding yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
                }

                {
                    activeTab === 'timeline' && (
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm min-h-[400px] flex items-center justify-center animate-fade-in">
                            <div className="text-center">
                                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900">Gantt Timeline</h3>
                                <p className="text-gray-500">Visual timeline of all sub-events and milestones.</p>
                                <span className="inline-block mt-4 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">Coming Soon</span>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'chat' && (
                        <div className="bg-white md:rounded-3xl overflow-hidden border-y md:border border-gray-200 shadow-sm h-[calc(100vh-180px)] md:h-[calc(100vh-280px)] animate-fade-in p-0 -mx-4 md:mx-0 mb-20 md:mb-0">
                            <ChatInterface
                                currentUserId={currentUser?.id}
                                eventId={event.id}
                                eventName={event.name}
                                height="h-full"
                            />
                        </div>
                    )
                }

            </div >
        );
    }

    return (
        <div className="space-y-6 pb-20 lg:pb-8 animate-fade-in">
            {/* Header / Back */}
            <div>
                {event.weddingId && (
                    <SubEventSwitcher
                        weddingId={event.weddingId}
                        currentEventId={event.id}
                        onEventChange={onSwitchEvent}
                        onBackToWedding={handleContextAwareBack}
                    />
                )}
                <button onClick={handleContextAwareBack} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-4 transition-colors font-medium">
                    <ChevronRight size={18} className="rotate-180" />
                    <span>{event.weddingId ? 'Back to Wedding Overview' : 'Back to Events'}</span>
                </button>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-heading font-bold text-gray-900">{event.name}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${event.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                    event.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                        event.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700' // Active
                                    }`}>
                                    {event.status || 'Active'}
                                </span>
                            </div>
                            <p className="text-lg text-gray-600 mb-4">{event.client}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-primary-500" />
                                    <span className="font-medium text-gray-900">{event.dates}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-primary-500" />
                                    <span className="font-medium text-gray-900">{event.location}</span>
                                </div>
                            </div>

                            {/* Live Mode Entry - Show if Today or Tomorrow */}
                            {/* Live Mode Entry - Show if Today or Tomorrow */}
                            {(() => {
                                const eventDateStr = event.startDate || event.dates;

                                // Debug/Fallback: If no date, maybe don't show, or show if status is Active? 
                                // For now, require date.
                                if (!eventDateStr) return null;

                                let eventDate = new Date(eventDateStr.split(' - ')[0]); // Handle "Start - End" ranges

                                // Handle cases like "Dec 14" where year might default to 2001
                                if (eventDate.getFullYear() < 2020) {
                                    eventDate.setFullYear(new Date().getFullYear());
                                }

                                if (isNaN(eventDate.getTime())) return null;

                                const today = new Date();
                                eventDate.setHours(0, 0, 0, 0);
                                today.setHours(0, 0, 0, 0);

                                const diffTime = eventDate - today;
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                // Show if today (0) or tomorrow (1) or yesterday (-1)
                                if (Math.abs(diffDays) <= 1) {
                                    return (
                                        <div className="mt-6 p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-lg border border-slate-700 flex items-center justify-between group animate-fade-in">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                                                <div>
                                                    <div className="text-white font-bold text-sm">Event is LIVE {diffDays === 0 ? 'Today' : (diffDays === 1 ? 'Tomorrow' : 'Yesterday')}</div>
                                                    <div className="text-slate-400 text-xs">Access real-time dashboard</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsLiveMode(true)}
                                                className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all transform group-hover:scale-105"
                                            >
                                                ENTER LIVE MODE <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>

                        <div className="flex flex-col items-end gap-4 min-w-[200px]">
                            <div className="flex gap-2">
                                {currentUser?.role === 'owner' && (
                                    <button
                                        onClick={() => setShowEventDeleteConfirm(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm group"
                                    >
                                        <Trash size={16} className="text-red-500 group-hover:text-red-600 transition-colors" />
                                        <span>Delete</span>
                                    </button>
                                )}
                                {permissions.canCreateEvent && (
                                    <button
                                        onClick={() => onEditEvent(event)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
                                    >
                                        <FileText size={16} className="text-gray-500 group-hover:text-primary-600 transition-colors" />
                                        <span>Edit Details</span>
                                    </button>
                                )}
                            </div>
                            <div className="w-full">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="font-bold text-gray-700">Progress</span>
                                    <span className="font-bold text-primary-600">{event.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-primary-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${event.progress}%` }} />
                                </div>
                            </div>
                            <div className="flex gap-4 text-xs font-medium text-gray-500 mt-1">
                                <span>{completedTasksCount} Completed</span>
                                <span className="text-red-500">{event.overdueTasks} Overdue</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex p-1 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/60 overflow-x-auto">
                {['info', 'finance', 'tasks', 'timeline', 'chat', 'inventory'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 min-w-[100px] py-2.5 rounded-lg text-sm font-bold capitalize transition-all duration-200 ${activeTab === tab
                            ? 'bg-white text-primary-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {renderTabContent()}

            <FinanceTransactionModal
                isOpen={isFinanceModalOpen}
                onClose={() => setIsFinanceModalOpen(false)}
                defaultType={financeModalType}
                onConfirm={(data) => {
                    addFinanceTransaction({ ...data, eventId: event.id });
                }}
            />

            <QuotePreviewModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                event={event}
            />

            {/* Sub-Event Delete Confirmation Modal */}
            {showEventDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-scale-up">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="font-heading font-bold text-xl text-center text-gray-900 mb-2">Delete Event?</h3>
                        <p className="text-gray-500 text-center mb-6 text-sm">
                            Are you sure you want to delete <span className="font-bold text-gray-800">{event.name}</span>?
                            <br />
                            This will permanently remove this event and its tasks.
                            <br /><br />
                            <span className="text-red-600 font-bold uppercase text-xs">This action cannot be undone.</span>
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEventDeleteConfirm(false)}
                                className="flex-1 py-3 text-gray-700 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteEvent(event.id);
                                    onBack();
                                }}
                                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetail;
