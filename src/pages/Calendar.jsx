import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext'; // Usually needed for permissions, though maybe not strict for viewing
import CalendarHeader from '../components/calendar/CalendarHeader';
import MonthView from '../components/calendar/MonthView';
import WeekView from '../components/calendar/WeekView';
import DayView from '../components/calendar/DayView';
import AgendaView from '../components/calendar/AgendaView';
import TimelineView from '../components/calendar/TimelineView';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, isSameMonth, isSameDay } from 'date-fns';

const Calendar = () => {
    const { events, tasks, workers } = useData();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month'); // 'month', 'week', 'day', 'agenda', 'timeline'

    // Navigation Logic
    const next = () => {
        if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
        else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
        else if (view === 'day') setCurrentDate(addDays(currentDate, 1));
        else if (view === 'agenda') setCurrentDate(addDays(currentDate, 1)); // Agenda usually scrolls, but let's step by day or stick to today
        else if (view === 'timeline') setCurrentDate(addMonths(currentDate, 1));
    };

    const prev = () => {
        if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
        else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
        else if (view === 'day') setCurrentDate(subDays(currentDate, 1));
        else if (view === 'agenda') setCurrentDate(subDays(currentDate, 1));
        else if (view === 'timeline') setCurrentDate(subMonths(currentDate, 1));
    };

    const today = () => setCurrentDate(new Date());

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50/50">
            <CalendarHeader
                currentDate={currentDate}
                view={view}
                setView={setView}
                onNext={next}
                onPrev={prev}
                onToday={today}
            />

            <div className="flex-1 overflow-hidden relative">
                {view === 'month' && (
                    <MonthView
                        currentDate={currentDate}
                        events={events}
                        tasks={tasks}
                    />
                )}
                {view === 'week' && (
                    <WeekView
                        currentDate={currentDate}
                        events={events}
                        tasks={tasks}
                    />
                )}
                {view === 'day' && (
                    <DayView
                        currentDate={currentDate}
                        events={events}
                        tasks={tasks}
                        workers={workers}
                    />
                )}
                {view === 'agenda' && (
                    <AgendaView
                        currentDate={currentDate}
                        events={events}
                        tasks={tasks}
                    />
                )}
                {view === 'timeline' && (
                    <TimelineView
                        currentDate={currentDate}
                        events={events}
                    />
                )}
            </div>
        </div>
    );
};

export default Calendar;
