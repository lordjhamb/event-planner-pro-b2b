import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { User, Building, Phone, Mail, LogOut, Copy, Check } from 'lucide-react';

const Profile = ({ onLogout }) => {
    const { currentUser, logout } = useAuth();
    const [orgCode, setOrgCode] = useState(null);
    const [loadingCode, setLoadingCode] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchOrgCode = async () => {
            if (currentUser?.organizationId && (currentUser.role === 'owner' || currentUser.role === 'lead')) {
                setLoadingCode(true);
                try {
                    const { data, error } = await supabase
                        .from('organizations')
                        .select('code')
                        .eq('id', currentUser.organizationId)
                        .single();

                    if (!data?.code) {
                        // Generate and Save new code
                        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                        const { error: updateError } = await supabase
                            .from('organizations')
                            .update({ code: newCode })
                            .eq('id', currentUser.organizationId);

                        if (!updateError) {
                            setOrgCode(newCode);
                        }
                    } else {
                        setOrgCode(data.code);
                    }
                } catch (err) {
                    console.error("Failed to fetch/generate code:", err);
                } finally {
                    setLoadingCode(false);
                }
            }
        };

        fetchOrgCode();
    }, [currentUser]);

    const handleCopy = () => {
        if (orgCode) {
            navigator.clipboard.writeText(orgCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 font-heading">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Card */}
                <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-3xl mb-4">
                        {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{currentUser?.name}</h2>
                    <p className="text-gray-500 text-sm capitalize mb-6">{currentUser?.role}</p>

                    <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>

                {/* Details Section */}
                <div className="col-span-2 space-y-6">
                    {/* Organization Info (Owner Only) */}
                    {(currentUser?.role === 'owner' || currentUser?.role === 'lead') && (
                        <div className="bg-gradient-to-br from-primary-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                                <Building className="text-white/80" size={20} />
                                Organization Code
                            </h3>
                            <p className="text-primary-100 text-sm mb-4">Share this code to invite team members.</p>

                            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                                {loadingCode ? (
                                    <span className="text-sm font-mono opacity-50">Loading...</span>
                                ) : (
                                    <span className="font-mono text-2xl font-bold tracking-widest">{orgCode || (currentUser?.organizationId ? 'NO-CODE' : 'NO ORG')}</span>
                                )}
                                <div className="flex-1"></div>
                                <button onClick={handleCopy} className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Copy Code">
                                    {copied ? <Check size={20} className="text-green-300" /> : <Copy size={20} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Personal Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4 text-lg">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                <Mail className="text-gray-400" size={20} />
                                <div>
                                    <div className="text-xs text-gray-500 font-medium uppercase">Email Address</div>
                                    <div className="text-gray-900 font-medium">{currentUser?.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                <Phone className="text-gray-400" size={20} />
                                <div>
                                    <div className="text-xs text-gray-500 font-medium uppercase">Phone Number</div>
                                    <div className="text-gray-900 font-medium">{currentUser?.phone || 'Not set'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
