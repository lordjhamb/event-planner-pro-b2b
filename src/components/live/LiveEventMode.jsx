import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Activity, AlertTriangle, ArrowLeft, MessageSquare, Calendar, ChevronRight, X, Phone, ShieldAlert, Camera, Check } from 'lucide-react';
import ChatInterface from '../chat/ChatInterface';
import { useData } from '../../context/DataContext';

const LiveEventMode = ({ event, onClose }) => {
    const { tasks, workers, updateTaskStatus } = useData();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState('timeline'); // Default to timeline
    const [showEmergency, setShowEmergency] = useState(false);

    // Live Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    if (!event) return null;

    // Derived Data
    const eventTasks = tasks.filter(t => t.eventId === event.id).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const totalTasks = eventTasks.length;
    const completedTasks = eventTasks.filter(t => t.status === 'Approved' || t.status === 'Submitted').length;
    const progress = Math.round((completedTasks / totalTasks) * 100) || 0;

    // Determine Current Phase
    const now = new Date(); // In real app, use live time. For mock, we might need to simulate.
    // For demo purposes, let's assume "Now" matches one of the tasks

    const activeTasks = eventTasks.filter(t => t.status === 'In Progress');

    return (
        <div className="fixed inset-0 bg-slate-900 z-[60] text-white flex flex-col animate-fade-in overflow-hidden">
            {/* Top Bar */}
            <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="md:hidden">
                        <button onClick={onClose} className="text-slate-400 hover:text-white">
                            <ArrowLeft />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                        <h1 className="font-heading font-bold text-xl tracking-tight">LIVE MODE <span className="text-slate-500 mx-2">|</span> {event.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <div className="text-2xl font-mono font-bold leading-none">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Event Day</div>
                    </div>
                    <button
                        onClick={() => setShowEmergency(true)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all animate-pulse"
                    >
                        <ShieldAlert size={18} />
                        <span className="hidden md:inline">SOS</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="hidden md:flex bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Exit Mode
                    </button>
                </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="lg:hidden bg-slate-800 border-b border-slate-700 flex">
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'stats' ? 'border-primary-500 text-white' : 'border-transparent text-slate-400'}`}
                >
                    Stats
                </button>
                <button
                    onClick={() => setActiveTab('timeline')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-primary-500 text-white' : 'border-transparent text-slate-400'}`}
                >
                    Timeline
                </button>
                <button
                    onClick={() => setActiveTab('feed')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'feed' ? 'border-primary-500 text-white' : 'border-transparent text-slate-400'}`}
                >
                    Live Feed
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* LEFT: Stats & status */}
                <div className={`${activeTab === 'stats' ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 bg-slate-800/50 border-r border-slate-700 flex-col p-6 gap-6 overflow-y-auto absolute lg:relative inset-0 z-20`}>
                    {/* Progress Card */}
                    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Overall Progress</div>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-bold text-white">{progress}%</span>
                            <span className="text-slate-400 mb-1">completed</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden mb-4">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-700">
                                <div className="text-slate-400 text-xs mb-1">Tasks Done</div>
                                <div className="font-bold text-white text-lg">{completedTasks}/{totalTasks}</div>
                            </div>
                            <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-700">
                                <div className="text-slate-400 text-xs mb-1">Active Now</div>
                                <div className="font-bold text-emerald-400 text-lg">{activeTasks.length}</div>
                            </div>
                        </div>
                    </div>

                    {/* Active Team */}
                    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Team Status</div>
                        <div className="space-y-3">
                            {workers.slice(0, 5).map(worker => (
                                <div key={worker.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                                                {worker.name.charAt(0)}
                                            </div>
                                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-800 ${worker.available ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-200">{worker.name}</div>
                                            <div className="text-[10px] text-slate-500">{worker.role}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        {Math.floor(Math.random() * 60)}m ago
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CENTER: Timeline */}
                <div className={`${activeTab === 'timeline' ? 'block' : 'hidden'} lg:block flex-1 bg-slate-900 overflow-y-auto custom-scrollbar p-6 absolute lg:relative inset-0 z-10`}>
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Calendar className="text-primary-400" /> Event Timeline
                        </h2>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:w-0.5 before:bg-slate-800">
                            {eventTasks.map((task, index) => {
                                const isDone = task.status === 'Approved' || task.status === 'Submitted';
                                const isActive = task.status === 'In Progress';

                                return (
                                    <div key={task.id} className={`relative pl-8 transition-all ${isActive ? 'scale-100 opacity-100' : 'opacity-80 hover:opacity-100'}`}>
                                        {/* Status Dot */}
                                        <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 bg-slate-900 transition-colors
                                            ${isDone ? 'border-emerald-500 text-emerald-500' :
                                                isActive ? 'border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' :
                                                    'border-slate-600 text-slate-600'}`}>
                                            {isDone && <Check size={12} strokeWidth={3} />}
                                            {isActive && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                                        </div>

                                        <div className={`p-4 rounded-xl border transition-all
                                            ${isActive ? 'bg-slate-800/80 border-blue-500/50 shadow-lg' :
                                                isDone ? 'bg-slate-800/30 border-slate-700/50' :
                                                    'bg-slate-800/30 border-slate-700'}`}>

                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-mono text-xs font-bold text-slate-400 mb-1 flex items-center gap-2">
                                                        <Clock size={12} /> {task.dueDate}
                                                        {isActive && <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px]">ACTIVE</span>}
                                                    </div>
                                                    <h3 className={`font-bold text-lg ${isDone ? 'text-slate-400 line-through' : 'text-white'}`}>{task.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {workers.find(w => w.id === task.assignee) && (
                                                        <div className="flex items-center gap-2 bg-slate-900/50 px-2 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
                                                            <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[8px] font-bold">
                                                                {workers.find(w => w.id === task.assignee).name.charAt(0)}
                                                            </div>
                                                            <span className="hidden sm:inline">{workers.find(w => w.id === task.assignee).name.split(' ')[0]}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {!isDone && (
                                                <div className="flex gap-2 mt-4">
                                                    {isActive ? (
                                                        <button
                                                            onClick={() => updateTaskStatus(task.id, 'Submitted')}
                                                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <CheckCircle size={16} /> Mark Done
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => updateTaskStatus(task.id, 'In Progress')}
                                                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-lg text-sm font-bold transition-colors border border-slate-600"
                                                        >
                                                            Start Task
                                                        </button>
                                                    )}
                                                    <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 border border-slate-600">
                                                        <Camera size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Live Feed */}
                <div className={`${activeTab === 'feed' ? 'flex' : 'hidden'} lg:flex w-full lg:w-96 bg-white border-l border-slate-700 flex-col absolute lg:relative inset-0 z-20`}>
                    <div className="p-4 bg-white border-b border-gray-100">
                        <h3 className="font-heading font-bold text-gray-900">Live Comms</h3>
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <ChatInterface
                            height="h-full"
                            messages={[
                                { id: 1, senderId: 'group', text: "Start lighting setup!", timestamp: '10:00 AM', isSystem: false }
                            ]}
                            onSendMessage={() => { }} // Hook this up properly later
                            currentUser="me"
                            users={workers}
                            activeChatId="group"
                        />
                    </div>
                </div>
            </div>

            {/* Emergency Modal */}
            {showEmergency && (
                <div className="fixed inset-0 bg-red-900/90 backdrop-blur-md z-[70] flex items-center justify-center p-6 animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-scale-up">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <ShieldAlert size={40} />
                            </div>
                            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Emergency Alert</h2>
                            <p className="text-gray-600 mb-8">This will instantly notify all team members and trigger high-priority alerts.</p>

                            <div className="grid grid-cols-2 gap-3 w-full mb-6">
                                {['Medical', 'Fire', 'Security', 'Equipment', 'Vendor', 'Other'].map(type => (
                                    <button key={type} className="p-3 border-2 border-slate-100 rounded-xl font-bold text-slate-600 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <button className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-red-700 shadow-xl shadow-red-500/30 mb-3 transform transition-transform active:scale-95">
                                BROADCAST ALERT
                            </button>
                            <button onClick={() => setShowEmergency(false)} className="text-slate-400 font-medium hover:text-slate-600">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveEventMode;
