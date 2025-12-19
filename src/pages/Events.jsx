import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import EventCard from '../components/events/EventCard';

const Events = ({ onSelectEvent, onNewEvent, initialFilter = 'all' }) => {
    const { permissions } = useAuth();
    const { events } = useData();
    const [filter, setFilter] = React.useState(initialFilter);

    const filteredEvents = events.filter(e => {
        if (filter === 'all') return true;
        if (filter === 'active') return e.status === 'Active'; // Lowercase match for safety
        if (filter === 'completed') return e.status === 'Completed';
        if (filter === 'cancelled') return e.status === 'Cancelled';
        return e.status.toLowerCase() === filter.toLowerCase();
    });

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'completed', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled' }
    ];

    return (
        <div className="space-y-6 pb-20 lg:pb-0 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-heading font-bold text-gray-900">Events</h2>
                {permissions.canCreateEvent && (
                    <button onClick={onNewEvent} className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition flex items-center gap-2">
                        <Plus size={20} /> New Event
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === tab.id
                                ? 'bg-gray-900 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {tab.label}
                        <span className="ml-2 opacity-60 text-xs">
                            {tab.id === 'all' ? events.length : events.filter(e => e.status.toLowerCase() === tab.id).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event)} />
                ))}
            </div>
        </div>
    );
};

export default Events;
