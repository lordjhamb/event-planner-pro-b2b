# 🏗️ Restructuring Guide - Convert to Production-Ready Code

This guide explains how to restructure the single-file app into a proper component-based architecture.

## 📋 Current Status

✅ **Already Created:**
- Project folder structure
- Configuration files (vite, tailwind, postcss)
- package.json with dependencies
- README.md
- .gitignore
- src/App.jsx (your current monolithic file)
- src/main.jsx
- src/index.css

## 🎯 Restructuring Strategy

### Phase 1: Extract Mock Data (PRIORITY)

**Create:** `src/data/mockData.js`

```javascript
// Extract the entire MOCK_DATA object from App.jsx
export const MOCK_DATA = {
  currentUser: { ... },
  events: [ ... ],
  tasks: [ ... ],
  workers: [ ... ],
  // ... all other data
};
```

**Then in App.jsx:**
```javascript
import { MOCK_DATA } from './data/mockData';
```

---

### Phase 2: Extract Common Components

#### 2.1 Header Component
**Create:** `src/components/common/Header.jsx`

```javascript
import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

export default function Header({ 
  currentUser, 
  showNotifications, 
  setShowNotifications,
  unreadCount 
}) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* ... header content ... */}
    </header>
  );
}
```

#### 2.2 BottomNav Component  
**Create:** `src/components/common/BottomNav.jsx`

```javascript
import React from 'react';
import { LayoutDashboard, Calendar, CheckSquare, Users, TrendingUp, Tag } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [ ... ];
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 ...">
      {/* ... navigation content ... */}
    </nav>
  );
}
```

#### 2.3 NotificationsPanel Component
**Create:** `src/components/common/NotificationsPanel.jsx`

---

### Phase 3: Extract View Components

#### 3.1 Dashboard View
**Create:** `src/components/Dashboard.jsx`

Move the entire `Dashboard` component from App.jsx

#### 3.2 Events View
**Create:** `src/components/events/EventsView.jsx`

#### 3.3 Tasks View
**Create:** `src/components/tasks/TasksView.jsx`

#### 3.4 Team View
**Create:** `src/components/team/TeamView.jsx`

#### 3.5 Analytics View
**Create:** `src/components/AnalyticsView.jsx`

#### 3.6 Vendors View
**Create:** `src/components/vendors/VendorsView.jsx`

---

### Phase 4: Extract Modal Components

#### 4.1 Event Modals
- **Create:** `src/components/modals/NewEventModal.jsx`
- **Create:** `src/components/modals/EventDetailModal.jsx`

#### 4.2 Task Modals
- **Create:** `src/components/modals/NewTaskModal.jsx`
- **Create:** `src/components/modals/TaskDetailModal.jsx`

#### 4.3 Team Modals
- **Create:** `src/components/modals/NewWorkerModal.jsx`
- **Create:** `src/components/modals/WorkerDetailModal.jsx`

#### 4.4 Vendor Modals
- **Create:** `src/components/modals/VendorDetailModal.jsx`

---

### Phase 5: Extract Utility Functions

**Create:** `src/utils/formatters.js`

```javascript
export const formatCurrency = (amount) => {
  return `₹${(amount / 100000).toFixed(1)}L`;
};

export const formatDate = (dateString) => {
  // ... date formatting logic
};
```

**Create:** `src/utils/calculations.js`

```javascript
export const calculateBudgetUtilization = (spent, budget) => {
  return budget > 0 ? (spent / budget) * 100 : 0;
};

export const getTasksByStatus = (tasks, status) => {
  return tasks.filter(t => t.status === status);
};
```

---

### Phase 6: Create Custom Hooks

**Create:** `src/hooks/usePermissions.js`

```javascript
import { useMemo } from 'react';

export function usePermissions(userRole) {
  return useMemo(() => ({
    canCreateEvent: ['owner', 'lead'].includes(userRole),
    canViewBudget: ['owner', 'lead'].includes(userRole),
    canApprove: ['owner', 'lead'].includes(userRole),
    canManageWorkforce: userRole === 'owner',
    isWorker: userRole === 'worker'
  }), [userRole]);
}
```

**Create:** `src/hooks/useNotifications.js`

```javascript
import { useState, useMemo } from 'react';

export function useNotifications(initialNotifications) {
  const [notifications, setNotifications] = useState(initialNotifications);
  
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  return { notifications, unreadCount, markAsRead, markAllRead };
}
```

