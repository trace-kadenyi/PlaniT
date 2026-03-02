> 🎨 This repository contains the Frontend application for PlaniT.  
> For backend implementation and full API documentation, see: https://github.com/trace-kadenyi/PlaniT-API.git

# PlaniT - Full Stack Event Management System

PlaniT is a SaaS event management platform built on the MERN stack.

It enables organizations to manage events, vendors, budgets, tasks, and operational workflows within a secure, role-based architecture, while delivering scalable system design, financial integrity enforcement, and granular access control across multi-organization environments.

------------------------------------------------------------------------


## 🌍 Live Architecture Overview

PlaniT is split into two independent repositories:

-   **Frontend (React + Redux Toolkit)**
-   **Backend API (Node.js + Express + MongoDB)**

This separation mirrors real-world production environments where
frontend and backend are deployed independently.

------------------------------------------------------------------------

# 🚀 Why PlaniT Exists

PlaniT was built to demonstrate:

-   Real-world relational data modeling in MongoDB
-   Secure JWT authentication and RBAC authorization
-   Financial constraint enforcement (budget vs expenses)
-   Soft vs hard deletion strategies
-   Audit logging for accountability
-   Modular frontend architecture with scalable state management
-   Clean layered backend architecture

This is not a CRUD tutorial project.\
It is structured intentionally to resemble a production SaaS system.

------------------------------------------------------------------------

# 🧱 Tech Stack

### Frontend

-   React
-   Redux Toolkit
-   React Router
-   Axios
-   Framer Motion

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT Authentication
-   Middleware-based RBAC

------------------------------------------------------------------------

# 🗂 System Modules

-   Organizations
-   Users
-   Events
-   Clients
-   Vendors
-   Tasks
-   Budgets
-   Expenses
-   Audit Logs

------------------------------------------------------------------------

# 🔐 Authentication & Authorization

### Authentication

-   JWT issued at login
-   Token-based API access
-   Secure middleware verification

### Authorization

-   Role-Based Access Control
-   Resource-level permission checks
-   Action-based enforcement (create, read, update, delete)
-   Defense-in-depth (validated both frontend & backend)

------------------------------------------------------------------------

# 💰 Financial Logic Enforcement

PlaniT enforces financial constraints server-side:

-   Expenses cannot exceed allocated event budget
-   Aggregation queries calculate total expenses
-   Remaining budget is derived dynamically
-   Validation occurs in service layer (not controller)

This ensures financial data integrity.

------------------------------------------------------------------------

# 🧾 Audit Logging

Every critical mutation logs:

-   User ID
-   Resource affected
-   Action performed
-   Timestamp
-   Optional metadata

This enables traceability and production-grade accountability.

------------------------------------------------------------------------

# 📡 API Documentation (Swagger-Style Overview)

Base URL:

    /api

## 🔑 Authentication

### POST /auth/login

Authenticates user and returns JWT.

Request:

    {
      "email": "user@example.com",
      "password": "password"
    }

Response:

    {
      "token": "<jwt_token>"
    }

------------------------------------------------------------------------

## 📅 Events

### POST /events

Create new event.

### GET /events

Retrieve all accessible events.

### GET /events/:id

Retrieve specific event.

### PATCH /events/:id

Update event.

### DELETE /events/:id

Soft delete (hard delete for elevated roles).

------------------------------------------------------------------------

## 👥 Clients

### POST /clients

### GET /clients

### PATCH /clients/:id

### DELETE /clients/:id

------------------------------------------------------------------------

## 🏢 Vendors

### POST /vendors

### GET /vendors

### PATCH /vendors/:id

### DELETE /vendors/:id

------------------------------------------------------------------------

## 💵 Expenses

### POST /expenses

Creates expense and validates budget limit.

### GET /expenses?eventId=

Retrieve expenses for event.

------------------------------------------------------------------------

## 📝 Tasks

### POST /tasks

### GET /tasks?eventId=

### PATCH /tasks/:id

### DELETE /tasks/:id

------------------------------------------------------------------------

# 📸 Screenshots

> Add application screenshots below.

### Dashboard

![Dashboard Screenshot](./screenshots/dashboard.png)

### Event Detail View

![Event Detail Screenshot](./screenshots/event-detail.png)

### Budget & Expense View

![Budget Screenshot](./screenshots/budget.png)

### Vendor Management

![Vendor Screenshot](./screenshots/vendors.png)

------------------------------------------------------------------------

# 🛠 Local Development

## Clone Repositories

Frontend:

    git clone <frontend-repo-url>

Backend:

    git clone <backend-repo-url>

------------------------------------------------------------------------

## Backend Setup

    cd planit-backend
    npm install
    npm run dev

Create `.env` file:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret
    CLIENT_URL=http://localhost:5173

------------------------------------------------------------------------

## Frontend Setup

    cd planit-frontend
    npm install
    npm run dev

Create `.env` file:

    VITE_API_BASE_URL=http://localhost:5000/api

------------------------------------------------------------------------

# 🧪 Future Improvements

-   Docker containerization
-   CI/CD pipeline
-   Full test coverage (unit + integration)
-   API documentation via Swagger UI
-   Role hierarchy expansion
-   Real-time updates via WebSockets

------------------------------------------------------------------------

# 🧠 Engineering Philosophy

PlaniT was designed with:

-   Separation of concerns
-   Maintainable architecture
-   Production-oriented thinking
-   Defensive programming practices
-   Scalability in mind

It reflects how a real-world internal operations platform would be
structured.

------------------------------------------------------------------------

# 📎 Repository Links

Frontend Repository: `<link-to-frontend>`{=html}

Backend Repository: `<link-to-backend>`{=html}

------------------------------------------------------------------------

# 👤 Author

Built as a full-stack portfolio project to demonstrate professional
engineering standards across both frontend and backend systems.
