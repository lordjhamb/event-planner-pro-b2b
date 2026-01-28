import React from 'react';
import { X, Mail, Phone, Star, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { createWhatsAppLink } from '../../utils/whatsapp';

const WorkerDetailModal = ({ worker, onClose, onSelectTask }) => {
    const { tasks } = useData();

    if (!worker) return null;

    const workerTasks = tasks.filter(t => t.assignee === worker.id);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-primary-600 to-indigo-700 p-8 text-white shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-primary-600 font-heading font-bold text-3xl shadow-lg">
                            {worker.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-heading font-bold mb-1">{worker.name}</h2>
                            <div className="flex items-center gap-3 text-indigo-100 text-sm font-medium">
                                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <Briefcase size={14} /> {worker.skills && worker.skills[0]}
                                </span>
                                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <Star size={14} fill="currentColor" className="text-yellow-400" /> {worker.performance}% Performance
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-8">
                    {/* Contact & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Info</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail size={16} className="text-primary-500" />
                                <span>{worker.contact}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone size={16} className="text-primary-500" />
                                <span>{worker.phone || 'No phone'}</span>
                            </div>
                            <a
                                href={createWhatsAppLink(worker.phone, `Hi ${worker.name}, `)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-200 hover:bg-green-100 transition-colors"
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-4 h-4" />
                                Chat on WhatsApp
                            </a>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Status</h3>
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${worker.available ? 'bg-green-500 shadow-sm shadow-green-300' : 'bg-red-500 shadow-sm shadow-red-300'}`} />
                                <span className={`font-bold ${worker.available ? 'text-green-700' : 'text-red-700'}`}>
                                    {worker.available ? 'Available for new tasks' : 'Currently Busy'}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                                {workerTasks.filter(t => t.status !== 'Approved').length} Active Tasks
                            </div>
                        </div>
                    </div>

                    {/* Assigned Tasks */}
                    <div>
                        <h3 className="text-lg font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-primary-600" />
                            Assigned Tasks
                        </h3>
                        {workerTasks.length > 0 ? (
                            <div className="space-y-3">
                                {workerTasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => onSelectTask && onSelectTask(task)}
                                        className="p-4 rounded-xl border border-gray-200 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer group bg-white"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{task.title}</h4>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${task.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                'bg-gray-50 text-gray-600 border-gray-100'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {task.dueDate}</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium">No tasks assigned yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDetailModal;
