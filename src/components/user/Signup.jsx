import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  signupUser,
  resetSignupState,
  clearAuthErrors,
} from "../../redux/authSlice";

import LogoWordmark from "../navigation/LogoWordmark";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organizationName: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { signupStatus, signupError, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  //   if auth, navigate to dash
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  //   clear auth errs
  useEffect(() => {
    return () => {
      dispatch(clearAuthErrors());
    };
  }, [dispatch]);

  // handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser(formData));
  };

  // Auto-fill dmeo credentials
  const generateDemoCredentials = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const demoEmail = `demo-${randomId}@planiT.app`;
    const demoPassword = "demo123";
    const randomOrgId = Math.random().toString(36).substring(2, 6);

    setFormData({
      firstName: "Demo",
      lastName: "User",
      email: demoEmail,
      password: demoPassword,
      organizationName: "Demo Events Co.",
      organizationName: `Demo ${randomOrgId.toUpperCase()} Events`,
    });
  };

  // default workspace name
  const defaultWorkspaceName = formData.firstName
    ? `${formData.firstName}'s Event Planning`
    : "";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full lg:max-w-none lg:w-2/5 py-8">
        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header Section - Deep Mulberry */}
          <div className="bg-gradient-to-br from-[#9B2C62] to-[#7A2250] p-8 flex items-center flex-col justify-center">
            <LogoWordmark />
            <p className="text-white/90 mt-3 text-sm font-light">
              Create Your PlaniT Account
            </p>
          </div>

          {/* Form Section - White Background */}
          <div className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Demo Button */}
              <button
                type="button"
                onClick={generateDemoCredentials}
                className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white py-2 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
              >
                Generate Demo Credentials
              </button>

              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="First name"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="Enter your email"
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
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pass */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 pr-12"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Minimum 6 characters</p>
              </div>

              {/* Organization Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Company/Organization Name{" "}
                  <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Your company or team name"
                />
                <p className="text-xs text-gray-500">
                  Leave blank for automatic personal workspace
                  {defaultWorkspaceName && (
                    <span className="font-medium">
                      {" "}
                      - {defaultWorkspaceName}
                    </span>
                  )}
                </p>
              </div>

              {/* Role */}
              {/* <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 text-gray-900"
                >
                  <option value="planner">Planner</option>
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div> */}

              {/* Error Message */}
              {signupError && (
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
                      {signupError}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={signupStatus === "loading"}
                className="w-full bg-gradient-to-r from-[#9B2C62] to-[#7A2250] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
              >
                {signupStatus === "loading" ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Demo Note */}
            <div className="mt-6 p-4 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20">
              <div className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 text-[#D97706] mt-0.5 flex-shrink-0"
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
                  <p className="text-xs text-[#B45309] mt-1">
                    Use the demo button to pre-fill all fields. Perfect for
                    testing the application features!
                  </p>
                </div>
              </div>
            </div>

            {/* Login prompt */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-[#9B2C62] font-semibold hover:text-[#7A2250] transition-colors duration-200"
                >
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
