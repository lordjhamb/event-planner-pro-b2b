# Product Requirements Document (PRD)
# Event Planner Pro

> **Version:** 1.0
> **Status:** Active
> **Last Updated:** 2025-12-30

## 1. Executive Summary
**Event Planner Pro** is a comprehensive B2B event management platform designed to streamline the operations of event planning agencies. It serves as a unified command center for managing complex events (specifically weddings), coordinating large workforce teams, tracking inventory, and monitoring financial health. The platform is built as a generic web application that is wrapped into a native mobile experience using Capacitor, ensuring accessibility for on-ground staff.

## 2. Problem Statement
Event planning agencies struggle with fragmented tools—using spreadsheets for finance, WhatsApp for communication, and paper checklists for tasks. This leads to:
- Lack of real-time visibility into event progress.
- Inventory loss and mismanagement.
- Communication gaps between office managers and ground staff.
- Difficulty in tracking real-time budget vs. actuals.

## 3. Product Goals
- **Centralize Operations:** Bring tasks, team, finance, and inventory into one dashboard.
- **Mobile First Ground Operations:** Enable ground staff to view tasks, checklists, and inventory via a mobile app.
- **Real-time Synchronization:** Ensure all stakeholders see the latest data instantly.
- **Scalability:** Support multiple concurrent large-scale events (e.g., weddings with multiple sub-events).

## 4. User Personas

### 4.1 Agency Owner / Admin
- **Needs:** High-level dashboard, financial overview, workforce allocation, master setting controls.
- **Key Features:** Analytics Dashboard, Finance Module, User Role Management.

### 4.2 Lead Planner (Manager)
- **Needs:** Event timeline management, task delegation, vendor coordination, budget enforcement.
- **Key Features:** Event Details, Task Board, Vendor Management, Budget Tracking.

### 4.3 Ground Worker / Staff
- **Needs:** Clear daily task lists, inventory requests, simple status updates.
- **Key Features:** My Tasks, Inventory Request, Chat.

## 5. Functional Requirements

### 5.1 Event Management
- **Hierarchical Structure:**
  - **Wedding/Project:** The top-level entity (e.g., "Sharma-Patel Wedding").
  - **Sub-Events:** Discrete events within the project (e.g., Sangeet, Mehndi, Reception).
- **CRUD Operations:** Create, read, update, delete events and sub-events.
- **Templates:** Ability to spawn events from predefined templates (e.g., "Punjabi Wedding" template auto-creates standard sub-events and tasks).

### 5.2 Task Management
- **Task Views:** Kanban Board and List View.
- **Task Details:** Description, due dates, priority, attachments (planned), and sub-checklists.
- **Assignment:** Assign tasks to specific workers or specific vendors.
- **Approval Workflow:** Critical tasks require Owner/Lead approval before marking complete.

### 5.3 Inventory Management
- **Item Catalog:** Database of owned items (lights, sound gear, decor).
- **Tracking:** Track available vs. total quantity.
- **Requests:** Workers request items for specific events/tasks.
- **Transactions:** Check-in/Check-out logging with timestamp and user attribution.

### 5.4 Finance & Budgeting
- **Budgeting:** Set budgets at Project, Event, and Task levels.
- **Expense Tracking:** Log payments to vendors, flexible expenses, and petty cash.
- **Income Tracking:** Record client payments and milestones.
- **Analytics:** Real-time "Spends vs. Budget" visualization.

### 5.5 Team & Vendor Management
- **Workforce Database:** Manage permanent and freelance staff with roles and skills.
- **Vendor CRM:** Database of supplier details, ratings, and service categories.
- **Availability:** Track who is free for upcoming dates.

### 5.6 Communication
- **Contextual Chat:** Messaging threads tied specifically to a Wedding or Event.
- **System Notifications:** Auto-alerts for task assignments, inventory approvals, and budget overruns.

## 6. Technical Specifications

### 6.1 Tech Stack
- **Frontend Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS + Lucide React Icons
- **Language:** JavaScript (ES Modules)
- **Mobile Wrapper:** Capacitor (Android/iOS)
- **State Management:** React Context (Auth, Data, Toast)
- **Charting:** Recharts

### 6.2 Data Architecture (Supabase)
- **Database:** PostgreSQL
- **Auth:** Supabase Auth (Row Level Security enforced)
- **Real-time:** Supabase Realtime subscriptions (planned)

### 6.3 Key Tables
- `profiles`: User identity extensions.
- `weddings`: Parent projects.
- `events`: Sub-events linked to weddings.
- `tasks`: Core unit of work.
- `inventory_items` & `inventory_transactions`: Asset tracking.
- `finance_transactions`: Ledger.

## 7. User Flow (Example: New Wedding)
1. **Owner** logs in and navigates to "Events".
2. Clicks "New Event" and selects "Wedding Template: Punjabi".
3. System auto-generates the "Sharma Wedding" with 5 sub-events (Sangeet, Wedding, etc.) and 200 standard tasks.
4. **Owner** assigns a **Lead Planner** to the wedding.
5. **Lead Planner** adjusts dates and assigns specific tasks to **Workers**.
6. **Worker** logs in on mobile, sees "Setup Stage" task, requests "10 LED Pars" from Inventory.
7. **Inventory Manager** approves request.
8. **Worker** completes setup and marks task "Done".

## 8. Future Roadmap
- **Client Portal:** specific view for clients to see progress and RSVP status.
- **AI Planning Assistant:** Suggest vendors based on budget and style.
- **Offline Mode:** Robust offline support for remote venue locations.
- **WhatsApp Integration:** Automated notifications to staff/vendors via WhatsApp API.
