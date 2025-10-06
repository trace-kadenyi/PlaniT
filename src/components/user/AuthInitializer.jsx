import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { refreshToken, initializeAuth } from "../../redux/authSlice"; // Import initializeAuth

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const {
    trustedDevice,
    refreshToken: storedRefreshToken,
    isAuthenticated,
    isInitializing,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize auth state on component mount
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    const initializeAuth = async () => {
      // If we're initializing, have a trusted device and refresh token, but no active session
      if (
        isInitializing &&
        trustedDevice &&
        storedRefreshToken &&
        !isAuthenticated
      ) {
        try {
          await dispatch(refreshToken()).unwrap();
          // Success - user is now authenticated
        } catch (error) {
          // Refresh failed - clear trusted device
          console.log("Token refresh failed, clearing trusted device");
          localStorage.removeItem("trustedDevice");
        }
      }
    };

    initializeAuth();
  }, [
    dispatch,
    trustedDevice,
    storedRefreshToken,
    isAuthenticated,
    isInitializing,
  ]);

  return null;
};

export default AuthInitializer;
