import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to PlaniT, {user?.firstName}!</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <nav className="dashboard-nav">
        <Link to="/events" className="nav-link">
          Events Management
        </Link>
        <Link to="/tasks" className="nav-link">
          Task Management
        </Link>
        <Link to="/expenses" className="nav-link">
          Expense Tracking
        </Link>
        <Link to="/clients" className="nav-link">
          Client Management
        </Link>
        <Link to="/vendors" className="nav-link">
          Vendor Management
        </Link>
      </nav>

      <div className="dashboard-content">
        <p>Role: {user?.role}</p>
        <p>Email: {user?.email}</p>
        {/* Add your dashboard widgets/stats here */}
      </div>
    </div>
  );
};

export default Dashboard;