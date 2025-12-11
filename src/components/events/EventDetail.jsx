import React, { useState } from 'react';
import { ChevronRight, Calendar, MapPin, Award, FileText, DollarSign, Users, CheckSquare, Plus, AlertCircle, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import TaskCard from '../tasks/TaskCard'; // Assuming we extract this next

const EventDetail = ({ event, onBack, onSelectTask, onSelectWorker, onNewTask }) => {
    const { permissions } = useAuth();
    const { tasks, workers } = useData();
    const [filterStatus, setFilterStatus] = useState('all');

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

    return (
        <div className="space-y-4 pb-20 lg:pb-4">
            {/* Back Button */}
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ChevronRight size={16} className="rotate-180" />
                <span className="text-sm">Back to Dashboard</span>
            </button>

            {/* Event Header Card */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{event.name}</h2>
                        <p className="text-sm text-gray-600">{event.client}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {event.status}
                    </span>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                        <Calendar size={16} />
                        <span>{event.dates}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Overall Progress</span>
                        <span className="font-semibold text-gray-900">{event.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-indigo-600 h-3 rounded-full transition-all" style={{ width: `${event.progress}%` }} />
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div className="pt-3 border-t border-gray-200 grid grid-cols-3 gap-3 text-center">
                    <div>
                        <div className="text-lg font-bold text-gray-900">{eventTasks.length}</div>
                        <div className="text-xs text-gray-600">Total Tasks</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-green-600">{completedTasksCount}</div>
                        <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-red-600">{event.overdueTasks}</div>
                        <div className="text-xs text-gray-600">Overdue</div>
                    </div>
                </div>
            </div>

            {/* Event Leadership Team */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Award size={18} className="text-indigo-600" />
                    Event Leadership Team
                </h3>

                {/* Primary Lead */}
                {event.primaryLeadId && (
                    <div className="mb-3">
                        <div className="text-xs font-semibold text-gray-600 mb-2">Primary Lead (Overall Responsibility)</div>
                        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {workers.find(w => w.id === event.primaryLeadId)?.name.split(' ').map(n => n[0]).join('') || 'PL'}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-900">
                                        {workers.find(w => w.id === event.primaryLeadId)?.name || 'Primary Lead'}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Can approve all tasks • Full event oversight
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-2 py-1 rounded-full font-medium">
                                    <Award size={12} />
                                    Primary
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Department Leads */}
                {event.departmentLeads && event.departmentLeads.length > 0 && (
                    <div>
                        <div className="text-xs font-semibold text-gray-600 mb-2">
                            Department Leads ({event.departmentLeads.length})
                        </div>
                        <div className="space-y-2">
                            {event.departmentLeads.map(dept => (
                                <div key={dept.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                            {dept.leadName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm text-gray-900">{dept.leadName}</div>
                                            <div className="text-xs text-gray-600">{dept.category}</div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                            <Briefcase size={10} />
                                            Dept Lead
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Approval Settings Info */}
                {event.autoEscalate && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                        <div className="flex items-start gap-2 text-xs text-yellow-800">
                            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                            <div>
                                <strong>Auto-escalation enabled:</strong> Tasks with budget exceeding ₹{(event.budgetThreshold / 100000).toFixed(1)}L will automatically require Owner approval after lead review.
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Overview Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText size={18} />
                    Overview
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Event Type</span>
                        <span className="text-sm font-semibold text-gray-900">Wedding</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Expected Guests</span>
                        <span className="text-sm font-semibold text-gray-900">500</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Venue</span>
                        <span className="text-sm font-semibold text-gray-900">{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Team Members</span>
                        <span className="text-sm font-semibold text-gray-900">{eventWorkers.length} workers</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Days Until Event</span>
                        <span className="text-sm font-semibold text-indigo-600">9 days</span>
                    </div>
                </div>
            </div>

            {/* Budget Overview */}
            {permissions.canViewBudget && (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <DollarSign size={18} />
                        Budget Overview
                    </h3>

                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Budget Utilization</span>
                            <span className="text-sm font-semibold text-gray-900">
                                ₹{(spentBudget / 100000).toFixed(2)}L / ₹{(totalBudget / 100000).toFixed(2)}L
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all ${budgetPercentage > 90 ? 'bg-red-600' : budgetPercentage > 75 ? 'bg-yellow-600' : 'bg-green-600'
                                    }`}
                                style={{ width: `${budgetPercentage}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{budgetPercentage.toFixed(1)}% used</span>
                            <span className="text-xs text-gray-500">₹{((totalBudget - spentBudget) / 100000).toFixed(2)}L remaining</span>
                        </div>
                    </div>

                    {/* Budget Breakdown - Hardcoded in original, we can mock it here too */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">Venue</span>
                            </div>
                            <span className="text-sm font-semibold">₹8.5L</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">Catering</span>
                            </div>
                            <span className="text-sm font-semibold">₹6.2L</span>
                        </div>
                        {/* ... other items */}
                    </div>

                    <button className="w-full mt-3 text-sm text-indigo-600 font-semibold hover:text-indigo-700">
                        View Detailed Budget →
                    </button>
                </div>
            )}

            {/* Team Members */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users size={18} />
                    Team Members ({eventWorkers.length})
                </h3>
                <div className="space-y-2">
                    {eventWorkers.map(worker => (
                        <div
                            key={worker.id}
                            onClick={() => onSelectWorker(worker)}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {worker.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="font-medium text-sm">{worker.name}</div>
                                    <div className="text-xs text-gray-600">{worker.skills[0]}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${worker.available ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-xs text-gray-600">{worker.tasksCount} tasks</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-3 text-sm text-indigo-600 font-semibold hover:text-indigo-700">
                    + Assign More Workers
                </button>
            </div>

            {/* All Tasks Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <CheckSquare size={18} />
                        All Tasks ({eventTasks.length})
                    </h3>
                    <button
                        onClick={onNewTask}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 hover:bg-indigo-700"
                    >
                        <Plus size={16} />
                        Add Task
                    </button>
                </div>

                {/* Task Filter */}
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {['all', 'Open', 'In Progress', 'Submitted', 'Approved'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${filterStatus === status ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                                    }`}
                            >
                                {status === 'all' ? 'All' : status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tasks List */}
                <div className="divide-y divide-gray-200">
                    {visibleTasks.length > 0 ? (
                        visibleTasks.map(task => (
                            <TaskCard key={task.id} task={task} onClick={() => onSelectTask(task)} inEventContext={true} />
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <CheckSquare size={48} className="mx-auto text-gray-400 mb-3" />
                            <h4 className="font-semibold text-gray-900 mb-1">No tasks yet</h4>
                            <p className="text-sm text-gray-600 mb-4">Get started by creating your first task</p>
                            <button
                                onClick={onNewTask}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 hover:bg-indigo-700"
                            >
                                <Plus size={16} />
                                Create First Task
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Add Task Button for Mobile */}
            {permissions.canCreateEvent && (
                <button
                    onClick={onNewTask}
                    className="lg:hidden fixed bottom-20 right-4 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 z-30"
                >
                    <Plus size={24} />
                </button>
            )}
        </div>
    );
};

export default EventDetail;
