import React from 'react';
import { X, UserPlus, Mail, Phone, Briefcase } from 'lucide-react';

const NewWorkerModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
                <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900">Add Team Member</h2>
                        <p className="text-sm text-gray-500">Onboard new staff to your workforce</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name *</label>
                        <div className="relative">
                            <UserPlus className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="e.g., Jane Doe"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Primary Role *</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none">
                                <option>Select role...</option>
                                <option>Event Coordinator</option>
                                <option>Logistics Manager</option>
                                <option>Designer</option>
                                <option>Technical Specialist</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    placeholder="jane@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone *</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
                    >
                        Add Worker
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewWorkerModal;
