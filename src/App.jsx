import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
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
import ProductOverview from "./pages/ProductOverview";
import PublicProductLayout from "./components/navigation/PublicProductLayout";

// Sends first-time unauthed visitors to product overview, returning visitors to login, authed users to dashboard
const RootRedirect = () => {
  const { isAuthenticated, isInitializing } = useSelector(
    (state) => state.auth,
  );
  const hasSeenOverview = localStorage.getItem("hasSeenProductOverview");

  if (isInitializing)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62]"></div>
      </div>
    );

  if (isAuthenticated) return <Navigate to="/home" replace />;
  if (!hasSeenOverview) return <Navigate to="/product-overview" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state) => state.auth);
  const isSmallScreen = useIsSmallScreen();

  //  initialize auth
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <>
      <AuthInitializer />

      {/* Full-screen preloader — covers the footer flash during auth resolution */}
      {isInitializing && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-6">
            {/* Animated logo mark */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-[#9B2C62]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#9B2C62] animate-spin"></div>
              <div
                className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#F59E0B] animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "0.8s",
                }}
              ></div>
            </div>
            {/* Brand name */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold tracking-tight text-[#9B2C62]">
                PlaniT
              </span>
              <span className="text-xs text-gray-400 tracking-widest uppercase">
                Loading your workspace
              </span>
            </div>
          </div>
        </div>
      )}

      {isSmallScreen ? (
        <Toaster position="top-center" />
      ) : (
        <Toaster position="top-right" />
      )}
      <Router>
        <Routes>
          {/* Public routes (no layout, no sidebar) */}
          <Route
            path="/login"
            element={
              <>
                <Login />
                <Footer />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Signup />
                <Footer />
              </>
            }
          />

          {/* Product Overview - public or with sidebar if authed */}
          <Route path="/product-overview" element={<PublicProductLayout />}>
            <Route index element={<ProductOverview />} />
          </Route>

          {/* Root: smart redirect based on auth + first-visit flag */}
          <Route path="/" element={<RootRedirect />} />

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
            <Route path="/home" element={<HomePage />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
