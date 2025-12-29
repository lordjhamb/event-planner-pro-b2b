import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Sidebar from './components/layout/Sidebar';
import NotificationsPanel from './components/layout/NotificationsPanel';

// Pages
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Vendors from './pages/Vendors';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';


import Inventory from './pages/Inventory';
import Finance from './pages/Finance'; // [NEW]
import Login from './pages/Login';

// Components (for specific views like Event Detail)
import EventDetail from './components/events/EventDetail';

// Modals
import NewEventModal from './components/modals/NewEventModal';
import NewTaskModal from './components/modals/NewTaskModal';
import LiveEventMode from './components/live/LiveEventMode';
import NewWorkerModal from './components/modals/NewWorkerModal';
import TaskDetailModal from './components/modals/TaskDetailModal';
import WorkerDetailModal from './components/modals/WorkerDetailModal';
import VendorDetailModal from './components/modals/VendorDetailModal';
import FloatingActionButton from './components/common/FloatingActionButton';

// Icon imports for menuItems (assuming these are from a library like 'lucide-react')
import { LayoutDashboard, Calendar as CalendarIcon, CheckSquare, Users, ShoppingBag, DollarSign, BarChart3, Settings, Package } from 'lucide-react';


const AppContent = () => {
  const { currentUser } = useAuth(); // Correctly get currentUser
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Added state for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sidebar menu items (added as per instruction)

  // Sidebar menu items (added as per instruction)
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
    { id: 'events', icon: CalendarIcon, label: 'Events' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'vendors', icon: ShoppingBag, label: 'Vendors' },
    { id: 'inventory', icon: Package, label: 'Inventory' }, // [NEW]
    { id: 'finance', icon: DollarSign, label: 'Finance' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  // Filter States for Navigation
  const [initialTaskFilter, setInitialTaskFilter] = useState('all');
  const [initialEventFilter, setInitialEventFilter] = useState('all');

  // Modal States
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null); // New state for editing
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [liveModeEvent, setLiveModeEvent] = useState(null);
  const [showNewWorkerModal, setShowNewWorkerModal] = useState(false);

  // If no user, show Login (Must be AFTER all hooks)
  if (!currentUser) {
    return <Login />;
  }

  // Handlers
  const handleNavigate = (tab, filter = null) => {
    if (tab === 'tasks' && filter) setInitialTaskFilter(filter);
    if (tab === 'events' && filter) setInitialEventFilter(filter);
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  // Handlers
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setActiveTab('event-detail');
    window.scrollTo(0, 0);
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  const handleWorkerSelect = (worker) => {
    setSelectedWorker(worker);
  };

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 lg:pb-0 bg-gray-50 overflow-x-hidden">
      {liveModeEvent && (
        <LiveEventMode event={liveModeEvent} onClose={() => setLiveModeEvent(null)} />
      )}

      <Header
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedEvent={setSelectedEvent}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="lg:pl-64 pt-[calc(env(safe-area-inset-top)+4rem)] pb-24 lg:pb-8 px-4 lg:px-8 w-full lg:max-w-7xl mx-auto transition-all duration-300 overflow-x-hidden">
        {/* DEBUG: State Indicator */}

        {activeTab === 'dashboard' && (
          <Dashboard
            onSelectEvent={handleEventSelect}
            onSelectTask={handleTaskSelect}
            onNewEvent={() => setShowNewEventModal(true)}
            onNewTask={() => setShowNewTaskModal(true)}
            onNewWorker={() => setShowNewWorkerModal(true)}
            onNavigate={handleNavigate}
          />
        )}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'calendar' && <Calendar />}
        {activeTab === 'events' && (
          <Events
            onSelectEvent={handleEventSelect}
            onNewEvent={() => setShowNewEventModal(true)}
            initialFilter={initialEventFilter}
          />
        )}
        {activeTab === 'event-detail' && (
          <EventDetail
            event={selectedEvent}
            onBack={() => {
              setSelectedEvent(null);
              setActiveTab('events');
            }}
            onSelectTask={setSelectedTask}
            onSelectWorker={setSelectedWorker}
            onNewTask={() => {
              setTaskToEdit(null);
              setShowNewTaskModal(true);
            }}
            startDate={selectedEvent?.dates}
            onEnterLiveMode={() => setLiveModeEvent(selectedEvent)}
            onEditEvent={(event) => {
              setEventToEdit(event);
              setShowNewEventModal(true);
            }}
            onSwitchEvent={setSelectedEvent}
          />
        )}
        {activeTab === 'tasks' && <Tasks onSelectTask={handleTaskSelect} initialFilter={initialTaskFilter} />}
        {activeTab === 'team' && (
          <Team
            onSelectWorker={handleWorkerSelect}
            onNewWorker={() => setShowNewWorkerModal(true)}
          />
        )}
        {activeTab === 'vendors' && <Vendors onSelectVendor={handleVendorSelect} />}
        {activeTab === 'vendors' && <Vendors onSelectVendor={handleVendorSelect} />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'finance' && <Finance />} {/* [NEW] */}
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedEvent={setSelectedEvent}
      />

      <NotificationsPanel
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        setSelectedTask={handleTaskSelect}
      />

      <FloatingActionButton
        activeTab={activeTab}
        selectedEvent={selectedEvent}
        onNewEvent={() => setShowNewEventModal(true)}
        onNewTask={() => setShowNewTaskModal(true)}
        onNewWorker={() => setShowNewWorkerModal(true)}
        onNewVendor={() => console.log('Add Vendor Modal not implemented yet')} // Placeholder if modal doesn't exist or isn't imported
      />

      {/* Modals */}
      <NewEventModal
        isOpen={showNewEventModal}
        onClose={() => {
          setShowNewEventModal(false);
          setEventToEdit(null); // Clear edit state on close
        }}
        eventToEdit={eventToEdit}
      />
      <NewTaskModal
        isOpen={showNewTaskModal}
        onClose={() => {
          setShowNewTaskModal(false);
          setTaskToEdit(null);
        }}
        selectedEvent={selectedEvent}
        taskToEdit={taskToEdit}
      />
      <NewWorkerModal
        isOpen={showNewWorkerModal}
        onClose={() => setShowNewWorkerModal(false)}
      />

      {/* Detail Modals */}
      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onEditTask={(task) => {
          setTaskToEdit(task);
          setSelectedTask(null);
          setShowNewTaskModal(true);
        }}
        onSelectWorker={(worker) => {
          setSelectedTask(null);
          setSelectedWorker(worker);
        }}
        onSelectEvent={(event) => {
          setSelectedTask(null);
          handleEventSelect(event);
        }}
      />
      <WorkerDetailModal
        worker={selectedWorker}
        onClose={() => setSelectedWorker(null)}
        onSelectTask={(task) => {
          setSelectedWorker(null);
          setSelectedTask(task);
        }}
      />
      <VendorDetailModal
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}