import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, MessageSquare, LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const Header = ({ showNotifications, setShowNotifications, onMenuToggle }) => {
    const { currentUser, logout } = useAuth();
    const { notifications } = useData();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        setShowProfileMenu(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-50 border-b-0 px-4 lg:px-8 py-3 pt-[calc(env(safe-area-inset-top)+0.5rem)] lg:ml-64 transition-all duration-300">
            <div className="flex items-center justify-between max-w-[90vw] lg:max-w-7xl mx-auto">
                <div className="flex items-center gap-3 lg:hidden">
                    <button
                        onClick={onMenuToggle}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="text-xl font-heading font-bold text-gray-900 tracking-tight">EventFlow</span>
                </div>

                <div className="hidden lg:block text-2xl font-heading font-bold text-gray-900 tracking-tight">
                    EventFlow
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50">
                        <Search size={20} />
                    </button>

                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50">
                        <MessageSquare size={20} />
                    </button>

                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50 relative"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 bg-status-overdue text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Profile Dropdown Container */}
                    <div className="relative" ref={menuRef}>
                        <div
                            className="flex items-center gap-3 cursor-pointer select-none"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            {/* Desktop Profile Info */}
                            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-semibold text-gray-900">{currentUser.name || 'User'}</p>
                                    <p className="text-xs text-gray-500 capitalize">{currentUser.role || 'Owner'}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md ring-2 ring-white hover:ring-primary-100 transition-all">
                                    {currentUser.avatar || currentUser.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Mobile Avatar */}
                            <div className="lg:hidden w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                                {currentUser.avatar || currentUser.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <div className="lg:hidden px-3 py-2 border-b border-gray-100 mb-1">
                                    <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                                </div>

                                <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                    <User size={16} className="text-gray-400" />
                                    My Profile
                                </button>
                                <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                    <Settings size={16} className="text-gray-400" />
                                    Settings
                                </button>
                                <div className="h-px bg-gray-100 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                >
                                    <LogOut size={16} />
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
