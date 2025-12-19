import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, UserCircle } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const success = await login(email, password);
        if (!success) {
            setError('Invalid credentials or sign-up needed.');
        }
        setLoading(false);
    };

    // Helper for quick login demos
    const quickLogin = async (roleEmail) => {
        // For demo purposes, we assume the password is 'password123' or generic 'password'
        // Ideally, in a real app, we wouldn't auto-fill this.
        setEmail(roleEmail);
        setPassword('password');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-primary-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Lock className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                    <p className="text-primary-100 mt-2 text-sm">Sign in to Event Planner Pro</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

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

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? 'Signing In...' : <span className="flex items-center gap-2">Sign In <ArrowRight size={20} /></span>}
                        </button>
                    </form>

                    {/* Quick Login for Demo */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs text-center text-gray-400 font-semibold uppercase tracking-wider mb-4">Demo Credentials (Click to Login)</p>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={() => quickLogin('owner@eventpro.com')} className="flex items-center gap-3 p-3 rounded-lg border border-purple-100 bg-purple-50/50 hover:bg-purple-100 transition-colors text-left group">
                                <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center shrink-0 text-xs font-bold">O</div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 group-hover:text-purple-700">Owner</div>
                                    <div className="text-xs text-gray-500">owner@eventpro.com</div>
                                </div>
                            </button>
                            <button onClick={() => quickLogin('lead@eventpro.com')} className="flex items-center gap-3 p-3 rounded-lg border border-blue-100 bg-blue-50/50 hover:bg-blue-100 transition-colors text-left group">
                                <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold">L</div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 group-hover:text-blue-700">Team Lead</div>
                                    <div className="text-xs text-gray-500">lead@eventpro.com</div>
                                </div>
                            </button>
                            <button onClick={() => quickLogin('worker@eventpro.com')} className="flex items-center gap-3 p-3 rounded-lg border border-green-100 bg-green-50/50 hover:bg-green-100 transition-colors text-left group">
                                <div className="w-8 h-8 rounded-full bg-green-200 text-green-700 flex items-center justify-center shrink-0 text-xs font-bold">W</div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900 group-hover:text-green-700">Worker</div>
                                    <div className="text-xs text-gray-500">worker@eventpro.com</div>
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
