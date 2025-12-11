import React from 'react';
import { X, CheckSquare, AlertCircle, MessageSquare, Tag, Activity, Bell } from 'lucide-react';
import { useData } from '../../context/DataContext';

const NotificationsPanel = ({ showNotifications, setShowNotifications, setSelectedTask }) => {
    const { notifications, markAllNotificationsRead, markNotificationRead, tasks } = useData();

    if (!showNotifications) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:bg-transparent" onClick={() => setShowNotifications(false)}>
            <div
                className="absolute right-0 top-0 h-full w-full lg:w-96 bg-white shadow-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Notifications</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={markAllNotificationsRead}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Mark all read
                        </button>
                        <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {notifications.map(notif => (
                        <div
                            key={notif.id}
                            onClick={() => {
                                markNotificationRead(notif.id);
                                if (notif.taskId) {
                                    const task = tasks.find(t => t.id === notif.taskId);
                                    if (task) setSelectedTask(task);
                                }
                            }}
                            className={`p-4 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'approval' ? 'bg-yellow-100' :
                                        notif.type === 'overdue' ? 'bg-red-100' :
                                            notif.type === 'mention' ? 'bg-blue-100' :
                                                notif.type === 'vendor' ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                    {notif.type === 'approval' && <CheckSquare className="text-yellow-600" size={20} />}
                                    {notif.type === 'overdue' && <AlertCircle className="text-red-600" size={20} />}
                                    {notif.type === 'mention' && <MessageSquare className="text-blue-600" size={20} />}
                                    {notif.type === 'vendor' && <Tag className="text-green-600" size={20} />}
                                    {notif.type === 'update' && <Activity className="text-gray-600" size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-sm text-gray-900">{notif.title}</h4>
                                        {!notif.read && <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                    <span className="text-xs text-gray-500 mt-2 block">{notif.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {notifications.length === 0 && (
                    <div className="p-8 text-center">
                        <Bell size={48} className="mx-auto text-gray-400 mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-1">No notifications</h3>
                        <p className="text-sm text-gray-600">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPanel;
