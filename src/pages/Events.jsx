import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import EventCard from '../components/events/EventCard';
import WeddingCard from '../components/events/WeddingCard';

const Events = ({ onSelectEvent, onNewEvent, initialFilter = 'all' }) => {
    const { permissions } = useAuth();
    const { events, weddings, getWeddingEvents } = useData();
    const [filter, setFilter] = React.useState(initialFilter);

    // Filter Logic
    const isStatusMatch = (status) => {
        if (filter === 'all') return true;
        if (!status) return false;
        return status.toLowerCase() === filter;
    };

    // 1. Filter Weddings
    const filteredWeddings = weddings?.filter(w => isStatusMatch(w.status)) || [];

    // 2. Filter Standalone Events (!weddingId)
    const filteredStandaloneEvents = events.filter(e => {
        if (e.weddingId) return false; // Skip if part of a wedding
        return isStatusMatch(e.status);
    });

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'completed', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled' }
    ];

    // Counts for tabs (simplified, just counts total items regardless of type)
    const getCount = (tabId) => {
        if (tabId === 'all') return (weddings?.length || 0) + events.filter(e => !e.weddingId).length;
        const wCount = weddings?.filter(w => w.status?.toLowerCase() === tabId).length || 0;
        const eCount = events.filter(e => !e.weddingId && e.status?.toLowerCase() === tabId).length;
        return wCount + eCount;
    };

    return (
        <div className="space-y-6 pb-20 lg:pb-0 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-heading font-bold text-gray-900">Events</h2>
                {permissions.canCreateEvent && (
                    <button onClick={onNewEvent} className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition flex items-center gap-2">
                        <Plus size={20} /> New Event / Wedding
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
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
                            {getCount(tab.id)}
                        </span>
                    </button>
                ))}
            </div>

            <div className="space-y-8">
                {/* Weddings Section */}
                {filteredWeddings.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider pl-1">Weddings ({filteredWeddings.length})</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {filteredWeddings.map(wedding => (
                                <WeddingCard
                                    key={wedding.id}
                                    wedding={wedding}
                                    subEvents={getWeddingEvents(wedding.id)}
                                    onSelectEvent={onSelectEvent}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Standalone Section */}
                {filteredStandaloneEvents.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider pl-1">Single Events ({filteredStandaloneEvents.length})</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {filteredStandaloneEvents.map(event => (
                                <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event)} />
                            ))}
                        </div>
                    </div>
                )}

                {filteredWeddings.length === 0 && filteredStandaloneEvents.length === 0 && (
                    <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="text-4xl mb-4">📅</div>
                        <h3 className="font-heading font-bold text-gray-900 mb-2">No Events Found</h3>
                        <p className="text-gray-500 mb-6">There are no events matching your filter.</p>
                        <button onClick={onNewEvent} className="text-primary-600 font-bold hover:underline"> Create your first event</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
