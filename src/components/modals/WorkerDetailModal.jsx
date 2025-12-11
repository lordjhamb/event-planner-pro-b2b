import React from 'react';
import { X, Star, Phone, Mail, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

const WorkerDetailModal = ({ worker, onClose, onSelectTask }) => {
    const { events, tasks } = useData();

    if (!worker) return null;

    const workerEvents = events.filter(e => e.workers.includes(worker.id));
    const workerTasks = tasks.filter(t => t.assignee === worker.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl" style={{ maxHeight: '75vh', display: 'flex', flexDirection: 'column' }}>
                {/* Fixed Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl" style={{ flexShrink: 0 }}>
                    <h2 className="text-lg font-bold">Worker Profile</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-4 space-y-4" style={{ overflowY: 'auto', flex: 1 }}>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                            {worker.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{worker.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`w-3 h-3 rounded-full ${worker.available ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-sm text-gray-600">{worker.available ? 'Available' : 'Busy'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="text-yellow-500" size={16} fill="currentColor" />
                                <span className="font-semibold text-gray-900">{worker.performance}%</span>
                                <span className="text-sm text-gray-600">Performance Score</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Active Tasks</div>
                            <div className="text-2xl font-bold text-gray-900">{worker.tasksCount}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Joined</div>
                            <div className="text-sm font-semibold text-gray-900">{worker.joinDate}</div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {worker.skills.map((skill, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Contact</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-gray-400" />
                                <a href={`tel:${worker.phone}`} className="text-indigo-600 hover:text-indigo-700">
                                    {worker.phone}
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-gray-400" />
                                <a href={`mailto:${worker.email}`} className="text-indigo-600 hover:text-indigo-700">
                                    {worker.email}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Assigned Events ({workerEvents.length})</h4>
                        <div className="space-y-2">
                            {workerEvents.map(event => (
                                <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="font-medium text-sm">{event.name}</div>
                                    <div className="text-xs text-gray-600 mt-1">{event.dates}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Current Tasks ({workerTasks.length})</h4>
                        <div className="space-y-2">
                            {workerTasks.map(task => (
                                <div
                                    key={task.id}
                                    onClick={() => onSelectTask(task)}
                                    className="p-3 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-colors"
                                >
                                    <div>
                                        <div className="font-medium text-sm">{task.title}</div>
                                        <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs text-gray-600">{task.dueDate}</div>
                                        <ChevronRight size={16} className="text-gray-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDetailModal;
