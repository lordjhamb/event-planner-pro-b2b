import React from 'react';
import { format, isSameDay, addDays, startOfDay, isAfter, isBefore } from 'date-fns';
import { CheckSquare, Calendar, MoreHorizontal } from 'lucide-react';

const AgendaView = ({ currentDate, events, tasks }) => {
    // Generate next 14 days for agenda
    const daysStream = Array.from({ length: 14 }, (_, i) => addDays(startOfDay(currentDate), i));

    return (
        <div className="h-full bg-gray-50 flex flex-col overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full p-4 md:p-8 space-y-8">

                {daysStream.map((day, i) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
                    const dayTasks = tasks.filter(t => isSameDay(new Date(t.dueDate), day));

                    if (dayEvents.length === 0 && dayTasks.length === 0) return null; // Skip empty days or show simplified

                    return (
                        <div key={day.toISOString()} className="space-y-3 animation-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                            {/* Date Header */}
                            <div className="flex items-baseline gap-3 border-b border-gray-200 pb-2">
                                <h3 className={`text-lg font-bold ${i === 0 ? 'text-primary-600' : 'text-gray-900'}`}>
                                    {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(day, 'EEEE')}
                                </h3>
                                <span className="text-sm font-medium text-gray-400">{format(day, 'MMMM d, yyyy')}</span>
                            </div>

                            {/* Events */}
                            <div className="space-y-2">
                                {dayEvents.map(event => (
                                    <div key={event.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between group">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                                                <span className="text-xs font-bold uppercase">{format(day, 'MMM')}</span>
                                                <span className="text-lg font-bold leading-none">{format(day, 'd')}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{event.name}</h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-medium">{event.type || 'Event'}</span>
                                                    <span>• 6:00 PM - 10:00 PM</span>
                                                    {event.status === 'Active' && <span className="text-rose-500 font-semibold text-xs">• Live</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Tasks */}
                            <div className="space-y-2 pl-4 md:pl-16">
                                {dayTasks.map(task => (
                                    <div key={task.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 hover:bg-white px-2 rounded-lg transition-colors -mx-2">
                                        <div className="text-green-500 shrink-0"><CheckSquare size={16} /></div>
                                        <span className="text-sm font-medium text-gray-700 flex-1">{task.title}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                <div className="text-center py-8 text-gray-400 text-sm">
                    End of agenda for next 14 days
                </div>
            </div>
        </div>
    );
};

export default AgendaView;
