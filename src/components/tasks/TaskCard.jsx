import React from 'react';
import { Clock, MapPin, MoreVertical, CheckSquare, Upload, Check, XCircle, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const TaskCard = ({ task, onClick, inEventContext = false }) => {
    const { permissions } = useAuth();
    const { workers } = useData();

    const worker = workers.find(w => w.id === task.assignee);

    return (
        <div onClick={onClick} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-card-hover hover:border-primary-100 transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${task.priority === 'High' ? 'bg-red-500 shadow-sm shadow-red-200' : task.priority === 'Medium' ? 'bg-yellow-500 shadow-sm shadow-yellow-200' : 'bg-green-500 shadow-sm shadow-green-200'}`} />
                        <h4 className="font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">{task.title}</h4>
                    </div>
                    <p className="text-sm text-gray-500 font-medium line-clamp-2">{task.description}</p>
                </div>
                {!inEventContext && (
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical size={18} />
                    </button>
                )}
                {inEventContext && (
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${task.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                        task.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            task.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                        {task.status}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <Clock size={14} className="text-primary-500" />
                    <span>{task.dueDate}</span>
                </div>
                {task.location && (
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                        <MapPin size={14} className="text-primary-500" />
                        <span className="truncate max-w-[100px]">{task.location}</span>
                    </div>
                )}
                {inEventContext && worker && (
                    <span className="flex items-center gap-1.5 ml-auto">
                        <Users size={14} className="text-gray-400" />
                        {worker.name}
                    </span>
                )}
            </div>

            {!inEventContext && (
                <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border ${task.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                        task.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            task.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                        {task.status}
                    </span>
                    {worker && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-[8px] text-white font-bold">
                                {worker.name.charAt(0)}
                            </div>
                            <span className="text-xs font-medium text-gray-600">{worker.name}</span>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-gray-600">
                        <CheckSquare size={14} className="text-primary-500" />
                        <span>{task.checklistDone}/{task.checklistTotal} items</span>
                    </div>
                    <span className="font-bold text-gray-900">{Math.round((task.checklistDone / task.checklistTotal) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(task.checklistDone / task.checklistTotal) * 100}%` }}
                    />
                </div>
            </div>

            {permissions.isWorker && task.status === 'Open' && (
                <div className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
                    <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200">Start Task</button>
                    <button className="px-3 bg-white border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors"><Upload size={14} /></button>
                </div>
            )}
            {permissions.canApprove && task.status === 'Submitted' && (
                <div className="mt-4 pt-3 border-t border-gray-50 flex gap-2">
                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-green-700 shadow-sm shadow-green-200">
                        <Check size={14} /> Approve
                    </button>
                    <button className="flex-1 bg-red-50 text-red-600 border border-red-100 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-100">
                        <XCircle size={14} /> Reject
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
