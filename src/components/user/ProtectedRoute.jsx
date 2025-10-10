import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useSelector(
    (state) => state.auth
  );

  // Show loading while initializing auth (checking for refresh token)
  if (isInitializing) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62] dark:border-[#F59E0B]"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
