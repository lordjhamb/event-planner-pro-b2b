import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import TaskCard from '../components/tasks/TaskCard';

const Tasks = ({ onSelectTask }) => {
    const { tasks } = useData();
    const [filterStatus, setFilterStatus] = useState('all');

    const visibleTasks = tasks.filter(t => filterStatus === 'all' || t.status === filterStatus);

    return (
        <div className="space-y-4 pb-20 lg:pb-4">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 overflow-x-auto">
                    {['all', 'Open', 'In Progress', 'Submitted', 'Approved'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${filterStatus === status ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            {status === 'all' ? 'All' : status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {visibleTasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => onSelectTask(task)} inEventContext={false} />
                ))}
            </div>
        </div>
    );
};

export default Tasks;
