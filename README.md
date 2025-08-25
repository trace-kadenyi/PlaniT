# PlaniT

PlaniT is a comprehensive event planning management system built with the MERN stack (MongoDB, Express, React, Node.js). It is designed to help event planners manage tasks, clients, budgets, and events efficiently, all in one platform.

---

## Features

- **Event Management**: Create, update, and track events with detailed information.
- **Task Management**: Assign, monitor, and complete tasks related to events.
- **Budgeting Tools**: Track expenses and budgets for events.
- **Client Management**: Store client information and link clients to specific events.
- **Redux State Management**: Centralized state for a scalable, maintainable application.
- **Responsive Frontend**: User-friendly interface built with React.
- **Backend API**: RESTful API built with Express and Node.js, connected to MongoDB.

---

## Tech Stack

- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **State Management**: Redux Toolkit
- **Authentication & Authorization**: JWT (planned for future release)

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/planit.git
   cd planit
   ```

2. **Install dependencies**

   - Frontend
     ```bash
     cd client
     npm install
     ```
   - Backend

     ```bash
     cd server
     npm install
     ```

     3. **Setup environment variables**

   - Create a `.env` file in the `server` folder:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

3. **Run the application**
   - Start backend:
     ```bash
     cd server
     npm run dev
     ```
   - Start frontend:
     ```bash
     cd client
     npm start
     ```
4. **Run the application**

   - Start backend:
     ```bash
     cd server
     npm start
     ```
   - Start frontend:
     ```bash
     cd client
     npm run dev
     ```

5. Open your browser at `http://localhost:4000`.

---

## Folder Structure

```
planit/
├── client/          # React frontend
│   ├── src/
│   └── public/
├── server/          # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
├── .gitignore
├── package.json
└── README.md
```

## Usage

- **Dashboard**: View all upcoming events and tasks.
- **Events**: Add or edit events with details such as date, location, client, and status.
- **Tasks**: Assign tasks to events, track progress, and mark completion.
- **Clients**: Maintain client information and view associated events.
- **Budgeting**: Monitor and manage event budgets efficiently.

---

## Future Enhancements

- User authentication and roles (admin, planner, guest)
- Email notifications and reminders
- Analytics and reporting dashboards
- File uploads for event-related documents
- Enhanced mobile responsiveness

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a pull request

---