import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  refreshToken,
  initializationComplete,
  setTrustedDevice,
} from "../../redux/authSlice";
import { markAppReady } from "../../app/api";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { trustedDevice, isAuthenticated } = useSelector((state) => state.auth);
  const refreshAttempted = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (refreshAttempted.current) return;
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

      markAppReady();
      setReady(true);
    };

    initializeAuth();
  }, []);

  if (!ready)
    return (
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
    );

  return children;
};

export default AuthInitializer;
