// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loginStatus } = useSelector((state) => state.auth);

  // Show loading or wait if we're trying to refresh tokens
  if (loginStatus === "loading") {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
