import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken, initializationComplete } from "../../redux/authSlice";

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const { trustedDevice, isAuthenticated, isInitializing } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Debug: Check if cookies are present
    console.log("Cookies present:", document.cookie);

    const initializeAuth = async () => {
      if (!isInitializing) return;

      console.log("AuthInitializer - Checking trusted device:", trustedDevice);

      if (trustedDevice && !isAuthenticated) {
        try {
          console.log("Attempting token refresh with HTTP-only cookie...");
          const result = await dispatch(refreshToken()).unwrap();
          console.log("Token refresh successful", result);
        } catch (error) {
          console.log("Token refresh failed:", error);
          dispatch(initializationComplete());
        }
      } else {
        dispatch(initializationComplete());
      }
    };

    initializeAuth();
  }, [dispatch, trustedDevice, isAuthenticated, isInitializing]);

  return null;
};

export default AuthInitializer;
