# PlaniT -- Frontend

PlaniT is a full-scale event management system built to simulate a
real-world production SaaS platform. It manages events, clients,
vendors, tasks, budgets, expenses, and audit logs with proper role-based
permissions and structured workflows.

This repository contains the **React frontend application**.

------------------------------------------------------------------------

## 🚀 Overview

PlaniT allows organizations to:

-   Create and manage events
-   Track budgets and expenses per event
-   Assign and manage vendors
-   Create and monitor tasks
-   Maintain client records
-   Enforce granular permissions
-   Maintain audit logs for critical actions

The frontend is built with scalability, maintainability, and
production-level patterns in mind.

------------------------------------------------------------------------

## 🧱 Tech Stack

-   React
-   Redux Toolkit
-   React Router
-   Axios
-   Framer Motion
-   Custom Permission System
-   Feature-driven modular architecture

Backend API: Node.js + Express (separate repository)

------------------------------------------------------------------------

## 🏗 Architecture

Feature-driven modular structure:

src/ ├── app/ \# Redux store configuration ├── features/ \# Domain
modules (events, clients, vendors, etc.) ├── components/ \# Reusable UI
components ├── pages/ \# Route-level components ├── hooks/ \# Custom
hooks ├── services/ \# API abstraction layer ├── utils/ \# Utilities └──
ui/ \# Motion + base UI components

Each domain encapsulates: - Slice - Thunks - Selectors - UI Components

This promotes scalability and clean separation of concerns.

------------------------------------------------------------------------

## 🔐 Authentication & Authorization

-   JWT-based authentication
-   Role-Based Access Control (RBAC)
-   Permission-based UI gating
-   Backend-enforced authorization (defense in depth)

Unauthorized UI elements are hidden, but all permissions are strictly
validated server-side.

------------------------------------------------------------------------

## 📊 Core Features

### Event Management

-   Create, update, delete events
-   Soft vs hard delete logic
-   Event-based budget tracking
-   Vendor & task associations

### Client Management

-   CRUD operations
-   Event association
-   Contact tracking

### Vendor Management

-   Vendor assignment to events
-   Cost tracking
-   Expense logging

### Budget & Expense Tracking

-   Allocated event budgets
-   Expense recording
-   Remaining budget calculation
-   Financial visibility per event

### Task Management

-   Event-based tasks
-   Status tracking
-   Workflow monitoring

### Audit Logs

-   Logs sensitive actions
-   Tracks user, action, and timestamp
-   Ensures transparency and traceability

------------------------------------------------------------------------

## 🌍 Environment Variables

Create a .env file:

VITE_API_BASE_URL=http://localhost:5000/api

------------------------------------------------------------------------

## 🛠 Installation

git clone `<frontend-repo>`{=html} cd planit-frontend npm install npm
run dev

------------------------------------------------------------------------

## 🧪 Future Improvements

-   Unit testing coverage
-   Integration tests with MSW
-   Real-time updates (WebSockets)
-   Analytics dashboard
-   Theming system (dark/light mode)

------------------------------------------------------------------------

## 🧠 Purpose

PlaniT demonstrates:

-   Scalable frontend architecture
-   Complex relational data handling
-   Real-world permission systems
-   Financial logic representation
-   Production-grade CRUD workflows
