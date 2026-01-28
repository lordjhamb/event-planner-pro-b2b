import React, { useState } from 'react';
import { X, UserPlus, Mail, Phone, Briefcase, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { sendInvitationEmail } from '../../services/emailService';

const NewWorkerModal = ({ isOpen, onClose }) => {
    const { currentUser, permissions } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [inviteMethod, setInviteMethod] = useState('');

    // Form State
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('worker');

    if (!isOpen) return null;

    const handleInvite = async () => {
        if (!mobile || mobile.length !== 10 || !fullName) {
            setError('Full Name and valid 10-digit Mobile Number are required.');
            return;
        }

        setLoading(true);
        setError('');

        const fullMobile = `+91${mobile}`;

        try {
            const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

            // 1. Create Invitation Record (for Email OR Mobile)
            // Even if only mobile, we track the token so they can redeem it.
            const { error: inviteError } = await supabase
                .from('invitations')
                .insert([{
                    email: email || null,
                    phone: fullMobile, // Ensure DB has this column, or we rely on token
                    role,
                    organization_id: currentUser.organizationId,
                    invited_by: currentUser.id,
                    token,
                    created_at: new Date().toISOString()
                }]);

            if (inviteError) throw inviteError;

            // 2. Always create a worker profile
            await supabase.from('workers').insert([{
                name: fullName,
                role: role === 'lead' ? 'Event Lead' : 'Staff',
                email: email || null,
                phone: fullMobile,
                available: false,
                skills: ['Pending Onboarding'],
                joinDate: new Date().toISOString()
            }]);

            // 3. WhatsApp Integration
            const inviteLink = `${window.location.origin}/join?token=${token}`;
            const message = encodeURIComponent(`Hello ${fullName}, you have been invited to join the team at ${currentUser.organizationId || 'Event Planner Pro'}. Click here to accept: ${inviteLink}`);
            const whatsappUrl = `https://wa.me/91${mobile}?text=${message}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setEmail('');
                setMobile('');
                setFullName('');
            }, 2000);

        } catch (err) {
            console.error("Operation failed:", err);
            setError(err.message || 'Failed to add team member.');
        } finally {
            setLoading(false);
        }
    };

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
                    {success ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3">
                            <Send size={20} />
                            <div>
                                <span className="font-bold">Member Added!</span>
                                <p className="text-sm">Invitation sent via {inviteMethod}.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name *</label>
                                <div className="relative">
                                    <UserPlus className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="e.g., Alex Johnson"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                <div className="relative flex">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium flex items-center gap-2 border-r border-gray-300 pr-2">
                                        <Phone size={18} />
                                        <span>+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="98765 43210"
                                        value={mobile}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 10) setMobile(val);
                                        }}
                                        className="w-full pl-24 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email (Optional)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="alex@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Role *</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none"
                                    >
                                        <option value="worker">Worker (Standard Access)</option>
                                        {permissions.isOwner && <option value="lead">Team Lead (Can Manage Events)</option>}
                                    </select>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 ml-1">
                                    {role === 'worker' ? 'Can view assigned tasks and chat.' : 'Can create events, budgets, and invite others.'}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {!success && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInvite}
                            disabled={loading}
                            className={`flex-1 py-3 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? 'Processing...' : <><UserPlus size={18} /> Add Member</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewWorkerModal;
