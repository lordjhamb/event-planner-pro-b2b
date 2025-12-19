import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EventCard = ({ event, onClick }) => {
    const { permissions } = useAuth();

    // Status Badge Logic
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-50 text-green-700 border-green-100';
            case 'Draft': return 'bg-gray-50 text-gray-700 border-gray-100';
            case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-card hover:shadow-card-hover hover:border-primary-100 transition-all duration-300 cursor-pointer relative overflow-hidden h-full flex flex-col"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-lg shadow-inner">
                        {event.icon || '📅'}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-heading font-bold text-gray-900 text-base leading-tight group-hover:text-primary-600 transition-colors truncate">
                            {event.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium truncate">{event.client}</p>
                    </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${getStatusStyle(event.status)}`}>
                        {event.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-auto">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Calendar size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{event.dates}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                </div>
            </div>

            <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                    <span>Progress</span>
                    <span className="text-primary-700">{event.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="bg-primary-600 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${event.progress}%` }}
                    />
                </div>
            </div>

            {permissions.canViewBudget && (
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Budget</span>
                    <span className="font-bold text-gray-900">
                        ₹{(event.spent / 100000).toFixed(1)}L <span className="text-gray-400 font-normal">/ {(event.budget / 100000).toFixed(0)}L</span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default EventCard;
