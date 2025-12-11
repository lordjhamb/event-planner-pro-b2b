import React from 'react';
import { Clock, MapPin, MoreVertical, CheckSquare, Upload, Check, XCircle, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const TaskCard = ({ task, onClick, inEventContext = false }) => {
    const { permissions } = useAuth();
    const { workers } = useData();

    const worker = workers.find(w => w.id === task.assignee);

    return (
        <div onClick={onClick} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                        <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                {!inEventContext && <button className="p-1 hover:bg-gray-100 rounded"><MoreVertical size={16} /></button>}
                {inEventContext && (
                    <span className={`text-xs px-2 py-1 rounded ${task.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            task.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                                task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                        }`}>
                        {task.status}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                    <Clock size={14} /><span>{task.dueDate}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MapPin size={14} /><span>{task.location}</span>
                </div>
                {inEventContext && worker && (
                    <span className="flex items-center gap-1">
                        <Users size={12} />
                        {worker.name}
                    </span>
                )}
            </div>

            {!inEventContext && (
                <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${task.status === 'Approved' ? 'bg-green-100 text-green-700' : task.status === 'Submitted' ? 'bg-blue-100 text-blue-700' : task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                        {task.status}
                    </span>
                    {worker && <span className="text-xs text-gray-600">{worker.name}</span>}
                </div>
            )}

            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                    <CheckSquare size={14} />
                    <span>{task.checklistDone}/{task.checklistTotal} completed</span>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${(task.checklistDone / task.checklistTotal) * 100}%` }} />
                </div>
            </div>
            {permissions.isWorker && task.status === 'Open' && (
                <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold">Start Task</button>
                    <button className="px-4 bg-gray-100 text-gray-700 py-2 rounded-lg"><Upload size={16} /></button>
                </div>
            )}
            {permissions.canApprove && task.status === 'Submitted' && (
                <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1">
                        <Check size={16} />Approve
                    </button>
                    <button className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1">
                        <XCircle size={16} />Reject
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
