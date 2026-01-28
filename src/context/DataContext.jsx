import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { MOCK_DATA } from '../data/mockData';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabaseClient';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const { currentUser } = useAuth();

    // Data States
    const [weddings, setWeddings] = useState([]); // [NEW] Top level
    const [events, setEvents] = useState(MOCK_DATA.events);
    const [tasks, setTasks] = useState(MOCK_DATA.tasks);
    const [workers, setWorkers] = useState(MOCK_DATA.workers);
    const [vendors, setVendors] = useState(MOCK_DATA.vendors);
    const [inventory, setInventory] = useState([]);
    const [finance, setFinance] = useState([]);
    const [inventoryRequests, setInventoryRequests] = useState([]);
    const [templates, setTemplates] = useState([]); // [NEW] Wedding Templates
    const [notifications, setNotifications] = useState(MOCK_DATA.notifications);
    const [loading, setLoading] = useState(true);

    // Fetch Real Data
    useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            console.log("Fetching Real Data from Supabase...");
            try {
                const [
                    weddingsRes,
                    eventsRes,
                    tasksRes,
                    workersRes,
                    inventoryRes,
                    financeRes,
                    reqRes,
                    tmplRes,
                    notifRes
                ] = await Promise.all([
                    supabase.from('weddings').select('*').order('startDate', { ascending: true }),
                    supabase.from('events').select('*'),
                    supabase.from('tasks').select('*'),
                    supabase.from('workers').select('*'),
                    supabase.from('inventory_items').select('*'),
                    supabase.from('finance_transactions').select('*'),
                    supabase.from('task_inventory_requests').select('*'),
                    supabase.from('wedding_templates').select('*'),
                    supabase.from('notifications').select('*').eq('recipientId', currentUser.id).order('created_at', { ascending: false })
                ]);

                if (weddingsRes.data) setWeddings(weddingsRes.data);

                if (eventsRes.data) {
                    setEvents(eventsRes.data.map(e => ({
                        ...e,
                        id: e.id.toString(),
                        weddingId: e.weddingId ? e.weddingId.toString() : null,
                        workers: e.workers || [],
                        departmentLeads: e.departmentLeads || []
                    })));
                }

                if (tasksRes.data) {
                    setTasks(tasksRes.data.map(t => ({
                        ...t,
                        id: t.id.toString(),
                        eventId: t.eventId ? t.eventId.toString() : null,
                        weddingId: t.weddingId ? t.weddingId.toString() : null
                    })));
                }

                if (workersRes.data) setWorkers(workersRes.data.map(w => ({ ...w, id: w.id.toString() })));
                if (inventoryRes.data) setInventory(inventoryRes.data);
                if (financeRes.data) setFinance(financeRes.data);
                if (reqRes.data) setInventoryRequests(reqRes.data);
                if (tmplRes.data) setTemplates(tmplRes.data);
                if (notifRes.data) setNotifications(notifRes.data);

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
        // [FIX] Everyone in the organization should see all events (per user request)
        // Owner, Lead, and Worker all see the full event list to understand the timeline.
        return events;
    }, [events, currentUser]);

    const filteredTasks = useMemo(() => {
        if (!currentUser) return [];

        // Owner AND Leads see all tasks
        if (currentUser.role === 'owner' || currentUser.role === 'lead') return tasks;

        // Workers only see tasks assigned to them
        // [FIX] Map the Auth User (UUID) to the Worker Entity (BigInt ID)
        const currentWorker = workers.find(w => w.profile_id === currentUser.id);
        const currentWorkerId = currentWorker ? currentWorker.id : null;

        return tasks.filter(task =>
            // Match against Worker ID (primary check)
            (currentWorkerId && task.assignee?.toString() === currentWorkerId.toString()) ||
            // Fallback: Match against Auth ID just in case legacy data used UUIDs
            (task.assignee === currentUser.id)
        );
    }, [tasks, currentUser, workers]);

    // --- Actions ---

    const markNotificationRead = async (notifId) => {
        // Optimistic UI Update
        setNotifications(notifications.map(n =>
            n.id === notifId ? { ...n, read: true } : n
        ));

        try {
            await supabase.from('notifications').update({ read: true }).eq('id', notifId);
        } catch (error) {
            console.error("Error marking notification read:", error);
        }
    };

    const markAllNotificationsRead = async () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        try {
            await supabase.from('notifications').update({ read: true }).eq('recipientId', currentUser.id);
        } catch (error) {
            console.error("Error marking all read:", error);
        }
    };

    const addNotification = async (notificationData) => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .insert([{
                    organization_id: currentUser.organizationId,
                    created_at: new Date(),
                    read: false,
                    ...notificationData
                }])
                .select()
                .single();

            if (error) throw error;
            // Note: Realtime subscription would normally handle this, but for now we manually add it if it's for us
            // Check if we are the recipient
            if (data.recipientId === currentUser.id) {
                setNotifications(prev => [data, ...prev]);
            }
        } catch (error) {
            console.error("Error creating notification:", error);
        }
    };

    // 1. Create Wedding with Sub-Events
    const createWedding = async (weddingData, selectedEvents) => {
        console.log("Creating Wedding:", weddingData);
        try {
            // A. Create Wedding
            const { data: newWedding, error: wError } = await supabase
                .from('weddings')
                .insert([weddingData])
                .select()
                .single();

            if (wError) throw wError;
            const weddingId = newWedding.id;

            // B. Create Events
            const eventsToInsert = selectedEvents.map(evt => ({
                weddingId: weddingId,
                name: evt.name,
                type: evt.type,
                dates: evt.date || 'TBD',
                status: 'Upcoming',
                budget: evt.budget || 0,
                progress: 0,
                description: evt.description,
                workers: [],
                departmentLeads: []
            }));

            const { data: createdEvents, error: eError } = await supabase
                .from('events')
                .insert(eventsToInsert)
                .select();

            if (eError) throw eError;

            // C. Create Tasks for each Event
            let tasksToInsert = [];
            createdEvents.forEach((createdEvt, index) => {
                const templateEvt = selectedEvents[index];
                if (templateEvt.defaultTasks && templateEvt.defaultTasks.length > 0) {
                    const evtTasks = templateEvt.defaultTasks.map(taskDef => {
                        const isObj = typeof taskDef === 'object';
                        const title = isObj ? taskDef.title : taskDef;
                        const checklist = (isObj && taskDef.subtasks)
                            ? taskDef.subtasks.map(text => ({ text, completed: false }))
                            : [];

                        // Calculate specific due date if event has a date
                        let dueDate = null;
                        if (isObj && taskDef.due_date_offset && createdEvt.dates && createdEvt.dates !== 'TBD') {
                            const evtDate = new Date(createdEvt.dates);
                            if (!isNaN(evtDate.getTime())) {
                                const d = new Date(evtDate);
                                d.setDate(d.getDate() + taskDef.due_date_offset);
                                dueDate = d.toISOString().split('T')[0];
                            }
                        }

                        return {
                            weddingId: weddingId,
                            eventId: createdEvt.id,
                            title: title,
                            status: 'Open',
                            priority: 'Medium',
                            budget: 0,
                            checklist: checklist,
                            dueDate: dueDate
                        };
                    });
                    tasksToInsert = [...tasksToInsert, ...evtTasks];
                }
            });

            if (tasksToInsert.length > 0) {
                const { error: tError } = await supabase.from('tasks').insert(tasksToInsert);
                if (tError) console.error("Error creating default tasks:", tError);
            }

            // D. Refresh Local State
            setWeddings(prev => [...prev, newWedding]);
            setEvents(prev => [...prev, ...createdEvents.map(e => ({ ...e, id: e.id.toString(), weddingId: weddingId.toString() }))]);

            // Fetch tasks again to ensure we have IDs
            const { data: refreshedTasks } = await supabase.from('tasks').select('*');
            if (refreshedTasks) {
                setTasks(refreshedTasks.map(t => ({
                    ...t,
                    id: t.id.toString(),
                    eventId: t.eventId ? t.eventId.toString() : null,
                    weddingId: t.weddingId ? t.weddingId.toString() : null
                })));
            }

            return newWedding;
        } catch (err) {
            console.error("Create Wedding Failed:", err);
            throw err;
        }
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
                workers: newEvent.workers || [],
                weddingId: newEvent.weddingId // Support linking to wedding manually
            }]).select();

            if (data) {
                setEvents(prev => prev.map(e => e.id === tempId ? { ...data[0], id: data[0].id.toString(), weddingId: data[0].weddingId ? data[0].weddingId.toString() : null } : e));
            }
        } catch (err) {
            console.error("Failed to add event:", err);
        }
    };

    const updateEvent = async (updatedEvent) => {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        try {
            const { error } = await supabase.from('events').update({
                name: updatedEvent.name,
                status: updatedEvent.status,
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
        }
    };

    const deleteEvent = async (eventId) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setTasks(prev => prev.filter(t => t.eventId !== eventId));

        try {
            const { error } = await supabase.from('events').delete().eq('id', eventId);
            if (error) throw error;
        } catch (err) {
            console.error("Failed to delete event:", err);
        }
    };

    const deleteWedding = async (weddingId) => {
        try {
            // Optimistic local update
            setWeddings(prev => prev.filter(w => w.id.toString() !== weddingId.toString()));
            setEvents(prev => prev.filter(e => !e.weddingId || e.weddingId.toString() !== weddingId.toString()));
            setTasks(prev => prev.filter(t => !t.weddingId || t.weddingId.toString() !== weddingId.toString()));

            // MANUAL CASCADE DELETE:
            // Since some tables (finance, inventory) might not have ON DELETE CASCADE in the DB schema,
            // we must clean them up manually to stay safe.

            // 1. Get Event IDs and Task IDs DIRECTLY FROM DB (to ensure we don't miss any not in local state)
            const { data: dbEvents } = await supabase.from('events').select('id').eq('weddingId', weddingId);
            const relatedEventIds = dbEvents?.map(e => e.id) || [];

            const { data: dbTasks } = await supabase.from('tasks').select('id').eq('weddingId', weddingId);
            const relatedTaskIds = dbTasks?.map(t => t.id) || [];

            console.log("DEBUG: Found related events/tasks in DB from direct query:", relatedEventIds.length, relatedTaskIds.length);

            // 2. Delete Finance Transactions
            if (relatedEventIds.length > 0) {
                const { error: fError } = await supabase.from('finance_transactions').delete().in('eventId', relatedEventIds);
                if (fError) console.warn("Failed to clean up finance details", fError);

                const { error: iError } = await supabase.from('inventory_transactions').delete().in('eventId', relatedEventIds);
                if (iError) console.warn("Failed to clean up inventory tx by event", iError);
            }

            // 3. Delete Task Inventory Requests & Inventory Transactions (by Task)
            if (relatedTaskIds.length > 0) {
                const { error: trError } = await supabase.from('task_inventory_requests').delete().in('taskId', relatedTaskIds);
                if (trError) console.warn("Failed to clean up task requests", trError);

                const { error: itError } = await supabase.from('inventory_transactions').delete().in('taskId', relatedTaskIds);
                if (itError) console.warn("Failed to clean up inventory tx by task", itError);

                // EXPLICITLY Delete Tasks (Manual Cascade)
                const { error: tError } = await supabase.from('tasks').delete().in('id', relatedTaskIds);
                if (tError) {
                    console.error("Failed to delete tasks:", tError);
                    alert(`Failed to delete tasks: ${tError.message}`); // ALERT HERE
                }
            }

            // EXPLICITLY Delete Events (Manual Cascade)
            if (relatedEventIds.length > 0) {
                const { error: eError } = await supabase.from('events').delete().in('id', relatedEventIds);
                if (eError) {
                    console.error("Failed to delete events:", eError);
                    alert(`Failed to delete events: ${eError.message}`); // ALERT HERE
                }
            }

            // 4. Finally Delete Wedding (will cascade to events/tasks/messages if configured, else this manual step ensures safety)
            const { error } = await supabase.from('weddings').delete().eq('id', weddingId);
            if (error) {
                console.error("DEBUG DATA CONTEXT: Supabase error:", error);
                throw error;
            }
            console.log("DEBUG DATA CONTEXT: Supabase delete success");
        } catch (err) {
            console.error("Failed to delete wedding:", err);
            alert(`Error deleting wedding: ${err.message || err.error_description || 'Unknown error'}`);
            // Revert state (reload data)
            window.location.reload();
        }
    };

    const addTask = async (newTask) => {
        const tempId = `temp-${Date.now()}`;
        setTasks(prev => [...prev, { ...newTask, id: tempId }]);

        try {
            const { data, error } = await supabase.from('tasks').insert([{
                "eventId": newTask.eventId,
                "weddingId": newTask.weddingId,
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
        // Find existing task to check previous status or details
        const task = tasks.find(t => t.id === taskId);

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
        if (!taskId.toString().startsWith('t-') && !taskId.toString().startsWith('temp-')) {
            await supabase.from('tasks').update({ status }).eq('id', taskId);

            // --- Notification Logic ---
            if (task) {
                try {
                    // Case 1: Worker Submits Task -> Notify Owner/Lead
                    if (status === 'Submitted') {
                        // Find Owner(s)
                        const owners = workers.filter(w => w.role === 'owner' && w.profile_id); // Only those with profiles
                        for (const owner of owners) {
                            addNotification({
                                recipientId: owner.profile_id,
                                title: "Task Submitted",
                                message: `Task "${task.title}" is ready for review.`,
                                type: 'task',
                                link: task.eventId ? `/events/${task.eventId}` : '/tasks',
                                senderId: currentUser.id
                            });
                        }
                    }

                    // Case 2: Owner Approves Task -> Notify Worker
                    else if (status === 'Approved') {
                        const assignee = workers.find(w => w.id?.toString() === task.assignee?.toString());
                        if (assignee?.profile_id) {
                            addNotification({
                                recipientId: assignee.profile_id,
                                title: "Task Approved",
                                message: `Great job! "${task.title}" has been approved.`,
                                type: 'success',
                                link: task.eventId ? `/events/${task.eventId}` : '/tasks',
                                senderId: currentUser.id
                            });
                        }
                    }
                } catch (err) {
                    console.error("Notification Trigger Failed:", err);
                }
            }
        }
    };

    const addWorker = async (newWorker) => {
        const tempId = Date.now();
        const optimisticWorker = { ...newWorker, id: tempId, skills: newWorker.skills || [] };
        setWorkers(prev => [...prev, optimisticWorker]);

        try {
            const { data, error } = await supabase.from('workers').insert([{
                name: newWorker.name,
                role: newWorker.role,
                phone: newWorker.phone,
                available: true,
                skills: newWorker.skills || [],
                "joinDate": new Date().toISOString()
            }]).select();

            if (error) throw error;

            if (data) {
                const realId = data[0].id;
                setWorkers(prev => prev.map(w => w.id === tempId ? { ...data[0] } : w));
                return realId;
            }
        } catch (err) {
            console.error("Failed to add worker:", err);
            // Revert on failure
            setWorkers(prev => prev.filter(w => w.id !== tempId));
            return null;
        }
        return tempId; // Fallback if sync fails but we want to proceed locally (though risky)
    };

    const addInventoryItem = async (item) => {
        const tempId = `temp-inv-${Date.now()}`;
        setInventory(prev => [...prev, { ...item, id: tempId }]);
        try {
            const { data } = await supabase.from('inventory_items').insert([{
                name: item.name,
                category: item.category,
                "totalQuantity": parseInt(item.totalQuantity),
                "availableQuantity": parseInt(item.totalQuantity),
                "pricePerUnit": parseFloat(item.pricePerUnit),
                "imageUrl": item.imageUrl
            }]).select();
            if (data) {
                setInventory(prev => prev.map(i => i.id === tempId ? data[0] : i));
            }
        } catch (err) {
            console.error("Failed to add inventory:", err);
        }
    };

    const logInventoryTransaction = async (transaction) => {
        setInventory(prev => prev.map(item => {
            // [FIX] Use loose comparison or string conversion for IDs to handle type mismatches
            if (item.id.toString() === transaction.itemId.toString()) {
                const qty = parseInt(transaction.quantity) || 0;
                const change = transaction.type === 'Check-Out' ? -qty : qty;
                const currentAvail = parseInt(item.availableQuantity) || 0;
                return { ...item, availableQuantity: currentAvail + change };
            }
            return item;
        }));
        try {
            await supabase.from('inventory_transactions').insert([{
                "itemId": transaction.itemId,
                "eventId": transaction.eventId,
                "taskId": transaction.taskId,
                type: transaction.type,
                quantity: parseInt(transaction.quantity),
                notes: transaction.notes
            }]);
            const item = inventory.find(i => i.id === transaction.itemId);
            if (item) {
                const change = transaction.type === 'Check-Out' ? -transaction.quantity : transaction.quantity;
                await supabase.from('inventory_items').update({
                    "availableQuantity": item.availableQuantity + change
                }).eq('id', transaction.itemId);
            }
        } catch (err) {
            console.error("Inventory Transaction Failed:", err);
        }
    };

    const addFinanceTransaction = async (transaction) => {
        const tempId = `temp-fin-${Date.now()}`;
        setFinance(prev => [...prev, { ...transaction, id: tempId }]);
        try {
            const { data } = await supabase.from('finance_transactions').insert([{
                "eventId": transaction.eventId,
                type: transaction.type,
                category: transaction.category,
                amount: parseFloat(transaction.amount),
                mode: transaction.mode,
                status: transaction.status,
                notes: transaction.notes,
                date: new Date().toISOString()
            }]).select();
            if (data) {
                setFinance(prev => prev.map(f => f.id === tempId ? data[0] : f));
            }
        } catch (err) {
            console.error("Failed to add finance transaction:", err);
        }
    };

    const requestInventory = async (taskId, itemId, quantity) => {
        const tempId = `req-${Date.now()}`;
        const newReq = {
            id: tempId,
            taskId,
            itemId,
            quantity,
            status: 'Requested',
            requestedBy: currentUser.id,
            createdAt: new Date().toISOString()
        };
        setInventoryRequests(prev => [...prev, newReq]);
        try {
            const { data } = await supabase.from('task_inventory_requests').insert([{
                "taskId": taskId,
                "itemId": itemId,
                quantity: quantity,
                status: 'Requested',
                "requestedBy": currentUser.id
            }]).select();
            if (data) {
                setInventoryRequests(prev => prev.map(r => r.id === tempId ? data[0] : r));
            }
        } catch (err) { console.error(err); }
    };

    const updateInventoryRequestStatus = async (requestId, status) => {
        setInventoryRequests(prev => prev.map(r => r.id === requestId ? { ...r, status, approvedBy: currentUser.id } : r));

        await supabase.from('task_inventory_requests').update({
            status,
            "approvedBy": currentUser.id
        }).eq('id', requestId);

        // [FIX] Decrement available quantity if Approved
        if (status === 'Approved') {
            const request = inventoryRequests.find(r => r.id === requestId);
            if (request) {
                // Log transaction (which handles the decrement logic locally & DB)
                await logInventoryTransaction({
                    itemId: request.itemId,
                    eventId: events.find(e => e.id === request.taskId?.toString() || tasks.find(t => t.id === request.taskId)?.eventId)?.id, // Try to find event ID
                    taskId: request.taskId,
                    type: 'Check-Out',
                    quantity: request.quantity,
                    notes: 'Task Request Approved'
                });
            }
        }
    };

    const markInventoryUsed = async (requestId) => {
        const request = inventoryRequests.find(r => r.id === requestId);
        if (!request) return;
        setInventoryRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Used' } : r));
        await logInventoryTransaction({
            itemId: request.itemId,
            type: 'Check-Out',
            quantity: request.quantity,
            taskId: request.taskId,
            notes: 'Task Usage Confirmed'
        });
        await supabase.from('task_inventory_requests').update({
            status: 'Used'
        }).eq('id', requestId);
    };

    const getWeddingEvents = (weddingId) => events.filter(e => e.weddingId === weddingId.toString());

    // 1b. Update Wedding (New)
    // 1b. Update Wedding (New)
    const updateWedding = async (updatedObj) => {
        // Optimistic Update
        setWeddings(prev => prev.map(w => w.id.toString() === updatedObj.id.toString() ? { ...w, ...updatedObj } : w));

        // Cascade Status Update
        if (['Active', 'Upcoming', 'Cancelled'].includes(updatedObj.status)) {
            // Optimistic update for sub-events
            setEvents(prev => prev.map(e => {
                if (e.weddingId && e.weddingId.toString() === updatedObj.id.toString()) {
                    return { ...e, status: updatedObj.status };
                }
                return e;
            }));
        }

        try {
            const { error } = await supabase.from('weddings').update({
                name: updatedObj.name,
                status: updatedObj.status,
                "clientName": updatedObj.client, // Map back to DB field
                "startDate": updatedObj.startDate || updatedObj.dates,
                "totalBudget": parseFloat(updatedObj.budget) || 0,
                "weddingType": updatedObj.type
            }).eq('id', updatedObj.id);

            if (error) throw error;

            // Cascade DB Update
            if (['Active', 'Upcoming', 'Cancelled'].includes(updatedObj.status)) {
                await supabase.from('events')
                    .update({ status: updatedObj.status })
                    .eq('weddingId', updatedObj.id);
            }

        } catch (err) {
            console.error("Failed to update wedding:", err);
            // Revert could be here, but let's assume success for now
        }
    };

    const value = {
        weddings,
        templates,
        createWedding,
        updateWedding, // Exported
        getWeddingEvents,
        events: filteredEvents,
        allEvents: events,
        setEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        deleteWedding,
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
        inventory,
        addInventoryItem,
        logInventoryTransaction,
        finance,
        addFinanceTransaction,
        inventoryRequests,
        requestInventory,
        updateInventoryRequestStatus,
        markInventoryUsed,
        notifications,
        setNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification
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
