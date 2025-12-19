import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Clock, CheckSquare } from 'lucide-react';

const MonthView = ({ currentDate, events, tasks }) => {
    // Generate dates for the grid (including padding days from prev/next months)
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    const days = [];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    // Helper to get items for a specific date
    const getItemsForDate = (date) => {
        const dayEvents = events.filter(e => isSameDay(new Date(e.date), date));
        const dayTasks = tasks.filter(t => isSameDay(new Date(t.dueDate), date) && t.status !== 'Completed');
        return { dayEvents, dayTasks };
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Day Labels Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                {dayLabels.map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
                {dateRange.map((day, i) => {
                    const { dayEvents, dayTasks } = getItemsForDate(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isDayToday = isToday(day);

                    return (
                        <div
                            key={day.toISOString()}
                            className={`
                                border-b border-r border-gray-100 p-1 md:p-2 min-h-[80px] md:min-h-[120px] flex flex-col gap-1 transition-colors hover:bg-gray-50/50
                                ${!isCurrentMonth ? 'bg-gray-50/30 text-gray-400' : 'bg-white'}
                            `}
                        >
                            {/* Date Number */}
                            <div className="flex justify-between items-start">
                                <span
                                    className={`
                                        text-xs md:text-sm font-medium w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full
                                        ${isDayToday ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-700'}
                                    `}
                                >
                                    {format(day, dateFormat)}
                                </span>
                                {dayTasks.length > 0 && (
                                    <div className="hidden md:flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md">
                                        <CheckSquare size={10} /> {dayTasks.length}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Dot Indicators */}
                            <div className="flex md:hidden gap-1 mt-1 justify-center">
                                {dayEvents.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                                {dayTasks.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                            </div>

                            {/* Desktop Items List */}
                            <div className="hidden md:flex flex-col gap-1 mt-1 overflow-y-auto scrollbar-hide">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className="text-[10px] md:text-xs truncate px-1.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 font-medium cursor-pointer hover:bg-blue-100"
                                    >
                                        {event.status === 'Active' && <span className="mr-1 text-red-500 animate-pulse">●</span>}
                                        {event.name}
                                    </div>
                                ))}
                                {dayTasks.length > 0 && dayTasks.slice(0, 2).map(task => (
                                    <div key={task.id} className="text-[10px] truncate px-1 py-0.5 text-gray-500 flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-green-500 shrink-0"></div>
                                        {task.title}
                                    </div>
                                ))}
                                {dayTasks.length > 2 && (
                                    <div className="text-[10px] text-gray-400 pl-2">
                                        + {dayTasks.length - 2} more tasks
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Agenda Below Calendar (Per Requirement) */}
            <div className="md:hidden p-4 bg-white border-t border-gray-100 h-[200px] overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-5 bg-primary-600 rounded-full"></span>
                    Selected Date Agenda
                </h3>
                <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500 text-center">Tap a date to see details</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthView;
