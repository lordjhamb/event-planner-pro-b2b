import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const Header = ({ showNotifications, setShowNotifications }) => {
    const { currentUser } = useAuth();
    const { notifications } = useData();

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className="lg:hidden"><Menu size={24} /></button>
                    <h1 className="text-xl font-bold text-gray-900">EventFlow</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 hover:bg-gray-100 rounded-full relative"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Search size={20} /></button>
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {currentUser.avatar}
                    </div>
                </div>
            </div>
            <div className="px-4 pb-2">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">{currentUser.role}</span>
            </div>
        </header>
    );
};

export default Header;
