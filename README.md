# EventFlow - Event Planning Management System

A comprehensive event planning and management application built with React, designed for event planners to manage multiple events, tasks, teams, and budgets efficiently.

## 🚀 Features

### Core Features
- **Multi-Event Management** - Handle multiple events simultaneously
- **Task Management** - Create, assign, and track tasks with approval workflows
- **Team Management** - Manage workers, leads, and team assignments
- **Vendor Management** - Track and manage event vendors
- **Budget Tracking** - Monitor budgets, spending, and utilization
- **Role-Based Access** - Owner, Lead, and Worker roles with different permissions
- **Notifications** - Real-time notifications for approvals, deadlines, and updates
- **Analytics Dashboard** - Track event performance, team metrics, and financials

### User Roles
- **Owner** - Full access to all features including budget and analytics
- **Lead** - Can manage events, approve tasks, and view team performance
- **Worker** - Can update task status and view assigned tasks

## 🛠️ Tech Stack

- **React** 18.x
- **Lucide React** - Icon library
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/event-planner-pro.git
cd event-planner-pro
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 🏗️ Project Structure

```
event-planner-pro/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/      # Common UI components
│   │   ├── events/      # Event-related components
│   │   ├── tasks/       # Task-related components
│   │   ├── team/        # Team management components
│   │   └── modals/      # Modal dialogs
│   ├── data/            # Mock data and constants
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 📝 Usage

### Default Login
- **Username:** Priya Sharma (Owner)
- **Role:** Owner (Full access)

### Creating an Event
1. Click "New Event" button on dashboard
2. Fill in event details (name, client, date, budget)
3. Assign team members
4. Create and assign tasks

### Managing Tasks
1. Navigate to Tasks tab
2. Create tasks with descriptions and deadlines
3. Assign to workers
4. Workers update status
5. Leads/Owners approve completed tasks

### Approval Workflow
- Workers mark tasks as "Submitted for Approval"
- Tasks requiring >₹50k budget need owner approval
- Leads can approve tasks under ₹50k
- Owners get notifications for high-budget approvals

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=EventFlow
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Built with React and Vite
- Icons by Lucide React
- Styled with Tailwind CSS

## 📧 Support

For support, email support@eventflow.com or open an issue on GitHub.
