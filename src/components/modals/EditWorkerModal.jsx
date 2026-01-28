import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Trash2, Save, AlertCircle, Phone, Mail } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';

const EditWorkerModal = ({ worker, isOpen, onClose, onUpdate }) => {
    const { permissions } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        role: 'worker',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (worker) {
            setFormData({
                name: worker.name || '',
                role: worker.role?.toLowerCase() === 'owner' ? 'owner' :
                    worker.role?.toLowerCase() === 'lead' ? 'lead' : 'worker',
                email: worker.email || '',
                phone: worker.phone ? worker.phone.replace('+91', '') : ''
            });
        }
    }, [worker]);

    if (!isOpen || !worker) return null;

    const handleSave = async () => {
        setLoading(true);
        setError('');

        try {
            const updates = {
                name: formData.name,
                role: formData.role, // 'owner', 'lead', or 'worker'
                email: formData.email,
                phone: formData.phone ? `+91${formData.phone}` : null
            };

            const { error: updateError } = await supabase
                .from('workers')
                .update(updates)
                .eq('id', worker.id);

            if (updateError) throw updateError;

            // Optional: Try to update linked profile if exists
            if (worker.profile_id) {
                await supabase
                    .from('profiles')
                    .update({
                        full_name: formData.name,
                        role: formData.role,
                        phone: updates.phone
                    })
                    .eq('id', worker.profile_id);
            }

            if (onUpdate) onUpdate(); // Refresh parent data
            onClose();
        } catch (err) {
            console.error("Update failed:", err);
            setError("Failed to update worker.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to remove this member? This cannot be undone.")) return;

        setLoading(true);
        try {
            const { error: deleteError } = await supabase
                .from('workers')
                .delete()
                .eq('id', worker.id);

            if (deleteError) throw deleteError;

            if (onUpdate) onUpdate();
            onClose();
        } catch (err) {
            console.error("Delete failed:", err);
            setError("Failed to delete worker.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
                <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900">Edit Member</h2>
                        <p className="text-sm text-gray-500">Update details or manage access</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                disabled={!permissions.isOwner && formData.role === 'owner'} // Prevent non-owners from messing with owner role
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none"
                            >
                                <option value="worker">Worker</option>
                                <option value="lead">Team Lead</option>
                                <option value="owner">Owner</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    placeholder="9876543210"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center gap-4">
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={16} /> Delete
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 rounded-lg font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2"
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditWorkerModal;
