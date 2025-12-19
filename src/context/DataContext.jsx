import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { MOCK_DATA } from '../data/mockData';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabaseClient';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const { currentUser } = useAuth();

    // Start with Mock Data (prevents blank screen while loading)
    const [events, setEvents] = useState(MOCK_DATA.events);
    const [tasks, setTasks] = useState(MOCK_DATA.tasks);
    const [workers, setWorkers] = useState(MOCK_DATA.workers);
    const [vendors, setVendors] = useState(MOCK_DATA.vendors);
    const [notifications, setNotifications] = useState(MOCK_DATA.notifications);
    const [loading, setLoading] = useState(true);

    // Fetch Real Data
    useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            console.log("Fetching Real Data from Supabase...");
            try {
                // Fetch all 3 tables in parallel
                const [eventsRes, tasksRes, workersRes] = await Promise.all([
                    supabase.from('events').select('*'),
                    supabase.from('tasks').select('*'),
                    supabase.from('workers').select('*')
                ]);

                // Update Events if found
                if (eventsRes.data && eventsRes.data.length > 0) {
                    console.log(`Loaded ${eventsRes.data.length} Events`);
                    setEvents(eventsRes.data.map(e => ({
                        ...e,
                        id: e.id.toString(),
                        // SANITIZATION: Ensure these are arrays
                        workers: e.workers || [],
                        departmentLeads: e.departmentLeads || []
                    })));
                }

                // Update Tasks if found
                if (tasksRes.data && tasksRes.data.length > 0) {
                    console.log(`Loaded ${tasksRes.data.length} Tasks`);
                    // DEBUG: Explicitly convert eventId to string to match Event IDs
                    setTasks(tasksRes.data.map(t => ({
                        ...t,
                        id: t.id.toString(),
                        eventId: t.eventId ? t.eventId.toString() : null // CRITICAL FIX
                    })));
                }

                // Update Workers if found
                if (workersRes.data && workersRes.data.length > 0) {
                    console.log(`Loaded ${workersRes.data.length} Workers`);
                    setWorkers(workersRes.data.map(w => ({ ...w, id: w.id.toString() })));
                }

            } catch (error) {
                console.error("Supabase Sync Failed (Keeping Mocks):", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    // Visibility Filtering Logic
    const filteredEvents = useMemo(() => {
        if (!currentUser) return [];
        if (currentUser.role === 'owner') return events;

        return events.filter(event => {
            const isPrimary = event.primaryLeadId === currentUser.id;
            const isDeptLead = event.departmentLeads?.some(dl => dl.leadId === currentUser.id);
            const isWorker = event.workers?.includes(currentUser.id);
            return isPrimary || isDeptLead || isWorker;
        });
    }, [events, currentUser]);

    const filteredTasks = useMemo(() => {
        if (!currentUser) return [];
        if (currentUser.role === 'owner') return tasks;

        return tasks.filter(task => {
            const event = events.find(e => e.id === task.eventId);
            if (!event) return false;

            if (event.primaryLeadId === currentUser.id) return true;

            const deptLead = event.departmentLeads?.find(dl => dl.leadId === currentUser.id);
            if (deptLead && deptLead.category === task.department) return true;

            if (task.assignee === currentUser.id) return true;

            return false;
        });
    }, [tasks, events, currentUser]);

    // Helper functions
    const markNotificationRead = (notifId) => {
        setNotifications(notifications.map(n =>
            n.id === notifId ? { ...n, read: true } : n
        ));
    };

    const markAllNotificationsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const addEvent = async (newEvent) => {
        // Optimistic Update
        const tempId = `temp-${Date.now()}`;
        setEvents(prev => [...prev, { ...newEvent, id: tempId }]);

        try {
            const { data, error } = await supabase.from('events').insert([{
                name: newEvent.name,
                client: newEvent.client,
                dates: newEvent.dates,
                status: 'Active',
                location: newEvent.location,
                budget: parseFloat(newEvent.budget) || 0,
                spent: 0,
                progress: 0,
                "primaryLeadId": newEvent.primaryLeadId,
                "departmentLeads": newEvent.departmentLeads || [],
                description: newEvent.description,
                workers: newEvent.workers || []
            }]).select();

            if (data) {
                // Replace Temp ID
                setEvents(prev => prev.map(e => e.id === tempId ? { ...data[0], id: data[0].id.toString(), workers: data[0].workers || [], departmentLeads: data[0].departmentLeads || [] } : e));
            }
        } catch (err) {
            console.error("Failed to add event:", err);
        }
    };

    const updateEvent = async (updatedEvent) => {
        // Optimistic Update
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));

        try {
            const { error } = await supabase.from('events').update({
                name: updatedEvent.name,
                status: updatedEvent.status, // Added status field
                client: updatedEvent.client,
                dates: updatedEvent.dates,
                location: updatedEvent.location,
                budget: parseFloat(updatedEvent.budget) || 0,
                "primaryLeadId": updatedEvent.primaryLeadId,
                "departmentLeads": updatedEvent.departmentLeads || [],
                description: updatedEvent.description,
                workers: updatedEvent.workers || []
            }).eq('id', updatedEvent.id);

            if (error) throw error;
        } catch (err) {
            console.error("Failed to update event:", err);
            // Revert changes if needed (optionally implement revert logic here)
        }
    };

    const deleteEvent = async (eventId) => {
        // Optimistic Update
        setEvents(prev => prev.filter(e => e.id !== eventId));
        // Also remove related tasks optimistically
        setTasks(prev => prev.filter(t => t.eventId !== eventId));

        try {
            const { error } = await supabase.from('events').delete().eq('id', eventId);
            if (error) throw error;
        } catch (err) {
            console.error("Failed to delete event:", err);
            // Could revert here if needed
        }
    };

    const addTask = async (newTask) => {
        const tempId = `temp-${Date.now()}`;
        setTasks(prev => [...prev, { ...newTask, id: tempId }]);

        try {
            const { data, error } = await supabase.from('tasks').insert([{
                "eventId": newTask.eventId,
                title: newTask.title,
                description: newTask.description,
                status: 'Open',
                priority: newTask.priority,
                assignee: newTask.assignee,
                "dueDate": newTask.dueDate,
                budget: parseFloat(newTask.budget) || 0,
                department: newTask.department
            }]).select();

            if (data) {
                setTasks(prev => prev.map(t => t.id === tempId ? { ...data[0], id: data[0].id.toString(), eventId: data[0].eventId.toString() } : t));
            }
        } catch (err) {
            console.error("Failed to add task:", err);
        }
    };

    const updateTask = async (updatedTask) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));

        // Background sync
        if (!updatedTask.id.toString().startsWith('t-') && !updatedTask.id.toString().startsWith('temp-')) {
            await supabase.from('tasks').update({
                title: updatedTask.title,
                description: updatedTask.description,
                status: updatedTask.status,
                priority: updatedTask.priority,
                assignee: updatedTask.assignee,
                "dueDate": updatedTask.dueDate,
                budget: parseFloat(updatedTask.budget) || 0,
                department: updatedTask.department,
                "eventId": updatedTask.eventId
            }).eq('id', updatedTask.id);
        }
    };

    const deleteTask = async (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));

        if (!taskId.toString().startsWith('t-') && !taskId.toString().startsWith('temp-')) {
            try {
                await supabase.from('tasks').delete().eq('id', taskId);
            } catch (err) {
                console.error("Failed to delete task:", err);
            }
        }
    };

    const updateTaskStatus = async (taskId, status) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));

        if (!taskId.toString().startsWith('t-') && !taskId.toString().startsWith('temp-')) {
            await supabase.from('tasks').update({ status }).eq('id', taskId);
        }
    };

    const addWorker = (newWorker) => {
        setWorkers([...workers, newWorker]);
    };

    const value = {
        events: filteredEvents,
        allEvents: events,
        setEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        tasks: filteredTasks,
        allTasks: tasks,
        setTasks,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
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
