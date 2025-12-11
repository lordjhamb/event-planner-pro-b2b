import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import EventCard from '../components/events/EventCard';

const Events = ({ onSelectEvent, onNewEvent }) => {
    const { permissions } = useAuth();
    const { events } = useData();

    return (
        <div className="space-y-4 pb-20 lg:pb-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Events</h2>
                {permissions.canCreateEvent && (
                    <button onClick={onNewEvent} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700">
                        <Plus size={16} />New Event
                    </button>
                )}
            </div>
            <div className="space-y-3">
                {events.map(event => (
                    <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event)} />
                ))}
            </div>
        </div>
    );
};

export default Events;
