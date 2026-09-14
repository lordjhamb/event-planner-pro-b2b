import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { Lock, Mail, User, Building, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

const Signup = ({ onNavigateLogin }) => {
    const { login } = useAuth();
    const [mode, setMode] = useState('join'); // 'join' or 'create'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form Data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState(''); // New Mobile State
    const [orgCode, setOrgCode] = useState('');
    const [orgName, setOrgName] = useState('');

    const generateOrgCode = () => {
        // Generate a random 6-character alphanumeric code
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate Mobile
            if (!mobile || mobile.length !== 10) {
                throw new Error("Please enter a valid 10-digit mobile number.");
            }

            let targetOrgId = null;
            let role = 'worker';

            // 1. Validate / Create Organization
            if (mode === 'join') {
                if (!orgCode) throw new Error("Organization Code is required.");

                // Find Org by Code
                const { data: orgData, error: orgError } = await supabase
                    .from('organizations')
                    .select('id, name')
                    .eq('code', orgCode.trim().toUpperCase())
                    .single();

                if (orgError || !orgData) throw new Error("Invalid Organization Code. Please check and try again.");
                targetOrgId = orgData.id;
                role = 'worker'; // Default joiner role
            } else {
                // Create New Org
                if (!orgName) throw new Error("Organization Name is required.");

                const newCode = generateOrgCode();
                const { data: newOrg, error: createError } = await supabase
                    .from('organizations')
                    .insert([{ name: orgName, plan: 'free', code: newCode }])
                    .select()
                    .single();

                if (createError) throw new Error("Failed to create organization: " + createError.message);
                targetOrgId = newOrg.id;
                role = 'owner'; // Creator is owner
            }

            // 2. Create Auth User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        phone: `+91${mobile}`,
                        full_name: fullName
                    }
                }
            });

            if (authError) throw authError;

            // 3. Create Profile linked to Org
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: authData.user.id,
                        email: email,
                        phone: `+91${mobile}`, // Save with prefix
                        full_name: fullName,
                        role: role,
                        organization_id: targetOrgId
                    }]);

                if (profileError) {
                    console.error("Profile creation failed, cleanup might be needed:", profileError);
                    // In a real app we might delete the auth user here to roll back
                    throw profileError;
                }

                // 4. Create Worker Entry (So they appear in Team Roster)
                const { error: workerError } = await supabase
                    .from('workers')
                    .insert([{
                        organization_id: targetOrgId,
                        profile_id: authData.user.id, // Linking Auth User to Worker
                        name: fullName,
                        role: role === 'owner' ? 'Owner' : 'Team Member', // Default display role
                        email: email,
                        phone: `+91${mobile}`,
                        "joinDate": new Date().toISOString().split('T')[0],
                        available: true,
                        skills: []
                    }]);

                if (workerError) {
                    console.error("Worker creation failed:", workerError);
                    // Non-critical, can be fixed manually or by a trigger, but good to log
                }
            }

            // 5. Auto-Login
            await login(email, password);

        } catch (err) {
            console.error("Signup Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8">
                    <button onClick={onNavigateLogin} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium transition-colors">
                        <ArrowLeft size={16} /> Back to Login
                    </button>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500 text-sm mb-6">Join your team or start a new workspace.</p>

                    {!isSupabaseConfigured && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                            <div className="flex items-center gap-2 font-semibold text-amber-900 mb-1">
                                <AlertTriangle size={16} className="text-amber-600" />
                                <span>Supabase Configuration Missing</span>
                            </div>
                            <p className="text-amber-700 leading-relaxed">
                                Please add <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in your Vercel Project Settings &gt; Environment Variables, then redeploy.
                            </p>
                        </div>
                    )}

                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setMode('join')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'join' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Join Existing
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('create')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'create' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Create New
                        </button>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Identify details */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="John Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 top-2.5 text-gray-500 font-bold text-sm pointer-events-none z-10 select-none">
                                    +91
                                </div>
                                <input
                                    type="text"
                                    maxLength={10}
                                    value={mobile}
                                    onChange={(e) => {
                                        const re = /^[0-9\b]+$/;
                                        if (e.target.value === '' || re.test(e.target.value)) {
                                            setMobile(e.target.value);
                                        }
                                    }}
                                    className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none font-mono tracking-widest text-base"
                                    placeholder="9876543210"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-4 pt-4">
                            {mode === 'join' ? (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Organization Code</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                        <input
                                            required
                                            type="text"
                                            value={orgCode}
                                            onChange={e => setOrgCode(e.target.value.toUpperCase())}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none font-mono tracking-wider uppercase"
                                            placeholder="e.g. AB12CD"
                                            maxLength={8}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Ask your admin for the invitation code.</p>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Organization Name</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                        <input
                                            required
                                            type="text"
                                            value={orgName}
                                            onChange={e => setOrgName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                                            placeholder="My Event Company"
                                        />
                                    </div>
                                    <div className="mt-3 bg-purple-50 text-purple-700 p-3 rounded-lg text-xs flex items-start gap-2">
                                        <CheckCircle size={14} className="mt-0.5" />
                                        <span>You'll be the <strong>Owner</strong> of this new workspace. You can invite others later.</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    {mode === 'join' ? 'Join Organization' : 'Create Organization'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
