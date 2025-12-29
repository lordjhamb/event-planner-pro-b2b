import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const WeddingCard = ({ wedding, subEvents, onSelectEvent }) => {
    const { permissions } = useAuth();
    const [expanded, setExpanded] = useState(false);

    // Aggregates
    const totalBudget = subEvents.reduce((acc, e) => acc + (parseFloat(e.budget) || 0), 0);
    const totalSpent = subEvents.reduce((acc, e) => acc + (parseFloat(e.spent) || 0), 0);
    const avgProgress = subEvents.length > 0
        ? Math.round(subEvents.reduce((acc, e) => acc + (e.progress || 0), 0) / subEvents.length)
        : 0;

    const startDate = subEvents.length > 0 ? subEvents[0].dates : wedding.startDate;
    // Ideally calculate min/max date from subEvents if format allows, but for now use first event or wedding start

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
            {/* Header / Summary Card */}
            <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div
                        className="flex items-center gap-4 cursor-pointer flex-1"
                        onClick={() => onSelectEvent(wedding)}
                    >
                        <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                            💒
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-gray-900 text-lg hover:text-primary-600 transition-colors">{wedding.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="font-medium text-gray-700">{wedding.weddingType}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{wedding.startDate ? new Date(wedding.startDate).toLocaleDateString() : 'TBD'}</span>
                                </div>
                                <span>•</span>
                                <span>{subEvents.length} events</span>
                            </div>
                        </div>
                    </div>
                    {/* Expand Icon */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                {/* Progress & Budget Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                        <span>Progress: {avgProgress}%</span>
                        {permissions.canViewBudget && (
                            <span>₹{(totalSpent / 100000).toFixed(1)}L / ₹{(totalBudget / 100000).toFixed(1)}L</span>
                        )}
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                            style={{ width: `${avgProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Sub-Events List */}
            {expanded && (
                <div className="border-t border-gray-100 bg-gray-50/50">
                    {subEvents.map(event => (
                        <div
                            key={event.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectEvent(event);
                            }}
                            className="p-4 border-b border-gray-100 last:border-0 hover:bg-white transition-colors cursor-pointer flex items-center justify-between group pl-12 relative"
                        >
                            {/* Connected Line Visual */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 group-hover:bg-primary-200 group-first:top-1/2 group-last:bottom-1/2" />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white bg-gray-200 group-hover:bg-primary-500 shadow-sm z-10" />

                            <div>
                                <h4 className="font-bold text-gray-800 text-sm group-hover:text-primary-700">{event.name}</h4>
                                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                    <span>{event.dates}</span>
                                    {event.status === 'Completed' && <span className="text-green-600 font-bold">✓ Done</span>}
                                    {event.overdueTasks > 0 && <span className="text-red-500 font-bold">⚠ {event.overdueTasks} Overdue</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-xs font-bold text-gray-900">{event.progress}%</div>
                                    <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${event.progress}%` }} />
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-500" />
                            </div>
                        </div>
                    ))}
                    <div className="p-3 text-center border-t border-dashed border-gray-200">
                        <button className="text-xs font-bold text-primary-600 hover:text-primary-700 py-1 px-3 rounded-full hover:bg-primary-50 transition-colors">
                            + Add Another Event
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeddingCard;
