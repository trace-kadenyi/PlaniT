import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { refreshToken } from "../../redux/authSlice";

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const {
    trustedDevice,
    refreshToken: storedRefreshToken,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      // If we have a trusted device and refresh token, but no active session
      if (trustedDevice && storedRefreshToken && !isAuthenticated) {
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
  }, [dispatch, trustedDevice, storedRefreshToken, isAuthenticated]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;
