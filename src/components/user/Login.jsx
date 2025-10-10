import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  loginUser,
  resetLoginState,
  clearAuthErrors,
  setTrustedDevice,
} from "../../redux/authSlice";

import LogoWordmark from "../navigation/LogoWordmark";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loginStatus, loginError, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // if auth, navigate to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component unmounts

  useEffect(() => {
    return () => {
      dispatch(clearAuthErrors());
    };
  }, [dispatch]);

  //   handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        // AFTER SUCCESSFUL LOGIN, SET TRUSTED DEVICE IF CHECKED
        if (trustDevice) {
          dispatch(setTrustedDevice(true));
        }
      });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header Section - Deep Mulberry */}
          <div className="bg-gradient-to-br from-[#9B2C62] to-[#7A2250] p-8 text-center">
            <LogoWordmark />
            <p className="text-white/90 mt-3 text-lg font-light">
              Sign in to your account
            </p>
          </div>

          {/* Form Section - White Background */}
          <div className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email with Demo Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 pr-20"
                    placeholder="demo@planiT.app"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={() => setEmail("demo@planiT.app")}
                      className="text-xs bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white px-3 py-1.5 rounded-lg hover:shadow-md transition-all duration-200 font-medium"
                    >
                      Demo
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Click "Demo" to auto-fill test credentials
                </p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Trust Device */}
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={trustDevice}
                      onChange={(e) => setTrustDevice(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                        trustDevice
                          ? "bg-[#9B2C62] border-[#9B2C62]"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {trustDevice && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    Trust this device
                  </span>
                </label>
                <p className="text-xs text-gray-500 ml-8">
                  Stay logged in for 7 days on this device
                </p>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-red-700 text-sm font-medium">
                      {loginError}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginStatus === "loading"}
                className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
              >
                {loginStatus === "loading" ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Demo Note */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    Portfolio Demo
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Use the demo button above to quickly test the application.
                    No real email required!
                  </p>
                </div>
              </div>
            </div>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-[#9B2C62] font-semibold hover:text-[#7A2250] transition-colors duration-200"
                >
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
