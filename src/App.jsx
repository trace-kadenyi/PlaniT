import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./redux/authSlice";

import "./App.css";
import AuthInitializer from "./components/user/AuthInitializer";
import Layout from "./components/navigation/Layout";
import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import ProtectedRoute from "./components/user/ProtectedRoute";
import HomePage from "./pages/HomePage";
import Footer from "./components/footer/Footer";
import Events from "./pages/Events";
import Event from "./pages/Event";
import Clients from "./pages/Clients";
import Client from "./pages/Client";
import Vendors from "./pages/Vendors";
import Vendor from "./pages/Vendor";
import EditEventForm from "./components/taskManagerCollection/events/forms/EditEventForm";
import CreateEventForm from "./components/taskManagerCollection/events/forms/CreateEventForm";
import EditClientForm from "./components/clients/forms/EditClientForm";
import CreateClientForm from "./components/clients/forms/CreateClientForm";
import EditVendorForm from "./components/vendors/forms/EditVendorForm";
import CreateVendorForm from "./components/vendors/forms/CreateVendorForm";
import TasksBoard from "./pages/TasksBoard";
import EventsBoard from "./pages/EventsBoard";
import useIsSmallScreen from "./globalHooks/useIsSmallScreen";
import Users from "./pages/Users";
import User from "./pages/User";
import EditUserProfile from "./pages/EditUserProfile";
import Dashboards from "./pages/Dashboards";

function App() {
  const dispatch = useDispatch();

  //  initialize auth
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const isSmallScreen = useIsSmallScreen();
  return (
    <>
      <AuthInitializer />

      {isSmallScreen ? (
        <Toaster position="top-center" />
      ) : (
        <Toaster position="top-right" />
      )}
      <Router>
        <Routes>
          {/* Public routes (no layout, no sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes with Layout (includes sidebar) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* All nested routes are automatically protected by the parent ProtectedRoute */}
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<Event />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<Client />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendors/:id" element={<Vendor />} />
            <Route path="/events/:id/edit" element={<EditEventForm />} />
            <Route path="/events/new" element={<CreateEventForm />} />
            <Route path="/clients/:id/edit" element={<EditClientForm />} />
            <Route path="/clients/new" element={<CreateClientForm />} />
            <Route path="/vendors/:id/edit" element={<EditVendorForm />} />
            <Route path="/vendors/new" element={<CreateVendorForm />} />
            <Route path="/tasks/board" element={<TasksBoard />} />
            <Route path="/events/board" element={<EventsBoard />} />
            <Route path="/dashboards" element={<Dashboards />} />
            <Route path="/team" element={<Users />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<User />} />
            <Route path="/users/:userId/edit" element={<EditUserProfile />} />
          </Route>

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
