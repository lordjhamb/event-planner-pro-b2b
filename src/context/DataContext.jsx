import React, { createContext, useContext, useState, useMemo } from 'react';
import { MOCK_DATA } from '../data/mockData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [events, setEvents] = useState(MOCK_DATA.events);
    const [tasks, setTasks] = useState(MOCK_DATA.tasks);
    const [workers, setWorkers] = useState(MOCK_DATA.workers);
    const [vendors, setVendors] = useState(MOCK_DATA.vendors);
    const [notifications, setNotifications] = useState(MOCK_DATA.notifications);

    // Helper functions
    const markNotificationRead = (notifId) => {
        setNotifications(notifications.map(n =>
            n.id === notifId ? { ...n, read: true } : n
        ));
    };

    const markAllNotificationsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const addEvent = (newEvent) => {
        setEvents([...events, newEvent]);
    };

    const addTask = (newTask) => {
        setTasks([...tasks, newTask]);
    };

    const updateTaskStatus = (taskId, status) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    };

    const addWorker = (newWorker) => {
        setWorkers([...workers, newWorker]);
    };

    const value = {
        events,
        setEvents,
        addEvent,
        tasks,
        setTasks,
        addTask,
        updateTaskStatus,
        workers,
        setWorkers,
        addWorker,
        vendors,
        setVendors,
        notifications,
        setNotifications,
        markNotificationRead,
        markAllNotificationsRead
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
