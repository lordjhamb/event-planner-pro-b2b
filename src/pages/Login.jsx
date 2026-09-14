import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { Lock, Mail, ArrowRight, UserCircle, AlertTriangle } from 'lucide-react';

const Login = ({ onNavigateSignup }) => {
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState(''); // Email or Mobile
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Auth Flow: 'password' (email+password), 'otp_request' (send sms), 'otp_verify' (enter code)
    const [authMode, setAuthMode] = useState('password');

    const isMobile = (text) => /^[0-9+]+$/.test(text) && text.length > 9;

    const handleIdentifierChange = (e) => {
        const val = e.target.value;
        setIdentifier(val);
        // Switch mode based on input
        if (isMobile(val)) {
            if (authMode === 'password') setAuthMode('otp_request');
        } else {
            setAuthMode('password');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (authMode === 'password') {
                // Email + Password Login
                const { success, error: loginError } = await login(identifier, password);
                if (!success) setError(loginError || 'Invalid credentials.');
            }
            else if (authMode === 'otp_request') {
                // Step 1: Send OTP
                const { error } = await supabase.auth.signInWithOtp({ phone: identifier });
                if (error) throw error;
                setAuthMode('otp_verify'); // Move to step 2
            }
            else if (authMode === 'otp_verify') {
                // Step 2: Verify OTP
                const { error } = await supabase.auth.verifyOtp({ phone: identifier, token: otp, type: 'sms' });
                if (error) throw error;
                // Success: AuthContext will pick up session change automatically
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-primary-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <UserCircle className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                    <p className="text-primary-100 mt-2 text-sm">Sign in with Email or Mobile</p>
                </div>

                {/* Form */}
                <div className="p-8">
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {authMode !== 'otp_verify' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile Number</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={handleIdentifierChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                                        placeholder="user@example.com or 9876543210"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {authMode === 'password' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {authMode === 'otp_verify' && (
                            <div>
                                <div className="mb-4 text-center">
                                    <p className="text-sm text-gray-600">Enter the code sent to <span className="font-bold">{identifier}</span></p>
                                    <button type="button" onClick={() => setAuthMode('otp_request')} className="text-xs text-primary-600 hover:underline mt-1">Change Number</button>
                                </div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 font-mono tracking-widest text-center text-lg"
                                        placeholder="123456"
                                        maxLength={6}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? 'Processing...' : (
                                <span className="flex items-center gap-2">
                                    {authMode === 'password' ? 'Sign In' : authMode === 'otp_request' ? 'Send OTP' : 'Verify & Login'}
                                    <ArrowRight size={20} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <button
                                onClick={onNavigateSignup}
                                className="text-primary-600 font-bold hover:underline"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>

                    {/* Quick Login for Demo */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs text-center text-gray-400 font-semibold uppercase tracking-wider mb-4">Demo Credentials (Click to Login)</p>
                        <div className="grid grid-cols-1 gap-3">
                            {/* Owner */}
                            <button onClick={() => { setIdentifier('owner@eventpro.com'); setPassword('password'); setAuthMode('password'); }} className="flex items-center gap-3 p-3 rounded-lg border border-purple-100 bg-purple-50/50 hover:bg-purple-100 transition-colors text-left group">
                                <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center shrink-0 text-xs font-bold">O</div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 group-hover:text-purple-700">Owner</div>
                                    <div className="text-xs text-gray-500">owner@eventpro.com</div>
                                </div>
                            </button>

                            {/* Lead */}
                            <button onClick={() => { setIdentifier('jhambgautam19@gmail.com'); setPassword('asdfghjkl'); setAuthMode('password'); }} className="flex items-center gap-3 p-3 rounded-lg border border-blue-100 bg-blue-50/50 hover:bg-blue-100 transition-colors text-left group">
                                <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold">L</div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 group-hover:text-blue-700">Gautam Lead</div>
                                    <div className="text-xs text-gray-500">jhambgautam19@gmail.com</div>
                                </div>
                            </button>

                            {/* Worker */}
                            <button onClick={() => { setIdentifier('jhambgautam25@gmail.com'); setPassword('asdfghjkl'); setAuthMode('password'); }} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-colors text-left group">
                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 text-xs font-bold">W</div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 group-hover:text-gray-700">Gautam Worker</div>
                                    <div className="text-xs text-gray-500">jhambgautam25@gmail.com</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
