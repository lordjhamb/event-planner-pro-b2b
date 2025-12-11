import React, { useState } from 'react';
import { Search, Plus, Users, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import WorkerCard from '../components/team/WorkerCard';

const Team = ({ onSelectWorker, onNewWorker }) => {
    const { permissions } = useAuth();
    const { workers } = useData();
    const { events } = useData();
    const [activeView, setActiveView] = useState('workforce'); // 'workforce' or 'stats'
    const [searchTerm, setSearchTerm] = useState('');

    const filteredWorkers = workers.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-4 pb-20 lg:pb-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Team Management</h2>
                {permissions.canManageWorkforce && (
                    <button onClick={onNewWorker} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700">
                        <Plus size={16} />Add Worker
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveView('workforce')}
                    className={`pb-2 px-1 font-medium text-sm flex items-center gap-2 ${activeView === 'workforce'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Users size={16} />
                    Workforce Directory
                </button>
                <button
                    onClick={() => setActiveView('stats')}
                    className={`pb-2 px-1 font-medium text-sm flex items-center gap-2 ${activeView === 'stats'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <BarChart3 size={16} />
                    Workload & Stats
                </button>
            </div>

            {activeView === 'workforce' ? (
                <>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredWorkers.map(worker => (
                            <WorkerCard key={worker.id} worker={worker} onClick={() => onSelectWorker(worker)} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Team Member</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Role</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Current Load</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Performance</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {workers.map(worker => (
                                    <tr key={worker.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onSelectWorker(worker)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                    {worker.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-medium text-gray-900">{worker.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {worker.skills[0]}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${worker.tasksCount > 5 ? 'bg-red-500' : 'bg-green-500'}`}
                                                        style={{ width: `${(worker.tasksCount / 10) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-600">{worker.tasksCount} tasks</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-semibold">{worker.performance}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${worker.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {worker.available ? 'Available' : 'Busy'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Team;
