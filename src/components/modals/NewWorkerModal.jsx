import React from 'react';
import { X } from 'lucide-react';

const NewWorkerModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg">
                <div className="border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-lg font-bold">Add New Worker</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                </div>
                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Worker Name</label>
                        <input type="text" placeholder="e.g., Rahul Kumar" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input type="email" placeholder="worker@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <input type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                        <input type="text" placeholder="e.g., Setup, Lighting, AV" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                        <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option>Worker</option>
                            <option>Team Lead</option>
                        </select>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200">Cancel</button>
                        <button onClick={onClose} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">Add Worker</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewWorkerModal;
