import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
    BarChart3, TrendingUp, DollarSign, Calendar, Filter,
    AlertTriangle, CheckCircle, Clock, Users, ArrowUpRight, ArrowDownRight,
    PieChart as PieIcon, Activity, Target, FileText, Download, FileSpreadsheet, X
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';

const Analytics = () => {
    const { events, tasks, workers } = useData();
    const [dateRange, setDateRange] = useState('30'); // 7, 30, 90, year
    const [selectedEventId, setSelectedEventId] = useState('all');
    const [activeTab, setActiveTab] = useState('overview');
    const [generatingReport, setGeneratingReport] = useState(null);
    const [detailView, setDetailView] = useState(null); // { type: 'spent' | 'worker', data: any }

    // --- 1. Data Processing & Calculations ---

    // Filtered Data
    const filteredEvents = useMemo(() => {
        if (selectedEventId === 'all') return events;
        return events.filter(e => e.id === selectedEventId);
    }, [events, selectedEventId]);

    const filteredTasks = useMemo(() => {
        if (selectedEventId === 'all') return tasks;
        return tasks.filter(t => t.eventId === selectedEventId);
    }, [tasks, selectedEventId]);

    // Financial Metrics
    const metrics = useMemo(() => {
        const totalBudget = filteredEvents.reduce((sum, e) => sum + e.budget, 0);
        const totalSpent = filteredEvents.reduce((sum, e) => sum + (e.spent || 0), 0);
        const activeEventsCount = filteredEvents.filter(e => e.status === 'Active').length;
        const profitMargin = totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 0;

        return { totalBudget, totalSpent, activeEventsCount, profitMargin };
    }, [filteredEvents]);

    // Task Metrics
    const taskMetrics = useMemo(() => {
        const total = filteredTasks.length;
        const completed = filteredTasks.filter(t => t.status === 'Approved').length;
        const completionRate = total > 0 ? (completed / total) * 100 : 0;
        const overdue = filteredTasks.filter(t => {
            if (t.status === 'Approved') return false;
            return new Date(t.dueDate) < new Date();
        }).length;

        return { total, completed, completionRate, overdue };
    }, [filteredTasks]);

    // Workload Matrix (Team Tab)
    const workloadMatrix = useMemo(() => {
        const weeks = [0, 1, 2, 3].map(offset => {
            const start = new Date();
            start.setDate(start.getDate() + (offset * 7));
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            return { start, end, label: `Week ${offset + 1}` };
        });

        return workers.map(worker => {
            const workerTasks = filteredTasks.filter(t => t.assignee === worker.id && t.status !== 'Approved');
            const weeklyLoad = weeks.map(week => {
                const count = workerTasks.filter(t => {
                    const d = new Date(t.dueDate);
                    return d >= week.start && d <= week.end;
                }).length;

                let intensity = 'bg-green-100 text-green-700'; // Low
                if (count >= 3) intensity = 'bg-yellow-100 text-yellow-700'; // Medium
                if (count >= 5) intensity = 'bg-red-100 text-red-700 font-bold'; // High

                return { count, intensity, weekLabel: week.label };
            });
            return { ...worker, weeklyLoad };
        });
    }, [workers, filteredTasks]);

    // Chart Data Construction
    const financialChartData = useMemo(() => {
        // Transform events into chart data
        return filteredEvents.slice(0, 5).map(e => ({
            name: e.name.split(' ')[0], // Short name
            Budget: e.budget,
            Spent: e.spent || 0,
            Predicted: (e.spent || 0) * 1.2 // Mock prediction
        }));
    }, [filteredEvents]);

    const taskProgressData = useMemo(() => {
        const data = [
            { name: 'To Do', value: filteredTasks.filter(t => t.status === 'Open').length, color: '#94a3b8' },
            { name: 'In Progress', value: filteredTasks.filter(t => t.status === 'In Progress').length, color: '#fbbf24' },
            { name: 'Review', value: filteredTasks.filter(t => t.status === 'Submitted').length, color: '#6366f1' },
            { name: 'Done', value: filteredTasks.filter(t => t.status === 'Approved').length, color: '#22c55e' },
        ];
        return data.filter(d => d.value > 0);
    }, [filteredTasks]);

    // Risk Analysis
    const criticalRisks = useMemo(() => {
        const risks = [];
        // Budget Risks
        filteredEvents.forEach(e => {
            const spentPct = (e.spent / e.budget) * 100;
            if (spentPct > 80 && e.progress < 50) {
                risks.push({
                    type: 'budget',
                    level: 'critical',
                    title: `Budget Risk: ${e.name}`,
                    message: `${spentPct.toFixed(0)}% budget spent but only ${e.progress}% complete.`
                });
            }
        });
        // Worker Risks (Mock utilization)
        workers.forEach(w => {
            if (w.tasksCount >= 5) {
                risks.push({
                    type: 'capacity',
                    level: 'warning',
                    title: `High Load: ${w.name}`,
                    message: `Assignments at capacity (${w.tasksCount} tasks).`
                });
            }
        });

        return risks;
    }, [filteredEvents, workers]);

    const handleGenerateReport = (reportType) => {
        setGeneratingReport(reportType);
        setTimeout(() => {
            setGeneratingReport(null);
            // In a real app, this would trigger a download
            alert(`${reportType} generated successfully!`);
        }, 2000);
    };


    // --- 2. Sub-Components ---

    const KpiCard = ({ title, value, subtext, trend, trendUp, icon: Icon, colorClass, onClick }) => (
        <div
            onClick={onClick}
            className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-indigo-200' : ''}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {trend}
                    </span>
                )}
            </div>
            <div className="text-2xl font-heading font-bold text-gray-900 mb-1">{value}</div>
            <p className="text-sm font-medium text-gray-500">{subtext}</p>
        </div>
    );

    const ReportCard = ({ title, description, type, icon: Icon, colorClass }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass}`}>
                <Icon size={24} />
            </div>
            <h3 className="font-heading font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-6 flex-1">{description}</p>
            <button
                onClick={() => handleGenerateReport(title)}
                disabled={generatingReport === title}
                className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {generatingReport === title ? (
                    <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-indigo-600 rounded-full animate-spin"></div>
                        Generating...
                    </>
                ) : (
                    <>
                        <Download size={16} /> Generate Report
                    </>
                )}
            </button>
        </div>
    );

    const MetricDetailModal = ({ view, onClose }) => {
        if (!view) return null;
        const { type, data } = view;

        let title = '';
        let content = null;

        if (type === 'spent') {
            title = 'Top Expenses by Event';
            const sortedEvents = [...filteredEvents].sort((a, b) => b.spent - a.spent);
            content = (
                <div className="space-y-3">
                    {sortedEvents.map(e => (
                        <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <div className="font-bold text-gray-900">{e.name}</div>
                                <div className="text-xs text-gray-500">Budget: ₹{(e.budget / 100000).toFixed(1)}L</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-indigo-600">₹{(e.spent / 100000).toFixed(1)}L</div>
                                <div className="text-xs text-gray-500">{((e.spent / e.budget) * 100).toFixed(0)}% Utilized</div>
                            </div>
                        </div>
                    ))}
                    {sortedEvents.length === 0 && <p className="text-gray-500 text-center py-4">No events found.</p>}
                </div>
            );
        } else if (type === 'time') {
            title = 'Recent Completed Tasks';
            // Mock logic for completion time, showing recently approved tasks
            const completedTasks = filteredTasks.filter(t => t.status === 'Approved').slice(0, 10);
            content = (
                <div className="space-y-3">
                    {completedTasks.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <CheckCircle size={16} />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{t.title}</div>
                                    <div className="text-xs text-gray-500">Assignee: {workers.find(w => w.id === t.assignee)?.name || 'Unknown'}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Completed</span>
                            </div>
                        </div>
                    ))}
                    {completedTasks.length === 0 && <p className="text-gray-500 text-center py-4">No recently completed tasks.</p>}
                </div>
            );
        } else if (type === 'rate') {
            title = 'Overdue Tasks Alert';
            const overdueTasks = filteredTasks.filter(t => t.status !== 'Approved' && new Date(t.dueDate) < new Date());
            content = (
                <div className="space-y-3">
                    {overdueTasks.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                    <AlertTriangle size={16} />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{t.title}</div>
                                    <div className="text-xs text-red-500">Due: {new Date(t.dueDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="bg-white text-red-700 text-xs font-bold px-2 py-1 rounded-full border border-red-200">Overdue</span>
                            </div>
                        </div>
                    ))}
                    {overdueTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <CheckCircle size={48} className="text-green-400 mb-2" />
                            <p className="text-gray-900 font-bold">All Good!</p>
                            <p className="text-gray-500 text-sm">No overdue tasks found.</p>
                        </div>
                    )}
                </div>
            );
        } else if (type === 'risk') {
            title = 'Risk Assessment Details';
            content = (
                <div className="space-y-3">
                    {criticalRisks.map((risk, i) => (
                        <div key={i} className={`p-4 rounded-xl border flex items-start gap-4 ${risk.level === 'critical' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
                            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${risk.level === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                <AlertTriangle size={16} />
                            </div>
                            <div>
                                <h4 className={`font-bold text-sm mb-1 ${risk.level === 'critical' ? 'text-red-900' : 'text-orange-900'}`}>
                                    {risk.title}
                                </h4>
                                <p className={`text-sm ${risk.level === 'critical' ? 'text-red-700' : 'text-orange-700'}`}>
                                    {risk.message}
                                </p>
                            </div>
                        </div>
                    ))}
                    {criticalRisks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <CheckCircle size={48} className="text-green-400 mb-2" />
                            <p className="text-gray-900 font-bold">No Critical Risks</p>
                            <p className="text-gray-500 text-sm">Everything is running within safe parameters.</p>
                        </div>
                    )}
                </div>
            );
        } else if (type === 'status_distribution') {
            title = 'Task Status Overview';
            content = (
                <div className="space-y-3">
                    {filteredTasks.map(t => {
                        let statusColor = 'bg-gray-100 text-gray-700';
                        if (t.status === 'In Progress') statusColor = 'bg-yellow-100 text-yellow-700';
                        if (t.status === 'Submitted') statusColor = 'bg-indigo-100 text-indigo-700';
                        if (t.status === 'Approved') statusColor = 'bg-green-100 text-green-700';

                        return (
                            <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{t.title}</div>
                                    <div className="text-xs text-gray-500">Assignee: {workers.find(w => w.id === t.assignee)?.name || 'Unknown'}</div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor}`}>
                                        {t.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {filteredTasks.length === 0 && <p className="text-gray-500 text-center py-4">No tasks found.</p>}
                </div>
            );
        } else if (type === 'worker') {
            const worker = data;
            title = `${worker.name} - Active Tasks`;
            const workerTasks = filteredTasks.filter(t => t.assignee === worker.id && t.status !== 'Approved');

            content = (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-lg font-bold">
                            {worker.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">{worker.skills.join(', ')}</div>
                            <div className="text-sm text-gray-500">{worker.role.toUpperCase()}</div>
                        </div>
                        <div className="ml-auto text-right">
                            <div className="text-2xl font-bold text-gray-900">{workerTasks.length}</div>
                            <div className="text-xs text-gray-500">Active Tasks</div>
                        </div>
                    </div>

                    <h4 className="font-bold text-sm text-gray-700">Assignments Due Soon:</h4>
                    <div className="space-y-3">
                        {workerTasks.map(t => {
                            const isOverdue = new Date(t.dueDate) < new Date();
                            return (
                                <div key={t.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{t.title}</div>
                                        <div className={`text-xs ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                            Due: {new Date(t.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                                        {t.status}
                                    </div>
                                </div>
                            )
                        })}
                        {workerTasks.length === 0 && <p className="text-gray-500 text-center py-4">No active tasks assigned.</p>}
                    </div>
                </div>
            )
        }

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-up">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h3 className="text-xl font-heading font-bold text-gray-900">{title}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                    <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {content}
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                        <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-24 lg:pb-8 animate-fade-in relative">
            {/* Modal */}
            {detailView && (
                <MetricDetailModal view={detailView} onClose={() => setDetailView(null)} />
            )}

            {/* Header: Title + Global Filters */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-heading font-bold text-gray-900">Analytics Dashboard</h2>
                        <p className="text-gray-500">Real-time insights and performance metrics</p>
                    </div>

                    {/* GLOBAL CONTROLS */}
                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm self-start md:self-auto">
                        <div className="relative">
                            <select
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                className="pl-3 pr-8 py-2 text-sm font-bold text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer outline-none appearance-none"
                            >
                                <option value="all">All Events</option>
                                {events.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </select>
                            <Filter size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {['7', '30', '90'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDateRange(d)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${dateRange === d ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {d}D
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex items-center gap-1 w-full md:w-auto self-start">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 md:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'overview' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <BarChart3 size={16} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('team')}
                        className={`flex-1 md:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'team' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Users size={16} /> Team Load
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`flex-1 md:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'reports' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <FileText size={16} /> Reports
                    </button>
                </div>
            </div>

            {/* TAB CONTENT */}

            {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                    {/* 1. KPI Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KpiCard
                            title="Total Spent"
                            value={`₹${(metrics.totalSpent / 100000).toFixed(1)}L`}
                            subtext={`of ₹${(metrics.totalBudget / 100000).toFixed(1)}L Budget`}
                            trend="8.5%"
                            trendUp={true}
                            icon={DollarSign}
                            colorClass="bg-indigo-50 text-indigo-600"
                            onClick={() => setDetailView({ type: 'spent' })}
                        />
                        <KpiCard
                            title="Avg Completion Time"
                            value="3.2 days"
                            subtext="Target: 3.0 days"
                            trend="0.5 days"
                            trendUp={true} // Interpreted as 'improvement'
                            icon={Clock}
                            colorClass="bg-blue-50 text-blue-600"
                            onClick={() => setDetailView({ type: 'time' })}
                        />
                        <KpiCard
                            title="On-Time Rate"
                            value={`${taskMetrics.completionRate.toFixed(0)}%`}
                            subtext={`${taskMetrics.completed}/${taskMetrics.total} Tasks`}
                            trend="5%"
                            trendUp={true}
                            icon={Target}
                            colorClass="bg-green-50 text-green-600"
                            onClick={() => setDetailView({ type: 'rate' })}
                        />
                        <KpiCard
                            title="Active Risks"
                            value={criticalRisks.length}
                            subtext="Requires Attention"
                            trend={criticalRisks.length > 0 ? "Action Needed" : "Stable"}
                            trendUp={criticalRisks.length === 0}
                            icon={AlertTriangle}
                            colorClass={criticalRisks.length > 0 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"}
                            onClick={() => setDetailView({ type: 'risk' })}
                        />
                    </div>

                    {/* 2. Main Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Financial Deep Dive */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2">
                                    <BarChart3 size={20} className="text-indigo-600" />
                                    Financial Performance (Budget vs Spent)
                                </h3>
                            </div>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={financialChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `₹${value / 1000}k`} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => `₹${(value).toLocaleString()}`}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Bar dataKey="Budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={30} />
                                        <Bar dataKey="Spent" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Task Velocity / Status */}
                        <div
                            onClick={() => setDetailView({ type: 'status_distribution' })}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:border-purple-200 hover:shadow-card-hover transition-all"
                        >
                            <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 mb-6">
                                <Activity size={20} className="text-purple-600" />
                                Task Status Distribution
                            </h3>
                            <div className="flex-1 min-h-[250px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={taskProgressData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {taskProgressData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center mt-2 pr-20"> {/* Offset for legend */}
                                        <div className="text-2xl font-bold text-gray-900">{taskMetrics.total}</div>
                                        <div className="text-xs text-gray-500">Tasks</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Risk & Insights Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Risk Dashboard - Also clickable via header if we wanted, but cards are better */}
                        <div
                            onClick={() => setDetailView({ type: 'risk' })}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-red-200 transition-colors"
                        >
                            <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 mb-6">
                                <AlertTriangle size={20} className="text-red-500" />
                                Risk Assessment
                            </h3>

                            {criticalRisks.length > 0 ? (
                                <div className="space-y-4">
                                    {criticalRisks.map((risk, i) => (
                                        <div key={i} className={`p-4 rounded-xl border flex items-start gap-4 ${risk.level === 'critical' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
                                            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${risk.level === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                                <AlertTriangle size={16} />
                                            </div>
                                            <div>
                                                <h4 className={`font-bold text-sm mb-1 ${risk.level === 'critical' ? 'text-red-900' : 'text-orange-900'}`}>
                                                    {risk.title}
                                                </h4>
                                                <p className={`text-sm ${risk.level === 'critical' ? 'text-red-700' : 'text-orange-700'}`}>
                                                    {risk.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 bg-green-50 rounded-xl border border-green-100">
                                    <CheckCircle size={32} className="text-green-500 mb-2" />
                                    <p className="font-bold text-green-800">No Critical Risks Detected</p>
                                    <p className="text-sm text-green-600">All systems operational</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions / AI Recommendations (Mock) */}
                        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-2xl shadow-lg text-white">
                            <h3 className="font-heading font-bold flex items-center gap-2 mb-6">
                                <TrendingUp size={20} className="text-indigo-300" />
                                AI Recommendations
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                                    <h4 className="font-bold text-sm mb-1 flex items-center justify-between">
                                        Optimize Worker Allocation
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-[10px] rounded-full">High Impact</span>
                                    </h4>
                                    <p className="text-sm text-indigo-100 opacity-90">
                                        Redistribute 2 overdue tasks from Vikram to Neha to improve velocity by 15%.
                                    </p>
                                </div>

                                <div className="p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                                    <h4 className="font-bold text-sm mb-1 flex items-center justify-between">
                                        Budget Alert
                                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-[10px] rounded-full">Medium</span>
                                    </h4>
                                    <p className="text-sm text-indigo-100 opacity-90">
                                        Tech Summit catering is trending 12% over budget. Review vendor quotes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'team' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                    <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <Users size={20} className="text-blue-600" />
                        Team Workload Heatmap (Upcoming 4 Weeks)
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Team Member</th>
                                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">Role</th>
                                    {[0, 1, 2, 3].map(i => (
                                        <th key={i} className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                                            Week {i + 1}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {workloadMatrix.map(worker => (
                                    <tr
                                        key={worker.id}
                                        onClick={() => setDetailView({ type: 'worker', data: worker })}
                                        className="hover:bg-indigo-50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                                                    {worker.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-sm group-hover:text-indigo-700">{worker.name}</div>
                                                    <div className="text-xs text-gray-500">{worker.skills[0]}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${worker.role === 'lead' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {worker.role}
                                            </span>
                                        </td>
                                        {worker.weeklyLoad.map((week, idx) => (
                                            <td key={idx} className="px-4 py-3 text-center">
                                                <div className={`mx-auto w-12 py-1 rounded-lg text-xs flex flex-col items-center justify-center ${week.intensity}`}>
                                                    <span className="font-bold">{week.count}</span>
                                                    <span className="text-[9px] opacity-75">Tasks</span>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="animate-fade-in space-y-6">
                    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-3xl font-heading font-bold mb-4">Report Center</h2>
                            <p className="text-indigo-100 text-lg mb-8">
                                Generate comprehensive reports for your clients, finance team, or internal review.
                                Export data in professional PDF or flexible Excel formats.
                            </p>
                        </div>
                        {/* Decorative Patterns */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ReportCard
                            title="Financial Summary"
                            description="Detailed breakdown of Budget vs Actuals, categorized by department. Includes cost variance analysis."
                            type="PDF"
                            icon={DollarSign}
                            colorClass="bg-indigo-50 text-indigo-600"
                        />
                        <ReportCard
                            title="Event Status Report"
                            description="Weekly progress update for stakeholders. Highlights operational risks, completed milestones, and upcoming critical path items."
                            type="Excel"
                            icon={Activity}
                            colorClass="bg-purple-50 text-purple-600"
                        />
                        <ReportCard
                            title="Team Performance"
                            description="Internal productivity analysis. Includes resource utilization, task velocity trends, and efficiency metrics."
                            type="PDF"
                            icon={Users}
                            colorClass="bg-blue-50 text-blue-600"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <Clock size={20} className="text-gray-400" />
                            Recent Reports
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Sharma Wedding - Weekly Status', date: 'Yesterday', type: 'PDF', size: '2.4 MB' },
                                { name: 'Q4 Financial Overview', date: '3 days ago', type: 'Excel', size: '850 KB' },
                                { name: 'Team Utilization Report', date: 'Last week', type: 'PDF', size: '1.2 MB' }
                            ].map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                                            {file.type === 'PDF' ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">{file.name}</div>
                                            <div className="text-xs text-gray-400">{file.date} â€¢ {file.size}</div>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors">
                                        <Download size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
