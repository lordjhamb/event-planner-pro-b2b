import React from 'react';
import { X, Bell, CheckCircle2, AlertCircle, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

const NotificationsPanel = ({ showNotifications, setShowNotifications, setSelectedTask }) => {
    const { tasks } = useData();

    // Mock notifications derived from tasks (usually this would be a separate data source)
    const notifications = [
        {
            id: 1,
            type: 'alert',
            title: 'Task Overdue',
            message: 'Setup Main Stage is overdue by 2 days',
            time: '2 hours ago',
            relatedTaskId: tasks.find(t => t.status === 'Overdue')?.id || 1,
            read: false
        },
        {
            id: 2,
            type: 'success',
            title: 'Task Approved',
            message: 'Catering menu finalized has been approved by Rahul',
            time: '5 hours ago',
            relatedTaskId: 2,
            read: false
        },
        {
            id: 3,
            type: 'info',
            title: 'New Assignment',
            message: 'You have been assigned to "Lighting Setup"',
            time: '1 day ago',
            relatedTaskId: 3,
            read: true
        }
    ];

    return (
        <>
            {/* Backdrop */}
            {showNotifications && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setShowNotifications(false)}
                />
            )}

            {/* Panel */}
            <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out border-l border-gray-100 ${showNotifications ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                        <div>
                            <h2 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-2">
                                <Bell className="text-primary-600" size={20} />
                                Notifications
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5">You have 2 unread messages</p>
                        </div>
                        <button
                            onClick={() => setShowNotifications(false)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                        {notifications.map(notif => (
                            <div
                                key={notif.id}
                                className={`p-4 rounded-xl border transition-all ${notif.read
                                    ? 'bg-white border-gray-100 opacity-75 hover:opacity-100'
                                    : 'bg-indigo-50/30 border-primary-100 shadow-sm'
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                                        notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                            'bg-blue-100 text-blue-600'
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
        </>
    );
};

export default NotificationsPanel;
