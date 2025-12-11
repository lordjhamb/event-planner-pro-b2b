import React, { useMemo } from 'react';
import { TrendingUp, Calendar, CheckSquare, Users, AlertCircle, Plus, DollarSign, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import KpiCard from '../components/dashboard/KpiCard';
import EventCard from '../components/events/EventCard';

const Dashboard = ({ onSelectEvent, onNewEvent, onNewTask, onNewWorker }) => {
    const { currentUser, permissions } = useAuth();
    const { events, tasks, workers, vendors } = useData();

    // Dashboard KPIs
    const kpis = useMemo(() => {
        const activeEvents = events.filter(e => e.status === 'Active');
        const totalBudget = activeEvents.reduce((acc, curr) => acc + curr.budget, 0);
        const totalSpent = activeEvents.reduce((acc, curr) => acc + curr.spent, 0);
        const pendingTasks = tasks.filter(t => t.status !== 'Approved');
        const overdueTasks = tasks.filter(t => {
            const today = new Date().toISOString().split('T')[0];
            return t.dueDate < today && t.status !== 'Approved';
        });

        const baseKpis = [
            { id: 1, label: 'Active Events', value: activeEvents.length, icon: Calendar, color: 'text-blue-600' },
            { id: 2, label: 'Pending Tasks', value: pendingTasks.length, icon: CheckSquare, color: 'text-orange-600' },
        ];

        if (permissions.canViewBudget) {
            baseKpis.push({
                id: 3,
                label: 'Budget Utilization',
                value: `${Math.round((totalSpent / totalBudget) * 100)}%`,
                icon: TrendingUp,
                color: totalSpent / totalBudget > 0.9 ? 'text-red-600' : 'text-green-600'
            });
        }

        if (currentUser.role === 'owner') {
            baseKpis.push({ id: 4, label: 'Active Workers', value: workers.filter(w => !w.available).length, icon: Users, color: 'text-purple-600' });
        } else {
            baseKpis.push({
                id: 4,
                label: 'My Tasks',
                value: tasks.filter(t => t.assignee === currentUser.id && t.status !== 'Approved').length,
                icon: CheckSquare,
                color: 'text-indigo-600'
            });
        }

        return baseKpis;
    }, [events, tasks, workers, permissions.canViewBudget, currentUser.role, currentUser.id]);

    return (
        <div className="space-y-6 pb-20 lg:pb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome, {currentUser.name.split(' ')[0]}</h2>
                    <p className="text-gray-600">Here's what's happening today</p>
                </div>
                <div className="hidden lg:flex gap-3">
                    {permissions.canCreateEvent && (
                        <button onClick={onNewEvent} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700">
                            <Plus size={16} /> New Event
                        </button>
                    )}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map(kpi => (
                    <KpiCard key={kpi.id} kpi={kpi} />
                ))}
            </div>

            {/* Quick Actions (Mobile) */}
            <div className="lg:hidden grid grid-cols-2 gap-3">
                {permissions.canCreateEvent && (
                    <button onClick={onNewEvent} className="bg-indigo-50 p-3 rounded-lg flex flex-col items-center justify-center gap-2 border border-indigo-100">
                        <div className="bg-indigo-600 text-white p-2 rounded-full"><Calendar size={20} /></div>
                        <span className="text-xs font-semibold text-indigo-900">New Event</span>
                    </button>
                )}
                <button onClick={onNewTask} className="bg-orange-50 p-3 rounded-lg flex flex-col items-center justify-center gap-2 border border-orange-100">
                    <div className="bg-orange-600 text-white p-2 rounded-full"><CheckSquare size={20} /></div>
                    <span className="text-xs font-semibold text-orange-900">New Task</span>
                </button>
            </div>

            {permissions.canViewBudget && (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <DollarSign size={20} className="text-green-600" />
                            Financial Overview
                        </h3>
                        <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">On Track</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Total Budget (Active Events)</span>
                                <span className="font-bold">₹40.0L</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Total Spent</span>
                                <span className="font-bold">₹23.0L</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '57.5%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Events List */}
            <div className="space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Activity size={20} className="text-indigo-600" />
                    Active Events
                </h3>
                {events.filter(e => e.status === 'Active').map(event => (
                    <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event)} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
