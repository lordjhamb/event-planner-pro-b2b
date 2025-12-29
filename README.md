# Event Planner Pro

**Event Planner Pro** is a comprehensive, production-ready B2B event management application designed for modern event planning agencies. It unifies task management, workforce coordination, inventory tracking, and financial oversight into a single, mobile-responsive platform.

Built with **React**, **Tailwind CSS**, and **Supabase**, and mobile-ready via **Capacitor**.

## 🚀 Key Features

- **🏆 Comprehensive Event Management**: detailed tracking of Weddings and corporate events with support for nested sub-events (e.g., Sangeet, Haldi).
- **📝 Smart Task Board**: Kanban and List views for managing thousands of tasks with priority, dependencies, and approval workflows.
- **📦 Inventory Control**: Real-time tracking of owned stock with check-in/check-out workflows and QR code potential.
- **💰 Financial Intelligence**: Integrated budget vs. actuals tracking, expense logging, and profit margin analysis.
- **👥 Team & Vendor CRM**: Manage freelance workforce schedules and vendor databases with performance ratings.
- **📱 Mobile Native**: Fully responsive design wrapped with Capacitor for a native Android/iOS experience for ground staff.

## 🛠️ Tech Stack

- **Frontend Builder:** [Vite](https://vitejs.dev/)
- **Framework:** [React 18](https://react.dev/)
- **UI System:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend/DB:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Mobile Runtime:** [Capacitor](https://capacitorjs.com/)
- **Analytics:** [Recharts](https://recharts.org/)

## 📂 Project Structure

```bash
src/
├── components/
│   ├── events/       # Event cards, lists, detail views
│   ├── layout/       # Sidebar, Header, Mobile Nav
│   ├── modals/       # All pop-up forms (New Task, Inventory Request)
│   ├── tasks/        # Kanban board, task list components
│   └── ...
├── context/          # React Context (Auth, Data, Toast)
├── data/             # Static templates and mock fallback data
├── pages/            # Main route views (Dashboard, Finance, Inventory)
└── utils/            # Helper functions (Formatters, Date logic)
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-planner-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory (or use `cred.env` as a reference) and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The app will typically run at `http://localhost:5173`.

## 📱 Mobile Sync (Capacitor)

To sync changes to the native Android project:

1. **Build the web assets**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor**
   ```bash
   npx cap sync
   ```

3. **Open Android Studio**
   ```bash
   npx cap open android
   ```

## 🏗️ Database Setup
The database schema is managed via Supabase. You can find the full schema definition in `supabase_schema.sql`. Run this SQL script in your Supabase SQL Editor to set up all necessary tables, relationships, and Row Level Security (RLS) policies.

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License.
