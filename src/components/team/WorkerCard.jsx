import React from 'react';
import { Star, Phone, Mail } from 'lucide-react';

const WorkerCard = ({ worker, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-card-hover hover:border-primary-100 transition-all duration-300 cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner group-hover:scale-110 transition-transform">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{worker.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${worker.available ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-xs font-medium text-gray-500">{worker.available ? 'Available' : 'Busy'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <Star className="text-yellow-500" size={14} fill="currentColor" />
                    <span className="text-xs font-bold text-gray-900">{worker.performance}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {worker.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-[10px] font-semibold bg-primary-50 text-primary-700 px-2 py-1 rounded-md">
                        {skill}
                    </span>
                ))}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={14} className="text-gray-400" />
                    <span>{worker.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail size={14} className="text-gray-400" />
                    <span className="truncate">{worker.email}</span>
                </div>
            </div>

            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                    <span className="font-bold text-gray-900">{worker.tasksCount}</span> tasks active
                </div>
                <button className="text-xs font-bold text-primary-600 hover:text-primary-700">
                    View Profile →
                </button>
            </div>
        </div>
    );
};

export default WorkerCard;
