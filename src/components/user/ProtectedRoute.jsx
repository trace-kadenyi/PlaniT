import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useSelector((state) => state.auth);

  // Show loading while we're initializing auth (checking for refresh token)
  if (isInitializing) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;