import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FloatingActionButton = ({
    activeTab,
    onNewEvent,
    onNewTask,
    onNewWorker,
    onNewVendor,
    selectedEvent // For event-detail context
}) => {
    const { currentUser } = useAuth();
    const role = currentUser.role; // 'owner', 'lead', 'worker'

    // Logic to determine button action and visibility
    const getButtonConfig = () => {
        // Workers generally don't see the FAB for creation actions
        if (role === 'worker') return null;

        switch (activeTab) {
            case 'dashboard':
            case 'events':
                return {
                    action: onNewEvent,
                    label: 'Add New Event',
                    show: true // Owner & Lead
                };
            case 'tasks':
                return {
                    action: onNewTask,
                    label: 'Add New Task',
                    show: true // Owner & Lead
                };
            case 'team':
                return {
                    action: onNewWorker,
                    label: 'Add Team Member',
                    show: role === 'owner' // Only Owner
                };
            case 'vendors':
                return {
                    action: onNewVendor,
                    label: 'Add Vendor',
                    show: true // Owner & Lead
                };
            case 'event-detail':
                return {
                    action: onNewTask, // Reuses new task modal, pre-filling happens in App or Modal
                    label: 'Add Task to Event',
                    show: true // Owner & Lead
                };
            case 'analytics':
                return null; // Hidden on analytics
            default:
                return null;
        }
    };

    const config = getButtonConfig();

    if (!config || !config.show) return null;

    return (
        <div className="fixed bottom-20 lg:bottom-8 right-6 lg:right-8 z-40 group">
            <button
                onClick={config.action}
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce-in"
                aria-label={config.label}
            >
                <Plus size={20} />
            </button>

            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                {config.label}
                {/* Arrow */}
                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-t-4 border-t-transparent border-l-4 border-l-gray-900 border-b-4 border-b-transparent"></div>
            </div>
        </div>
    );
};

export default FloatingActionButton;
