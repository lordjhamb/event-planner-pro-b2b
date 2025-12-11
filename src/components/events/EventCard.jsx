import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EventCard = ({ event, onClick, tasks = [] }) => {
    const { permissions } = useAuth();

    return (
        <div onClick={onClick} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                    <p className="text-sm text-gray-600">{event.client}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${event.status === 'Active' ? 'bg-green-100 text-green-700' : event.status === 'Draft' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                        {event.status}
                    </span>
                    {event.overdueTasks > 0 && (
                        <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                            {event.overdueTasks} Overdue
                        </span>
                    )}
                </div>
            </div>
            <div className="space-y-2 mb-3">
                <div className="flex items-center text-sm text-gray-600 gap-2">
                    <Calendar size={14} /><span>{event.dates}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-2">
                    <MapPin size={14} /><span>{event.location}</span>
                </div>
            </div>
            <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span className="font-semibold">{event.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${event.progress}%` }} />
                </div>
            </div>
            {permissions.canViewBudget && (
                <div className="mt-3 flex items-center justify-between text-xs border-t border-gray-100 pt-2">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-semibold">₹{(event.spent / 100000).toFixed(1)}L / ₹{(event.budget / 100000).toFixed(1)}L</span>
                </div>
            )}
        </div>
    );
};

export default EventCard;
