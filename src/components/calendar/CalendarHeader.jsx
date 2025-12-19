import React from 'react';
import { ChevronLeft, ChevronRight, Calculator, Calendar as CalIcon, List, Clock, AlignLeft } from 'lucide-react';
import { format } from 'date-fns';

const CalendarHeader = ({ currentDate, view, setView, onNext, onPrev, onToday }) => {

    const getTitle = () => {
        if (view === 'month') return format(currentDate, 'MMMM yyyy');
        if (view === 'week') return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
        if (view === 'day') return format(currentDate, 'EEEE, MMMM d, yyyy');
        if (view === 'agenda') return 'Agenda';
        if (view === 'timeline') return 'Project Timeline';
        return '';
    };

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
            {/* Title & Nav */}
            <div className="flex items-center justify-between md:justify-start md:gap-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 min-w-[200px]">
                        {getTitle()}
                    </h1>
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                        <button onClick={onPrev} className="p-1 hover:bg-white rounded-md transition-all text-gray-600">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={onNext} className="p-1 hover:bg-white rounded-md transition-all text-gray-600">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <button onClick={onToday} className="text-sm font-medium text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100">
                        Today
                    </button>
                </div>
            </div>

            {/* View Switcher - Desktop */}
            <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-lg">
                <ViewButton active={view === 'month'} onClick={() => setView('month')} icon={CalIcon} label="Month" />
                <ViewButton active={view === 'week'} onClick={() => setView('week')} icon={Clock} label="Week" />
                <ViewButton active={view === 'day'} onClick={() => setView('day')} icon={AlignLeft} label="Day" />
                <ViewButton active={view === 'agenda'} onClick={() => setView('agenda')} icon={List} label="Agenda" />
                <ViewButton active={view === 'timeline'} onClick={() => setView('timeline')} icon={Calculator} label="Timeline" />
            </div>

            {/* View Switcher - Mobile (Dropdown or Scroll) */}
            <div className="flex md:hidden overflow-x-auto pb-2 scrollbar-hide gap-2">
                <MobileViewButton active={view === 'month'} onClick={() => setView('month')} label="Month" />
                <MobileViewButton active={view === 'week'} onClick={() => setView('week')} label="Week" />
                <MobileViewButton active={view === 'day'} onClick={() => setView('day')} label="Day" />
                <MobileViewButton active={view === 'agenda'} onClick={() => setView('agenda')} label="Agenda" />
                <MobileViewButton active={view === 'timeline'} onClick={() => setView('timeline')} label="Timeline" />
            </div>

            <div className="hidden md:block">
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    + New Event
                </button>
            </div>
        </div>
    );
};

const ViewButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${active ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
    >
        <Icon size={16} />
        {label}
    </button>
);

const MobileViewButton = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${active
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
    >
        {label}
    </button>
);

export default CalendarHeader;
