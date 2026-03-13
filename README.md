[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux)](https://redux-toolkit.js.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

> 🎨 This repository contains the Frontend application for PlaniT.
> For backend implementation and full API documentation, see: https://github.com/trace-kadenyi/PlaniT-API

# PlaniT — Full Stack Event Management System

PlaniT is a SaaS event management platform that gives organizations a clean, role-aware interface for managing events, vendors, budgets, and tasks — with real-time financial tracking, expense audit logs, and team collaboration built in. The UI supports both dark and light mode across all views.

---

## 🌍 Architecture Overview

PlaniT is split into two independent repositories, enabling separate development, deployment, and scaling:

| Repository | Stack |
|---|---|
| **Frontend** (this repo) | React, Redux Toolkit, React Router, Tailwind CSS |
| **Backend API** | Node.js, Express.js, MongoDB, Mongoose, JWT |

---

## 🧱 Tech Stack

| Technology | Role |
|---|---|
| **React** | UI component library and rendering |
| **Redux Toolkit** | Global state management — auth, events, users, expenses |
| **React Router** | Client-side routing and protected route handling |
| **Axios** | HTTP client for all API communication |
| **Tailwind CSS** | Utility-first styling with dark/light mode support |
| **Framer Motion** | Page transitions and UI animations |
| **Supabase** | Expense receipt storage |

---

## ✨ Features

- **Role-based UI** — components and actions render conditionally based on the authenticated user's role and permissions
- **Dark & light mode** — full theme support across all views
- **Financial tracking** — live budget vs. expense status per event with over-budget warnings
- **Expense audit log** — full history of expense mutations with user attribution
- **Team management** — invite, update roles, deactivate and reactivate users
- **Archive & restore** — soft deletion flow for events, clients, and vendors
- **Protected routes** — unauthenticated users are redirected; unauthorized roles see restricted views

---

## 🔐 Auth & State Management

### Client-side Auth Flow

- JWT access token stored in memory; refresh token handled via httpOnly cookie
- Silent token renewal runs automatically via Axios interceptors on 401 responses
- Auth state is managed in a dedicated Redux slice and persisted across page refreshes via the refresh token flow
- Protected routes check auth state before rendering; unauthorized roles are redirected

### State Structure

Redux Toolkit slices are organized by domain:

- `authSlice` — user session, role, and token state
- `eventsSlice` — event list, selected event, loading/error states
- `expensesSlice` — expenses per event, budget status, audit logs
- `usersSlice` — organization members and role management
- `clientsSlice` / `vendorsSlice` / `tasksSlice` — respective resource state

---

## 📸 Screenshots

### Dashboard

<p align="center">
  <img src="./public/screenshots/dashboard-dark.png" width="48%" />
  <img src="./public/screenshots/dashboard-light.png" width="48%" />
</p>

Overview of active events, upcoming tasks, and key metrics at a glance.

### Events Board

<p align="center">
  <img src="./public/screenshots/eventsboard-dark.png" width="48%" />
  <img src="./public/screenshots/eventsboard-light.png" width="48%" />
</p>

Browse, filter, archive, and manage all organization events.

### Task Board

<p align="center">
  <img src="./public/screenshots/taskboard-dark.png" width="48%" />
  <img src="./public/screenshots/taskboard-light.png" width="48%" />
</p>

Track tasks tied to specific events with status updates.

### Event Details

<p align="center">
  <img src="./public/screenshots/eventdetails-dark.png" width="48%" />
  <img src="./public/screenshots/eventdetails-light.png" width="48%" />
</p>

Deep-dive into a single event — linked clients, vendors, budget, and tasks in one view.

### Budget & Expenses

<p align="center">
  <img src="./public/screenshots/budget_&_expenses-dark.png" width="48%" />
  <img src="./public/screenshots/budget_&_expenses-light.png" width="48%" />
</p>

Live budget tracking with running totals, remaining budget, and over-budget alerts.

### Expense Audit Log

<p align="center">
  <img src="./public/screenshots/expenseauditlog-lightmode.PNG" width="48%" />
  <img src="./public/screenshots/expense audit log - dark mode.PNG" width="48%" />
</p>

Full mutation history for expenses — who changed what and when.

### Team Management

<p align="center">
  <img src="./public/screenshots/user-management-dark.png" width="48%" />
  <img src="./public/screenshots/user-management-light.png" width="48%" />
</p>

Invite team members, assign roles, and manage account status.

### User Profile

<p align="center">
  <img src="./public/screenshots/user-profile-dark.png" width="48%" />
  <img src="./public/screenshots/user-profile-light.png" width="48%" />
</p>

Personal profile management with update history.

### Client Directory

<p align="center">
  <img src="./public/screenshots/client-darkmode.png" width="48%" />
  <img src="./public/screenshots/client-lightmode.png" width="48%" />
</p>

Searchable client directory with linked event history per client.

### Vendor Directory

<p align="center">
  <img src="./public/screenshots/vendor-darkmode.png" width="48%" />
  <img src="./public/screenshots/vendor-lightmode.png" width="48%" />
</p>

Manage vendors, view stats, and archive inactive records.

---

## 🛠 Local Development

### Prerequisites

- Node.js v18+
- PlaniT backend API running locally on port 4000

### Setup

```bash
git clone https://github.com/trace-kadenyi/PlaniT.git
cd PlaniT
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🧪 Roadmap

- [ ] Skeleton loading states for improved perceived performance
- [ ] Mobile-responsive layouts
- [ ] E2E test coverage with Cypress
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Real-time updates via WebSockets
- [ ] Role hierarchy expansion for more granular UI permissions
- [ ] Notification system for budget alerts and task deadlines

---

## 🧠 Engineering Philosophy

- Component-driven architecture with clear separation between UI and state logic
- Auth and permission checks co-located with routing, not scattered across components
- Financial validation enforced on the server — the UI reflects state, never trusts it
- Modular Redux slices designed to scale with new resource types
- Consistent UX patterns across all CRUD flows regardless of resource type

---

## 📎 Repositories

- **Frontend:** [PlaniT](https://github.com/trace-kadenyi/PlaniT)
- **Backend API:** [PlaniT-API](https://github.com/trace-kadenyi/PlaniT-API)

---

## 👤 Author

### Tracey Kadenyi

📧 [treykadenyi@gmail.com](mailto:treykadenyi@gmail.com) &nbsp;•&nbsp; 💻 [GitHub](https://github.com/trace-kadenyi) &nbsp;•&nbsp; 🔗 [LinkedIn](https://www.linkedin.com/in/tracey-kadenyi/) &nbsp;•&nbsp; ✍🏽 [Medium](https://medium.com/@tracekadenyi) &nbsp;•&nbsp; 🌐 [Website](https://tracey-kadenyi.vercel.app/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
