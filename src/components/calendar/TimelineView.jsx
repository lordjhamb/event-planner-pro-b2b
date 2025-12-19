import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const TimelineView = ({ currentDate, events }) => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    return (
        <div className="h-full bg-white flex flex-col overflow-hidden">
            {/* Header Timeline */}
            <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-hidden">
                <div className="w-48 shrink-0 p-3 border-r border-gray-200 font-bold text-gray-700 text-sm flex items-center bg-gray-50 z-10 sticky left-0">
                    Event / Project
                </div>
                <div className="flex flex-1 overflow-x-auto scrollbar-hide">
                    {days.map(day => (
                        <div key={day.toISOString()} className="w-10 shrink-0 text-center border-r border-gray-100 p-2">
                            <div className="text-[10px] text-gray-500 uppercase">{format(day, 'EE')[0]}</div>
                            <div className={`text-sm font-bold ${isSameDay(day, new Date()) ? 'text-primary-600' : 'text-gray-700'}`}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-y-auto">
                <div className="relative">
                    {events.map((event, idx) => (
                        <div key={event.id} className="flex border-b border-gray-100 items-center hover:bg-gray-50 transition-colors h-14">
                            <div className="w-48 shrink-0 px-4 font-medium text-sm text-gray-700 border-r border-gray-200 truncate bg-white sticky left-0 z-10 h-full flex items-center">
                                {event.name}
                            </div>
                            <div className="flex-1 relative h-full">
                                {/* Grid Lines Background */}
                                <div className="absolute inset-0 flex pointer-events-none">
                                    {days.map(day => (
                                        <div key={day.toISOString()} className="w-10 shrink-0 border-r border-gray-50 h-full"></div>
                                    ))}
                                </div>

                                {/* Mock Timeline Bar - randomly placed for demo since we only have single date events usually */}
                                <div
                                    className="absolute h-8 top-3 rounded-full bg-indigo-500 border-2 border-white shadow-sm flex items-center px-4 text-xs font-bold text-white whitespace-nowrap z-0 opacity-80 hover:opacity-100 hover:scale-[1.01] transition-all cursor-pointer"
                                    style={{
                                        left: `${(idx % 20) * 40 + 20}px`, // Mock offset
                                        width: `${(Math.random() * 5 + 3) * 40}px` // Mock duration
                                    }}
                                >
                                    {event.status === 'Active' ? 'Execution Phase' : 'Planning'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineView;
