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
        <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-primary-600/50 backdrop-blur-md rounded-full shadow-xl z-50 px-6 py-3 flex justify-between items-center">
            {getNavItems().map(item => (
                <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSelectedEvent(null); }}
                    className={`transition-all duration-200 p-2 rounded-full ${activeTab === item.id
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                    aria-label={item.label}
                >
                    <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
