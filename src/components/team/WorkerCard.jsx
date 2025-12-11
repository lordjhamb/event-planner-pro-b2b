import React from 'react';
import { Star, Phone, Mail } from 'lucide-react';

const WorkerCard = ({ worker, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${worker.available ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-xs text-gray-600">{worker.available ? 'Available' : 'Busy'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                    <Star className="text-yellow-500" size={14} fill="currentColor" />
                    <span className="text-sm font-semibold text-gray-900">{worker.performance}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
                {worker.skills.map((skill, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {skill}
                    </span>
                ))}
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} />
                    <span>{worker.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={14} />
                    <span className="truncate">{worker.email}</span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-xs text-gray-600">
                    <span className="font-semibold text-gray-900">{worker.tasksCount}</span> active tasks
                </div>
                <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-700">
                    Assign Task
                </button>
            </div>
        </div>
    );
};

export default WorkerCard;
