import React from 'react';
import { format, addHours, startOfDay } from 'date-fns';
import { Clock, CheckSquare, Sun, Users } from 'lucide-react';

const DayView = ({ currentDate, events, tasks, workers }) => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

    const todaysEvents = events.filter(e => e.status === 'Active'); // Just mock filter logic
    const todaysTasks = tasks.filter(t => t.status !== 'Completed');

    return (
        <div className="h-full bg-gray-50 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Daily Summary Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{format(currentDate, 'EEEE, MMMM d')}</h2>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1"><Sun size={16} className="text-amber-500" /> Clear, 22°C</div>
                            <div className="flex items-center gap-1"><Users size={16} /> {workers.length} Team Members</div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="text-2xl font-bold text-blue-600">{todaysEvents.length}</div>
                            <div className="text-xs font-semibold text-blue-700 uppercase">Events</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-green-50 rounded-xl border border-green-100">
                            <div className="text-2xl font-bold text-green-600">{todaysTasks.length}</div>
                            <div className="text-xs font-semibold text-green-700 uppercase">Tasks</div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Hourly Schedule */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-50 bg-gray-50/50 font-semibold text-gray-700">Schedule</div>
                        <div className="divide-y divide-gray-100">
                            {hours.map(hour => {
                                const timeLabel = format(addHours(startOfDay(currentDate), hour), 'h a');
                                return (
                                    <div key={hour} className="flex min-h-[80px] group hover:bg-gray-50 transition-colors">
                                        <div className="w-20 py-4 px-3 text-right text-xs font-medium text-gray-400 border-r border-gray-100 shrink-0">
                                            {timeLabel}
                                        </div>
                                        <div className="flex-1 p-2 relative">
                                            {/* Mock Event Item */}
                                            {hour === 18 && (
                                                <div className="bg-primary-50 border-l-4 border-primary-500 p-2 rounded-r-lg text-sm mb-1">
                                                    <div className="font-bold text-primary-900">Sharma-Patel Wedding</div>
                                                    <div className="text-xs text-primary-600">6:00 PM - 10:30 PM • Live</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Task List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
                        <div className="p-4 border-b border-gray-50 bg-gray-50/50 font-semibold text-gray-700 flex justify-between">
                            <span>Tasks Due</span>
                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">{todaysTasks.length}</span>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {todaysTasks.slice(0, 8).map(task => (
                                <div key={task.id} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${task.priority === 'High' ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-gray-300 text-transparent'
                                        }`}>
                                        <CheckSquare size={12} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 text-sm">{task.title}</div>
                                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                                            <span className="bg-gray-100 px-1.5 rounded">{task.priority}</span>
                                            <span>• {task.assignee ? 'Assigned' : 'Unassigned'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {todaysTasks.length === 0 && (
                                <div className="p-8 text-center text-gray-500 text-sm">No tasks due today.</div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DayView;
