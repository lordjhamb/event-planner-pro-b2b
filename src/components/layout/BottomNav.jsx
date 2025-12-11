import React from 'react';
import { TrendingUp, BarChart3, Calendar, CheckSquare, Tag, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BottomNav = ({ activeTab, setActiveTab, setSelectedEvent }) => {
    const { currentUser } = useAuth();

    // Define navigation items based on user role
    const getNavItems = () => {
        if (currentUser.role === 'owner') {
            return [
                { id: 'dashboard', icon: TrendingUp, label: 'Home' },
                { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                { id: 'events', icon: Calendar, label: 'Events' },
                { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
                { id: 'vendors', icon: Tag, label: 'Vendors' },
                { id: 'team', icon: Users, label: 'Team' }
            ];
        } else if (currentUser.role === 'lead') {
            return [
                { id: 'dashboard', icon: TrendingUp, label: 'Home' },
                { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                { id: 'events', icon: Calendar, label: 'Events' },
                { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
                { id: 'vendors', icon: Tag, label: 'Vendors' },
                { id: 'team', icon: Users, label: 'Team' }
            ];
        } else {
            // Worker view
            return [
                { id: 'dashboard', icon: TrendingUp, label: 'Home' },
                { id: 'tasks', icon: CheckSquare, label: 'My Tasks' },
                { id: 'events', icon: Calendar, label: 'Events' },
                { id: 'vendors', icon: Tag, label: 'Vendors' },
                { id: 'team', icon: Users, label: 'Team' }
            ];
        }
    };

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div className="flex justify-around">
                {getNavItems().map(item => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setSelectedEvent(null); }}
                        className={`flex flex-col items-center py-2 px-2 ${activeTab === item.id ? 'text-indigo-600' : 'text-gray-600'}`}
                    >
                        <item.icon size={20} />
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
