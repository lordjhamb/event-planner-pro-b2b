import React, { useMemo } from 'react';
import { TrendingUp, Calendar, CheckSquare, Users, AlertCircle, Plus, DollarSign, Activity } from 'lucide-react';
import SupabaseConnectionTest from '../components/debug/SupabaseConnectionTest';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import KpiCard from '../components/dashboard/KpiCard';
import EventCard from '../components/events/EventCard';

const Dashboard = ({ onSelectEvent, onSelectTask, onNewEvent, onNewTask, onNewWorker, onNavigate }) => {
    const { currentUser, permissions } = useAuth();
    const { events, tasks, workers } = useData();

    // Dashboard KPIs Calculation & Config
    const kpis = useMemo(() => {
        const activeEventsCount = events.filter(e => e.status === 'Active').length;

        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];

        const overdueCount = tasks.filter(t => t.dueDate < today && t.status !== 'Approved').length;

        const upcomingCount = tasks.filter(t =>
            t.dueDate >= today &&
            t.dueDate <= nextWeekStr &&
            t.status !== 'Approved'
        ).length;

        const pendingApprovalCount = tasks.filter(t => t.status === 'Submitted').length;
        // Mock 'issues' check: assuming tasks might have an 'hasIssue' flag or we count 'Blocked' status.
        // For now, let's assume 'issues' means 'Blocked' or 'Submitted' (waiting on lead).
        // User request: "approval has been requested or an issue has been raised"
        // So: status === 'Submitted' OR status === 'Blocked' (if Blocked exists) OR hasIssue === true.
        // I will add a check for 'Blocked' status if it exists in the data model, otherwise just Submitted + placeholder for issues.
        const openIssuesCount = tasks.filter(t => t.status === 'Submitted' || t.status === 'Blocked' || t.hasIssue).length;

        const isLeadOrOwner = currentUser.role === 'owner' || currentUser.role === 'lead';

        return [
            {
                id: 'active-events',
                label: 'Active Events',
                value: activeEventsCount,
                icon: Calendar,
                colorName: 'purple',
                action: () => onNavigate('events', 'active')
            },
            {
                id: 'overdue-tasks',
                label: 'In Progress',
                value: overdueCount,
                icon: AlertCircle,
                colorName: 'purple',
                action: () => onNavigate('tasks', 'overdue')
            },
            isLeadOrOwner ? {
                id: 'open-issues',
                label: 'Open Issues',
                value: openIssuesCount,
                icon: Activity, // Using Activity icon for issues/action needed
                colorName: 'red', // Red for attention
                action: () => onNavigate('tasks', 'issues')
            } : {
                id: 'worker-overdue',
                label: 'Overdue',
                value: overdueCount,
                icon: AlertCircle,
                colorName: 'red',
                action: () => onNavigate('tasks', 'overdue')
            },
            isLeadOrOwner ? {
                id: 'overdue-tasks-alert',
                label: 'Overdue',
                value: overdueCount,
                icon: AlertCircle,
                colorName: 'red',
                action: () => onNavigate('tasks', 'overdue')
            } : {
                id: 'upcoming-deadlines',
                label: 'Upcoming',
                value: upcomingCount,
                icon: Calendar,
                colorName: 'orange',
                action: () => onNavigate('tasks', 'upcoming')
            }
        ];
    }, [events, tasks, onNavigate]);

    return (
        <div className="flex flex-col gap-8 animate-fade-in relative max-w-full overflow-x-hidden">
            {/* Background Blob/Blend */}
            <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-transparent -z-10 pointer-events-none" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-gray-900">
                        Hello, {currentUser.name.split(' ')[0]} 👋
                    </h2>
                    <p className="text-gray-500 mt-1">Here's what's happening today</p>
                </div>

                {/* Desktop Quick Actions */}
                <div className="hidden lg:flex gap-4">
                    {permissions.canCreateEvent && (
                        <button
                            onClick={onNewEvent}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary-600/30 transition-all flex items-center gap-2"
                        >
                            <Plus size={20} /> New Event
                        </button>
                    )}
                    {(currentUser.role === 'owner' || currentUser.role === 'lead') && (
                        <button
                            onClick={() => onNavigate('calendar')}
                            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2"
                        >
                            <Calendar size={20} /> Calendar
                        </button>
                    )}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {kpis.map(kpi => (
                    <KpiCard key={kpi.id} kpi={kpi} onClick={kpi.action} />
                ))}
            </div>

            {/* Mobile Quick Actions Box */}
            <div className="lg:hidden bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    {permissions.canCreateEvent && (
                        <button onClick={onNewEvent} className="bg-primary-50 hover:bg-primary-100 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group">
                            <div className="bg-primary-600 text-white p-2.5 rounded-full group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <span className="text-sm font-semibold text-primary-900">New Event</span>
                        </button>
                    )}
                    <button onClick={() => onNavigate('calendar')} className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group">
                        <div className="bg-white border border-gray-200 text-gray-700 p-2.5 rounded-full group-hover:scale-110 transition-transform">
                            <Calendar size={24} />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">Calendar</span>
                    </button>
                </div>
            </div>

            {/* Active Events List */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-2">
                        Active Events
                    </h3>
                    <button
                        onClick={() => onNavigate('events', 'active')}
                        className="text-primary-600 font-medium text-sm hover:text-primary-700 hover:underline mt-1"
                    >
                        View All
                    </button>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
                    {events.filter(e => e.status === 'Active').map(event => (
                        <div key={event.id} className="min-w-[300px] md:min-w-[350px] snap-center">
                            <EventCard event={event} onClick={() => onSelectEvent(event)} />
                        </div>
                    ))}

                    {events.filter(e => e.status === 'Active').length === 0 && (
                        <div className="w-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No active events currently.</p>
                            <button onClick={onNewEvent} className="text-primary-600 font-medium mt-2">Create one?</button>
                        </div>
                    )}
                </div>
            </div>

            {/* All Tasks Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-2">
                        All Tasks
                    </h3>
                    <button
                        onClick={() => onNavigate('tasks', 'all')}
                        className="text-primary-600 font-medium text-sm hover:text-primary-700 hover:underline mt-1"
                    >
                        See all
                    </button>
                </div>

                <div className="space-y-3">
                    {[...tasks].sort((a, b) => b.id - a.id).slice(0, 5).map(task => {
                        const taskEvent = events.find(e => e.id === task.eventId);
                        const assignee = workers.find(w => w.id === task.assignee) || { name: 'Unassigned', avatar: '?' };

                        return (
                            <div
                                key={task.id}
                                onClick={() => onSelectTask(task)}
                                className="bg-white p-4 rounded-2xl border border-gray-100 flex items-start gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className={`mt-1 bg-primary-50 text-primary-600 p-2 rounded-lg group-hover:bg-primary-100 transition-colors`}>
                                    <CheckSquare size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">{task.title}</h4>

                                    <div className="flex items-center gap-2 flex-wrap mt-1.5 text-xs text-gray-500">
                                        {/* Event Name */}
                                        {taskEvent && (
                                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 max-w-[150px] truncate">
                                                <Calendar size={10} />
                                                <span className="truncate">{taskEvent.name}</span>
                                            </span>
                                        )}

                                        {/* Assignee */}
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                            <Users size={10} />
                                            <span>{assignee.name.split(' ')[0]}</span>
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                        <span className={`px-2 py-0.5 rounded-full ${task.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                            task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                'bg-blue-50 text-blue-600 border border-blue-100'
                                            }`}>
                                            {task.priority || 'Normal'}
                                        </span>
                                        <span>•</span>
                                        <span>{task.dueDate || 'No Date'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {tasks.length === 0 && (
                        <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No tasks yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
