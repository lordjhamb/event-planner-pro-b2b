import React, { useState } from 'react';
import { ChevronRight, Calendar, MapPin, Award, FileText, DollarSign, Users, CheckSquare, Plus, AlertCircle, Briefcase, MessageSquare, Send, Trash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import TaskCard from '../tasks/TaskCard';
import ChatInterface from '../chat/ChatInterface';

const EventDetail = ({ event, onBack, onSelectTask, onSelectWorker, onNewTask, onEnterLiveMode, onEditEvent }) => {
    const { permissions, currentUser } = useAuth();
    const { tasks, workers, deleteEvent } = useData();
    const [filterStatus, setFilterStatus] = useState('all');
    const [activeTab, setActiveTab] = useState('info'); // info, budget, tasks, timeline, chat
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

    if (!event) return null;

    const eventTasks = tasks.filter(t => t.eventId === event.id);
    const eventWorkers = workers.filter(w => event.workers.includes(w.id));
    const completedTasksCount = eventTasks.filter(t => t.status === 'Approved').length;
    const totalBudget = event.budget;
    const spentBudget = event.spent;
    const budgetPercentage = (spentBudget / totalBudget) * 100;

    const visibleTasks = filterStatus === 'all'
        ? eventTasks
        : eventTasks.filter(t => t.status === filterStatus);

    // Timeline Data
    const timelineTasks = [...eventTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

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
                                                {workers.find(w => w.id === event.primaryLeadId)?.name.split(' ').map(n => n[0]).join('') || 'PL'}
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
                                                    {dept.leadName.split(' ').map(n => n[0]).join('')}
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
            case 'budget':
                return permissions.canViewBudget ? (
                    <div className="space-y-6 animate-fade-in">
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
                                            <span className="text-3xl font-bold text-gray-900">₹{(spentBudget / 100000).toFixed(2)}L</span>
                                            <span className="text-gray-400 font-medium">/ ₹{(totalBudget / 100000).toFixed(2)}L</span>
                                        </div>
                                    </div>
                                    <span className={`text-lg font-bold ${budgetPercentage > 90 ? 'text-red-600' : 'text-green-600'}`}>
                                        {budgetPercentage.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${budgetPercentage > 90 ? 'bg-red-500' : budgetPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        style={{ width: `${budgetPercentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-sm text-gray-500">
                                    <span>Spent: ₹{spentBudget.toLocaleString()}</span>
                                    <span>Remaining: ₹{(totalBudget - spentBudget).toLocaleString()}</span>
                                </div>
                            </div>
                            {/* Mock Breakdown */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Category Breakdown</h4>
                                {[
                                    { label: 'Venue & Decor', spent: 850000, total: 1200000, color: 'bg-blue-500' },
                                    { label: 'Catering', spent: 620000, total: 1000000, color: 'bg-orange-500' },
                                    { label: 'Entertainment', spent: 300000, total: 500000, color: 'bg-purple-500' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold text-gray-900">{item.label}</span>
                                            <span className="text-sm text-gray-600">₹{(item.spent / 100000).toFixed(1)}L / ₹{(item.total / 100000).toFixed(1)}L</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.spent / item.total) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
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
            default: return null;
        }
    };

    return (
        <div className="space-y-6 pb-20 lg:pb-8 animate-fade-in">
            {/* Header / Back */}
            <div>
                <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-4 transition-colors font-medium">
                    <ChevronRight size={18} className="rotate-180" />
                    <span>Back to Dashboard</span>
                </button>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-heading font-bold text-gray-900">{event.name}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${event.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {event.status}
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

                            {/* Live Mode Entry */}
                            {new Date().toISOString().split('T')[0] === event.dates.split(' ')[0] && (
                                <div className="mt-6 p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-lg border border-slate-700 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                                        <div>
                                            <div className="text-white font-bold text-sm">Event is LIVE Today</div>
                                            <div className="text-slate-400 text-xs">Started at 8:00 AM</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onEnterLiveMode}
                                        className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all transform group-hover:scale-105"
                                    >
                                        ENTER LIVE MODE <ChevronRight size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-end gap-4 min-w-[200px]">
                            <div className="flex gap-2">
                                {currentUser?.role === 'owner' && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                                                deleteEvent(event.id);
                                                onBack();
                                            }
                                        }}
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
                {['info', 'budget', 'tasks', 'timeline', 'chat'].map(tab => (
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
        </div>
    );
};

export default EventDetail;
