# Event Planner Pro - Feature Document & User Journey

> **Version:** 1.0
> **Last Updated:** 2026-02-02

## 1. Introduction
This document outlines the key features of **Event Planner Pro**, detailing the user journey for each and explaining how to use them effectively. It is designed for developers, product managers, and end-users to understand the platform's capabilities.

## 2. Onboarding & Authentication
The platform serves multiple user roles (Agency Owner, Lead Planner, Ground Worker) and supports Organization-based workspaces.

### 2.1. Sign Up & Organization Setup
*   **User Journey:**
    1.  User selects **"Create New"** to start a new event planning agency workspace.
    2.  Enters **Full Name**, **Mobile Number**, **Email**, **Password**, and **Organization Name**.
    3.  System creates a new Organization and assigning the user as **Owner**.
    *   *Alternative:* User selects **"Join Existing"** and enters an **Organization Code** (provided by an admin) to join an existing team as a **Worker**.

### 2.2. Login
*   **Methods:**
    *   **Email & Password:** Standard login for all users.
    *   **Mobile OTP:** Users can sign in by verifying a One-Time Password sent to their registered mobile number.
*   **Features:**
    *   **Role-Based Access:** The dashboard adapts based on the user's role (Owner, Lead, or Worker).
    *   **Demo Access:** Quick login buttons available for testing different personas.

## 3. Dashboard (Analytics & Overview)
The Dashboard serves as the central command center, providing a high-level overview of the agency's operations.

### 3.1. Key Performance Indicators (KPIs)
*   **Active Events:** Count of currently running or upcoming weddings and standalone events.
*   **In Progress:** Number of tasks currently being worked on.
*   **Open Issues / Overdue:**
    *   *Managers (Owner/Lead):* See "Open Issues" (Blocked tasks, Rejections, Help Requests).
    *   *Workers:* See "Overdue" tasks assigned to them.
*   **Upcoming:** Tasks due in the next 7 days.

### 3.2. Quick Actions
*   **New Event:** Create a new wedding or standalone event (Admin/Lead only).
*   **New Task:** Quickly add a task to an existing event.
*   **Calendar:** Jump to the calendar view.

### 3.3. Active Events Stream
*   A horizontal scroll view of all active **Weddings** and **Standalone Events**.
*   Clicking an event card navigates to the detailed **Event View**.

### 3.4. Recent Tasks
*   List of the 5 most recent tasks across all events.
*   Displays task priority, due date, assignee, and associated event.


## 4. Event Management
The core of the application revolves around managing events, which can be standalone or grouped under a Wedding.

### 4.1. Event Creation
*   **User Journey:**
    1.  Click **"New Event"** on Dashboard or Events page.
    2.  **Wedding Wizard:** For weddings, users select a template (e.g., "Royal Rajasthan"), and the system automatically generates a suite of sub-events (Haldi, Sangeet, Wedding).
    3.  **Standalone Event:** For single milestones (e.g., Corporate Party), users fill a simple form.

### 4.2. Event Hierarchy
*   **Weddings:** Displayed as "Wedding Cards" showing overall progress, total budget, and a list of sub-events.
*   **Sub-Events & Standalone:** Displayed as individual cards.
*   **Event Detail View:** The central hub for a specific event with tabs:
    *   **Info:** Overview, dates, and location.
    *   **Finance:** Budget tracking and transactions.
    *   **Tasks:** Event-specific task list.
    *   **Timeline:** Day-of schedule.
    *   **Inventory:** Equipment allocation.

## 5. Task Management
A system for creating, assigning, and tracking work items with integrated verification.

### 5.1. Task Creation & Assignment
*   **Details:** Title, Description, Priority, Due Date.
*   **Assignment:** Assign to a team member or create a **Temp Worker** (Name + Phone) instantly.
*   **Subtasks:** Add checklist items for detailed steps.
*   **Advanced Controls:**
    *   **Budget/Vendor Flags:** Require worker to input actual cost or vendor used upon completion.
    *   **Approval:** Mark tasks as requiring Manager approval before closing.
    *   **Auto-Escalation:** If budget > ₹5L (configurable), approval is automatically forced to "Owner".

