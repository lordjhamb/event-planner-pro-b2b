import React, { useState } from 'react';
import { ChevronDown, Check, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useData } from '../../context/DataContext';

const SubEventSwitcher = ({ weddingId, currentEventId, onEventChange, onBackToWedding }) => {
    const { getWeddingEvents, weddings } = useData();
    const [isOpen, setIsOpen] = useState(false);

    if (!weddingId) return null;

    const wedding = weddings.find(w => w.id.toString() === weddingId.toString());
    const siblings = getWeddingEvents(weddingId);
    const currentEvent = siblings.find(e => e.id.toString() === currentEventId.toString());

    if (!wedding || !currentEvent) return null;

    // Sort siblings by date/id to keep order
    const sortedSiblings = [...siblings].sort((a, b) => a.id - b.id); // Simple sort

    return (
        <div className="relative mb-6 z-20">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                Viewing Sub-Event
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full md:w-auto min-w-[300px] flex items-center justify-between bg-zinc-900 text-white p-3 rounded-xl shadow-lg hover:bg-zinc-800 transition-colors"
            >
                <div>
                    <div className="text-xs text-zinc-400 font-medium mb-0.5">{wedding.name}</div>
                    <div className="font-bold flex items-center gap-2">
                        {currentEvent.icon || (currentEvent.type === 'Mehndi' ? '🎨' : currentEvent.type === 'Sangeet' ? '🎵' : currentEvent.type === 'Haldi' ? '🌼' : currentEvent.type === 'Wedding' ? '💑' : '📅')}
                        {currentEvent.name}
                    </div>
                </div>
                <ChevronDown size={20} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full md:w-[350px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 bg-gray-50 border-b border-gray-100">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                if (onBackToWedding) onBackToWedding();
                            }}
                            className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all group text-left"
                        >
                            <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center">
                                <LayoutDashboard size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 text-sm group-hover:text-primary-700">Wedding Overview</div>
                                <div className="text-xs text-gray-500">View full progress & budget</div>
                            </div>
                            <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-primary-500" />
                        </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto py-2">
                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Sub-Events</div>
                        {sortedSiblings.map(event => {
                            const isCurrent = event.id.toString() === currentEventId.toString();
                            return (
                                <button
                                    key={event.id}
                                    onClick={() => {
                                        onEventChange(event);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${isCurrent ? 'bg-primary-50/50' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isCurrent ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {event.icon || (event.type === 'Mehndi' ? '🎨' : event.type === 'Sangeet' ? '🎵' : event.type === 'Haldi' ? '🌼' : event.type === 'Wedding' ? '💑' : '📅')}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-sm font-bold ${isCurrent ? 'text-primary-900' : 'text-gray-700'}`}>
                                            {event.name}
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                            <span>{event.dates}</span>
                                            {event.status === 'Completed' && <span className="text-green-600">✓ Done</span>}
                                        </div>
                                    </div>
                                    {isCurrent && <Check size={16} className="text-primary-600" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                        <div className="text-xs text-gray-400">Total {siblings.length} events</div>
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
};

export default SubEventSwitcher;
