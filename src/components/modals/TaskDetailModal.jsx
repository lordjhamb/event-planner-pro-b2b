import React from 'react';
import { X, Clock, MapPin, CheckSquare, Upload, MessageSquare, Camera, ChevronRight, Activity, Check, XCircle, Award, AlertCircle, Users, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const TaskDetailModal = ({ task, onClose, onSelectWorker, onSelectEvent }) => {
    const { permissions } = useAuth();
    const { workers, events } = useData();

    if (!task) return null;

    const assignedWorker = workers.find(w => w.id === task.assignee);
    const taskEvent = events.find(e => e.id === task.eventId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl" style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                {/* Fixed Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl" style={{ flexShrink: 0 }}>
                    <h2 className="text-lg font-bold">Task Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-4 space-y-4" style={{ overflowY: 'auto', flex: 1 }}>
                    {/* Task Header */}
                    <div>
                        <h3 className="font-bold text-xl mb-2 text-gray-900">{task.title}</h3>
                        <p className="text-gray-600">{task.description}</p>
                    </div>

                    {/* Status and Priority Badges */}
                    <div className="flex gap-2 flex-wrap">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${task.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                task.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                            }`}>
                            {task.status}
                        </span>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                            }`}>
                            {task.priority} Priority
                        </span>
                    </div>

                    {/* Event Info */}
                    {taskEvent && (
                        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                            <div className="text-xs text-indigo-600 font-medium mb-1">Event</div>
                            <div className="font-semibold text-indigo-900">{taskEvent.name}</div>
                            <div className="text-xs text-indigo-700 mt-1">{taskEvent.dates}</div>
                        </div>
                    )}

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1 font-medium">Due Date</div>
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                                <Clock size={16} className="text-gray-600" />
                                {task.dueDate}
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-600 mb-1 font-medium">Location</div>
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin size={16} className="text-gray-600" />
                                {task.location}
                            </div>
                        </div>
                    </div>

                    {/* Assigned Worker */}
                    {assignedWorker && (
                        <div className="border border-gray-200 rounded-lg p-3">
                            <div className="text-sm font-semibold text-gray-700 mb-2">Assigned To</div>
                            <div
                                className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                onClick={() => onSelectWorker && onSelectWorker(assignedWorker)}
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {assignedWorker.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm text-gray-900">{assignedWorker.name}</div>
                                    <div className="text-xs text-gray-600">{assignedWorker.skills[0]}</div>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </div>
                        </div>
                    )}

                    {/* Checklist Progress */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">Task Progress</h4>
                            <span className="text-sm font-semibold text-gray-700">
                                {task.checklistDone}/{task.checklistTotal} completed
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div
                                className="bg-indigo-600 h-3 rounded-full transition-all"
                                style={{ width: `${(task.checklistDone / task.checklistTotal) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-600">
                            {Math.round((task.checklistDone / task.checklistTotal) * 100)}% complete
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MessageSquare size={18} />
                            Notes & Comments
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <div className="text-xs text-gray-500 mb-1">2 hours ago</div>
                            <p className="text-sm text-gray-700">Make sure to coordinate with the lighting team before installation.</p>
                        </div>
                        <textarea
                            placeholder="Add a note or comment..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            rows="2"
                        />
                    </div>
                </div>

                {/* Fixed Footer - Action Buttons */}
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl" style={{ flexShrink: 0 }}>
                    {permissions.isWorker && task.status === 'Open' && (
                        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
                            <Activity size={18} />
                            Start Task
                        </button>
                    )}
                    {permissions.isWorker && task.status === 'In Progress' && (
                        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
                            <Check size={18} />
                            Submit for Review
                        </button>
                    )}
                    {permissions.canApprove && task.status === 'Submitted' && (
                        <div className="flex gap-3">
                            <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
                                <XCircle size={18} />
                                Reject
                            </button>
                            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
                                <Check size={18} />
                                Approve
                            </button>
                        </div>
                    )}
                    {task.status === 'Approved' && (
                        <div className="text-center py-2 text-green-600 font-semibold flex items-center justify-center gap-2">
                            <Check size={20} />
                            Task Completed & Approved
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