---

## 🔄 Step-by-Step Restructuring Process

### Step 1: Extract Mock Data
1. Create `src/data/mockData.js`
2. Copy MOCK_DATA from App.jsx
3. Export it
4. Import in App.jsx
5. Test that app still works

### Step 2: Extract One Component at a Time
1. Start with simplest component (e.g., Header)
2. Copy component code to new file
3. Add proper imports
4. Export component
5. Import in App.jsx
6. Replace inline component with imported one
7. Test that it works
8. Repeat for next component

### Step 3: Clean Up App.jsx
After extracting components, App.jsx should look like:

```javascript
import React, { useState } from 'react';
import { MOCK_DATA } from './data/mockData';
import { usePermissions } from './hooks/usePermissions';
import { useNotifications } from './hooks/useNotifications';

import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import Dashboard from './components/Dashboard';
import EventsView from './components/events/EventsView';
// ... other imports

export default function App() {
  const [currentUser] = useState(MOCK_DATA.currentUser);
  const [activeTab, setActiveTab] = useState('dashboard');
  // ... other state
  
  const permissions = usePermissions(currentUser.role);
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications(MOCK_DATA.notifications);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser}
        notifications={notifications}
        unreadCount={unreadCount}
        // ... other props
      />
      
      <main className="max-w-7xl mx-auto px-4 py-4">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'events' && <EventsView />}
        {/* ... other views */}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
```

---

## 📦 Final Folder Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── BottomNav.jsx
│   │   ├── NotificationsPanel.jsx
│   │   └── Sidebar.jsx
│   ├── events/
│   │   ├── EventsView.jsx
│   │   ├── EventCard.jsx
│   │   └── EventFilters.jsx
│   ├── tasks/
│   │   ├── TasksView.jsx
│   │   ├── TaskCard.jsx
│   │   └── TaskFilters.jsx
│   ├── team/
│   │   ├── TeamView.jsx
│   │   ├── WorkerCard.jsx
│   │   └── WorkerStats.jsx
│   ├── vendors/
│   │   ├── VendorsView.jsx
│   │   └── VendorCard.jsx
│   ├── modals/
│   │   ├── NewEventModal.jsx
│   │   ├── NewTaskModal.jsx
│   │   ├── NewWorkerModal.jsx
│   │   ├── TaskDetailModal.jsx
│   │   ├── WorkerDetailModal.jsx
│   │   ├── VendorDetailModal.jsx
│   │   └── EventDetailModal.jsx
│   ├── Dashboard.jsx
│   └── AnalyticsView.jsx
├── data/
│   └── mockData.js
├── hooks/
│   ├── usePermissions.js
│   ├── useNotifications.js
│   └── useFilters.js
├── utils/
│   ├── formatters.js
│   ├── calculations.js
│   └── constants.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🚀 Benefits of This Structure

1. **Modularity** - Each component has a single responsibility
2. **Reusability** - Components can be reused across the app
3. **Maintainability** - Easy to find and fix bugs
4. **Scalability** - Easy to add new features
5. **Testability** - Each component can be tested independently
6. **Team Collaboration** - Multiple developers can work on different components
7. **Code Organization** - Clear structure makes navigation easy

---

## ⚠️ Important Notes

- **Don't rush** - Restructure one component at a time
- **Test frequently** - Run the app after each extraction
- **Keep git history** - Commit after each successful extraction
- **Use TypeScript (optional)** - Consider migrating to .tsx files for better type safety
- **Add PropTypes** - Document expected props for each component
- **Write tests** - Add unit tests as you extract components

---

## 🎓 Learning Resources

- [React Component Best Practices](https://react.dev/learn/thinking-in-react)
- [Project Structure Guide](https://react.dev/learn/start-a-new-react-project)
- [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

## 📝 Next Steps After Restructuring

1. **Add API Integration** - Replace mock data with real API calls
2. **Add State Management** - Consider Redux, Zustand, or Context API
3. **Add Routing** - Use React Router for multi-page navigation
4. **Add Authentication** - Implement user login/logout
5. **Add Tests** - Write unit and integration tests
6. **Add Documentation** - Document each component with JSDoc
7. **Performance Optimization** - Add code splitting, lazy loading
8. **Deploy** - Deploy to Vercel, Netlify, or other hosting

---

Good luck with your restructuring! 🚀
