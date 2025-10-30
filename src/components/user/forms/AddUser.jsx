import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Password, { generateRandomPassword } from "../../shared/Password";

const AddUser = ({
  showAddForm,
  setShowAddForm,
  handleAddUser,
  setFormData,
  formData,
  addUserStatus,
}) => {
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [triggerPasswordValidation, setTriggerPasswordValidation] =
    useState(false);

  const { addUserError } = useSelector((state) => state.organization);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showAddForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAddForm]);

  // reset form when modal closes
  useEffect(() => {
    if (!showAddForm) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "planner",
        password: "",
      });
      setFieldErrors({});
    }
  }, [showAddForm, setFormData]);

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }
  };

  // Enhanced handle submit with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({}); // Clear errors
    try {
      await handleAddUser(e);
      // If successful, the modal will close automatically
    } catch (error) {
      // The error is already handled by the Redux slice, but we can check for specific password errors
      console.log("Add user error:", error);
    }
  };

  // Enhanced password generation with validation trigger
  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword(); // Call the function
    setFormData({ ...formData, password: newPassword });

    // Trigger validation to update the password requirements display
    setTriggerPasswordValidation((prev) => !prev);
  };
  return (
    <section>
      {showAddForm && (
        <div className="fixed inset-0 bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#F7F7FA] dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-[#D97706] dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] rounded-xl shadow border-t-4 border-[#BE3455] mt-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#9B2C62] dark:text-[#F59E0B]">
                Add Team Member
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-600 hover:dark:text-gray-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* error message */}
              {addUserError && (
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
                      {addUserError}
                    </span>
                  </div>
                </div>
              )}
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 dark:text-gray-400 dark:focus:ring-[#F59E0B] dark:border-gray-700 ${
                      fieldErrors.firstName
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="John"
                  />
                  {fieldErrors.firstName && (
                    <p className="text-xs text-red-600 mt-1">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 dark:text-gray-400 dark:focus:ring-[#F59E0B] dark:border-gray-700 ${
                      fieldErrors.lastName
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Doe"
                  />
                  {fieldErrors.lastName && (
                    <p className="text-xs text-red-600 mt-1">
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 dark:text-gray-400 dark:focus:ring-[#F59E0B] dark:border-gray-700 ${
                    fieldErrors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="john.doe@example.com"
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9B2C62] focus:border-transparent dark:text-gray-400 dark:focus:ring-[#F59E0B] dark:bg-black"
                >
                  <option value="viewer">Viewer</option>
                  <option value="planner">Planner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Password Section with Generate Button */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="text-sm font-medium text-gray-700 dark:text-gray-300
dark:text-gray-300"
                  >
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-xs text-[#9B2C62] hover:text-[#7A2250] font-medium dark:text-[#F59E0B] dark:hover:text-[#F59E0B]/90"
                  >
                    Generate Secure Password
                  </button>
                </div>

                <Password
                  password={formData.password}
                  onPasswordChange={(value) =>
                    setFormData({ ...formData, password: value })
                  }
                  triggerValidation={triggerPasswordValidation}
                  mode="addUser"
                />

                {fieldErrors.password && (
                  <p className="text-xs text-red-600 mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-3 py-1 rounded-lg transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addUserStatus === "loading"}
                  className="bg-[#9B2C62] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#7A2250] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#d97706] dark:hover:bg-[#d97706]/80"
                >
                  {addUserStatus === "loading" ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AddUser;
