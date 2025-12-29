import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import TaskCard from '../components/tasks/TaskCard';

const Tasks = ({ onSelectTask, initialFilter = 'all' }) => {
    const { tasks } = useData();
    const [filterStatus, setFilterStatus] = useState(initialFilter);

    // If initialFilter changes (e.g. from Dashboard click), update state
    React.useEffect(() => {
        setFilterStatus(initialFilter);
    }, [initialFilter]);

    const getFilteredTasks = () => {
        const today = new Date().toISOString().split('T')[0];

        switch (filterStatus) {
            case 'overdue':
                return tasks.filter(t => t.dueDate < today && t.status !== 'Approved');
            case 'upcoming':
                // Logic for next 7 days
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                const nextWeekStr = nextWeek.toISOString().split('T')[0];
                return tasks.filter(t => t.dueDate >= today && t.dueDate <= nextWeekStr && t.status !== 'Approved');
            case 'pending_approval':
                return tasks.filter(t => t.status === 'Submitted');
            case 'all':
                return tasks;

            case 'completed': // Handle 'completed' generically if passed
            case 'Closed':
                return tasks.filter(t => t.status === 'Completed' || t.status === 'Approved'); // Assuming Closed = Completed/Approved
            case 'issues':
                return tasks.filter(t => t.status === 'Submitted' || t.status === 'Blocked' || t.hasIssue || t.helpNote || t.rejectionNote);
            default:
                return tasks.filter(t => t.status === filterStatus);
        }
    };

    const visibleTasks = getFilteredTasks();

    const tabs = [
        { id: 'all', label: 'All Tasks' },
        { id: 'issues', label: 'Issues' },
        { id: 'overdue', label: 'Overdue' },
        { id: 'Open', label: 'Open' },
        { id: 'In Progress', label: 'In Progress' },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'Submitted', label: 'Submitted' },
        { id: 'Approved', label: 'Approved' },
        { id: 'Closed', label: 'Closed' } // Assuming this maps to Completed
    ];

    return (
        <div className="space-y-6 pb-20 lg:pb-0 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-heading font-bold text-gray-900">Tasks</h2>
                <div className="hidden md:block text-sm text-gray-500">
                    Showing {visibleTasks.length} tasks
                </div>
            </div>

            {/* Special Filter Badges (if active from dashboard) */}
            {['upcoming', 'pending_approval'].includes(filterStatus) && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-800 capitalize">
                        Filtering by: {filterStatus.replace('_', ' ')}
                    </span>
                    <button onClick={() => setFilterStatus('all')} className="text-xs font-bold text-yellow-900 hover:underline">
                        Clear Filter
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 overflow-x-auto">
                <div className="flex items-center gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterStatus(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === tab.id
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {visibleTasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => onSelectTask(task)} inEventContext={false} />
                ))}
                {visibleTasks.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No tasks found for this filter.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;
