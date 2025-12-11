import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import NotificationsPanel from './components/layout/NotificationsPanel';

// Pages
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Vendors from './pages/Vendors';
import Analytics from './pages/Analytics';

// Components (for specific views like Event Detail)
import EventDetail from './components/events/EventDetail';

// Modals
import NewEventModal from './components/modals/NewEventModal';
import NewTaskModal from './components/modals/NewTaskModal';
import NewWorkerModal from './components/modals/NewWorkerModal';
import TaskDetailModal from './components/modals/TaskDetailModal';
import WorkerDetailModal from './components/modals/WorkerDetailModal';
import VendorDetailModal from './components/modals/VendorDetailModal';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Modal States
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNewWorkerModal, setShowNewWorkerModal] = useState(false);

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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />

      <main className="max-w-7xl mx-auto p-4 pt-4 pb-24 lg:pb-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onSelectEvent={handleEventSelect}
            onNewEvent={() => setShowNewEventModal(true)}
            onNewTask={() => setShowNewTaskModal(true)}
            onNewWorker={() => setShowNewWorkerModal(true)}
          />
        )}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'events' && (
          <Events
            onSelectEvent={handleEventSelect}
            onNewEvent={() => setShowNewEventModal(true)}
          />
        )}
        {activeTab === 'event-detail' && (
          <EventDetail
            event={selectedEvent}
            onBack={() => {
              setSelectedEvent(null);
              setActiveTab('events'); // Or dashboard depending on where they came from
            }}
            onSelectTask={handleTaskSelect}
            onSelectWorker={handleWorkerSelect}
            onNewTask={() => setShowNewTaskModal(true)}
          />
        )}
        {activeTab === 'tasks' && <Tasks onSelectTask={handleTaskSelect} />}
        {activeTab === 'team' && (
          <Team
            onSelectWorker={handleWorkerSelect}
            onNewWorker={() => setShowNewWorkerModal(true)}
          />
        )}
        {activeTab === 'vendors' && <Vendors onSelectVendor={handleVendorSelect} />}
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

      {/* Modals */}
      <NewEventModal
        isOpen={showNewEventModal}
        onClose={() => setShowNewEventModal(false)}
      />
      <NewTaskModal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        selectedEvent={selectedEvent}
      />
      <NewWorkerModal
        isOpen={showNewWorkerModal}
        onClose={() => setShowNewWorkerModal(false)}
      />

      {/* Detail Modals */}
      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
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