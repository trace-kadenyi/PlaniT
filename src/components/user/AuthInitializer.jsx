import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  refreshToken,
  initializationComplete,
  setTrustedDevice,
} from "../../redux/authSlice";

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const { trustedDevice, isAuthenticated, isInitializing } = useSelector(
    (state) => state.auth,
  );
  const refreshAttempted = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Don't proceed if not initializing or already attempted refresh
      if (!isInitializing || refreshAttempted.current) return;

      // Only attempt refresh if we have a trusted device but no authentication
      if (trustedDevice && !isAuthenticated) {
        try {
          refreshAttempted.current = true; // Mark as attempted
          await dispatch(refreshToken()).unwrap();
          console.log("Token refresh successful");
        } catch (error) {
          console.log("Token refresh failed:", error);
          // If refresh fails, mark device as untrusted
          dispatch(setTrustedDevice(false));
          dispatch(initializationComplete());
        }
      } else {
        // No need to refresh, complete initialization
        dispatch(initializationComplete());
      }
    };

    initializeAuth();
  }, [dispatch, trustedDevice, isAuthenticated, isInitializing]);

  return null;
};

export default AuthInitializer;
