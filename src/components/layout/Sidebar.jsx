import React from 'react';
import { TrendingUp, BarChart3, Calendar, CheckSquare, Tag, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab, setSelectedEvent }) => {
    const { currentUser } = useAuth();

    // Define navigation items based on user role
    const getNavItems = () => {
        const items = [];

        // Common items
        items.push({ id: 'dashboard', icon: TrendingUp, label: 'Dashboard' });

        if (currentUser.role === 'owner' || currentUser.role === 'lead') {
            items.push({ id: 'analytics', icon: BarChart3, label: 'Analytics' });
        }

        items.push({ id: 'events', icon: Calendar, label: 'Events' });
        items.push({ id: 'tasks', icon: CheckSquare, label: 'Tasks' });
        items.push({ id: 'team', icon: Users, label: 'Team' });
        items.push({ id: 'vendors', icon: Tag, label: 'Vendors' });

        return items;
    };

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200 z-40 pt-20">
            <div className="flex flex-col flex-1 px-4 gap-2">
                {getNavItems().map(item => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setSelectedEvent(null); }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === item.id
                                ? 'bg-primary-50 text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                        {currentUser.avatar}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{currentUser.name || 'Priya Sharma'}</span>
                        <span className="text-xs text-gray-500 capitalize">{currentUser.role}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
