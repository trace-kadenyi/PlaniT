import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  refreshToken,
  initializationComplete,
  setTrustedDevice,
} from "../../redux/authSlice";
import { markAppReady } from "../../app/api";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { trustedDevice, isAuthenticated, isInitializing } = useSelector(
    (state) => state.auth,
  );
  const refreshAttempted = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isInitializing || refreshAttempted.current) return;
      refreshAttempted.current = true;

      if (trustedDevice && !isAuthenticated) {
        try {
          await dispatch(refreshToken()).unwrap();
        } catch (error) {
          dispatch(setTrustedDevice(false));
          dispatch(initializationComplete());
        }
      } else {
        dispatch(initializationComplete());
      }

      markAppReady(); // ← unblocks the interceptor after refresh settles
    };

    initializeAuth();
  }, []); // ← empty deps, runs once on mount only

  // Block the app from rendering until auth state is known
  if (isInitializing) return null; // swap for a spinner if you prefer

  return children;
};

export default AuthInitializer;

// import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   refreshToken,
//   initializationComplete,
//   setTrustedDevice,
// } from "../../redux/authSlice";

// const AuthInitializer = () => {
//   const dispatch = useDispatch();
//   const { trustedDevice, isAuthenticated, isInitializing } = useSelector(
//     (state) => state.auth,
//   );
//   const refreshAttempted = useRef(false);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       // Don't proceed if not initializing or already attempted refresh
//       if (!isInitializing || refreshAttempted.current) return;

//       // Only attempt refresh if we have a trusted device but no authentication
//       if (trustedDevice && !isAuthenticated) {
//         try {
//           refreshAttempted.current = true; // Mark as attempted
//           await dispatch(refreshToken()).unwrap();
//           console.log("Token refresh successful");
//         } catch (error) {
//           console.log("Token refresh failed:", error);
//           // If refresh fails, mark device as untrusted
//           dispatch(setTrustedDevice(false));
//           dispatch(initializationComplete());
//         }
//       } else {
//         // No need to refresh, complete initialization
//         dispatch(initializationComplete());
//       }
//     };

//     initializeAuth();
//   }, [dispatch, trustedDevice, isAuthenticated, isInitializing]);

//   return null;
// };

// export default AuthInitializer;


