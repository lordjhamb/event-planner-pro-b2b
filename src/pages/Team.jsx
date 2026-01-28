import React, { useState } from 'react';
import { Search, Plus, Users, Calendar, BarChart3, Star, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import WorkerCard from '../components/team/WorkerCard';
import EditWorkerModal from '../components/modals/EditWorkerModal';

const Team = ({ onSelectWorker, onNewWorker }) => {
    const { permissions } = useAuth();
    const { workers } = useData();
    const [activeView, setActiveView] = useState('workforce'); // 'workforce' or 'stats'
    const [searchTerm, setSearchTerm] = useState('');
    const [editingWorker, setEditingWorker] = useState(null);

    const filteredWorkers = workers.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getRoleSymbol = (role) => {
        const r = (role || 'worker').toLowerCase();
        if (r === 'owner') return { char: 'O', bg: 'bg-purple-100', text: 'text-purple-700', label: 'Owner' };
        if (r === 'lead') return { char: 'L', bg: 'bg-blue-100', text: 'text-blue-700', label: 'Team Lead' };
        return { char: 'W', bg: 'bg-gray-100', text: 'text-gray-600', label: 'Worker' };
    };

    return (
        <div className="space-y-6 pb-20 lg:pb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-gray-900">Team Management</h2>
                    <p className="text-gray-500">Manage your workforce and view performance stats</p>
                </div>
                {permissions.canManageWorkforce && (
                    <button onClick={onNewWorker} className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5">
                        <Plus size={18} /> Add Worker
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-white rounded-xl border border-gray-200 w-fit">
                <button
                    onClick={() => setActiveView('workforce')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'workforce'
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <Users size={16} />
                    Workforce Directory
                </button>
                <button
                    onClick={() => setActiveView('stats')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'stats'
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <BarChart3 size={16} />
                    Workload & Stats
                </button>
            </div>

            {activeView === 'workforce' ? (
                <>
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWorkers.map(worker => (
                            <WorkerCard key={worker.id} worker={worker} onClick={() => onSelectWorker(worker)} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Team Member</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Load</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Performance</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {workers.map(worker => {
                                    const roleStyle = getRoleSymbol(worker.role);
                                    return (
                                        <tr key={worker.id} className="hover:bg-primary-50/30 transition-colors cursor-pointer group" onClick={() => onSelectWorker(worker)}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center text-primary-700 font-bold text-xs group-hover:scale-110 transition-transform">
                                                        {(worker.name || 'U').split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{worker.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${roleStyle.bg} ${roleStyle.text}`}
                                                    title={roleStyle.label}
                                                >
                                                    {roleStyle.char}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${worker.tasksCount > 5 ? 'bg-red-500' : 'bg-green-500'}`}
                                                            style={{ width: `${(worker.tasksCount / 10) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-600">{worker.tasksCount || 0} tasks</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                                                    <span className="text-sm font-bold text-gray-900">{worker.performance || 0}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${worker.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {worker.available ? 'Available' : 'Busy'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingWorker(worker);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <EditWorkerModal
                worker={editingWorker}
                isOpen={!!editingWorker}
                onClose={() => setEditingWorker(null)}
            />
        </div>
    );
};

export default Team;
