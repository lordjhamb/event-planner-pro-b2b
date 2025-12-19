import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addHours, startOfDay, isSameDay } from 'date-fns';

const WeekView = ({ currentDate, events, tasks }) => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start, end });
    const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM

    // Helper to position events
    const getEventStyle = (event, day) => {
        // Simplified positioning: check if event matches day
        // Ideally, calculate top% based on start time and height% based on duration
        // For MVP, just block display
        return {};
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            {/* Header: Days */}
            <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50 flex-none">
                <div className="p-3 border-r border-gray-200 w-16 md:w-20"></div> {/* Time Col */}
                {days.map(day => (
                    <div key={day.toISOString()} className="p-2 text-center border-r border-gray-100 last:border-r-0">
                        <div className="text-xs text-gray-500 uppercase font-semibold">{format(day, 'EEE')}</div>
                        <div className={`text-sm md:text-xl font-bold mt-1 ${isSameDay(day, new Date()) ? 'text-primary-600' : 'text-gray-900'}`}>
                            {format(day, 'd')}
                        </div>
                    </div>
                ))}
            </div>

            {/* Time Grid */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-8 relative min-w-[600px] md:min-w-0">
                    {/* Time Column */}
                    <div className="border-r border-gray-200 bg-gray-50/50">
                        {hours.map(hour => (
                            <div key={hour} className="h-20 border-b border-gray-100 relative">
                                <span className="absolute -top-2 right-2 text-xs text-gray-400 font-medium">
                                    {format(addHours(startOfDay(new Date()), hour), 'h a')}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Day Columns */}
                    {days.map(day => (
                        <div key={day.toISOString()} className="border-r border-gray-100 relative">
                            {hours.map(hour => (
                                <div key={hour} className="h-20 border-b border-gray-100 hover:bg-gray-50 transition-colors"></div>
                            ))}

                            {/* Mock Events Overlay */}
                            {events.filter(e => isSameDay(new Date(e.date), day)).map((event, idx) => (
                                <div
                                    key={event.id}
                                    className="absolute left-1 right-1 rounded-md p-2 text-xs font-semibold shadow-sm border bg-blue-100 border-blue-200 text-blue-700 overflow-hidden"
                                    style={{
                                        top: `${(9 + idx * 2) * 80 + 10}px`, // Mock position: 9am + offset
                                        height: '70px'
                                    }}
                                >
                                    {event.name}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeekView;