### 5.2. Workflow & Statuses
*   **Lifecycle:** `Open` → `In Progress` → `Submitted` → `Approved` / `Rejected`.
*   **Worker Actions:** Start task, Request Inventory, Submit (with required inputs).
*   **Manager Actions:** Approve completion, Reject (with reason), or Assign.
*   **Issues:** Workers can raise a **"Help Note"**, flagging the task for immediate attention.

### 5.3. Views
*   **List View:** Filter by status (Upcoming, Overdue) or type (Issues, My Tasks).
*   **Integrated:** Syncs with the Dashboard's "Recent Tasks" and KPI counters.

## 6. Inventory Management
A centralized system to track own equipment, props, and assets across multiple events.

### 6.1. Inventory Dashboard
*   **KPI Cards:**
    *   **Total SKUs:** Count of unique items.
    *   **Low Stock Alerts:** Items with <20% availability.
    *   **Total Asset Value:** Calculated as `Σ (Quantity * Unit Price)`.
*   **List View:**
    *   Searchable and filterable by Category (Furniture, Lighting, Sound, Decor, Tech).
    *   **Availability Bar:** Visual indicator of stock levels.

### 6.2. Movements & Logistics
*   **Check-Out:** Admin/Logistics manager "sends" items to a specific Event.
    *   *Inputs:* Quantity, Event, Notes (e.g., "Sent with Driver X").
    *   *Constraint:* Cannot check out more than available stock.
*   **Check-In:** Returning items from an event back to the warehouse.
*   **Requests:**
    *   Workers can request items for specific tasks (e.g., "Need 5 chairs for Mandap setup").
    *   Managers approve requests → Stock is decremented (Check-Out) → Item is marked as "Requested" for that task.

### 6.3. Tracking
*   **Item Details:** Shows usage history and current active requests.
*   **Optimization:** Prevents overbooking by tracking real-time availability across overlapping events.

## 7. Finance Management
A ledger system to track cash flow at both the Organization and Event levels.

### 7.1. Financial Overview
*   **KPIs:**
    *   **Total Income:** All client payments and sponsorships.
    *   **Total Expenses:** All vendor payments and operational costs.
    *   **Net Balance:** "Available Cash Flow" (Income - Expenses).
*   **Transactions Log:** searchable history of all financial movements.

### 7.2. Recording Transactions
*   **Types:**
    *   **Income:** Record Client Payments, Sponsorships, or Refunds.
    *   **Expense:** Log payments to venues, caterers, logistics, etc.
*   **Details:** Amount, Date, Payment Mode (Cash, UPI, Bank Transfer), and **Event Link** (mandatory).
*   **Categories:** Pre-defined categories for cleaner reporting (e.g., Catering, Decor, Marketing).

### 7.3. Event-Specific Finance
*(Accessible via Event Detail > Finance Tab)*
*   Tracks the budget vs. actual spend for a specific event.
*   Calculates profit margins for that specific project.

## 8. Team & Vendor Management

### 8.1. Team Management (Workforce)
*   **Directory:** Searchable list of all staff members.
*   **Roles:**
    *   **Owner:** Full access, financial control, organization management.
    *   **Team Lead:** Can manage tasks, events, and workers but restricted from high-level admin settings.
    *   **Worker:** Execution focus; sees only assigned tasks and relevant event info.
*   **Performance Stats:**
    *   **Workload:** Visual bar showing number of active tasks (Red if > 5).
    *   **Performance:** Percentage score based on task completion and feedback.
    *   **Availability:** Toggle status (Available/Busy) for better task assignment.
*   **Worker Profile:** Detailed view showing contact info (with direct WhatsApp link) and current task queue.

### 8.2. Vendor Directory
*   **Database:** Centralized list of external partners (Caterers, Decorators, etc.).
*   **Search & Filter:** Find vendors by category or name.
*   **Integration:** Vendors can be linked to specific tasks (e.g., "Pay Vendor X") for tracking purposes.

## 9. Profile & Settings

### 9.1. User Profile
*   **Personal Info:** Update contact details.
*   **Role Display:** Clear indication of current permission level.

### 9.2. Organization Management
*   **Invite Code:** Owners and Leads can generate/copy a unique **Organization Code**.
*   **Onboarding:** New staff members use this code during Sign Up to automatically join the correct team workspace.
