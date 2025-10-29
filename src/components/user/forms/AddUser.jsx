import React, { useState } from "react";
import { CheckIcon, XIcon } from "../../ui/UserUiFragments";

const AddUser = ({
  showAddForm,
  setShowAddForm,
  handleAddUser,
  setFormData,
  formData,
  generateRandomPassword,
  addUserStatus,
}) => {
  const [showPassword, setShowPassword] = useState(false);
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

  // Password validation function (same as Signup)
  const validatePassword = (password) => {
    const errors = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(Boolean);
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      validatePassword(value);
    }

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
  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";

    // Validate password requirements
    if (formData.password && !validatePassword(formData.password)) {
      errors.password = "Password does not meet requirements";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({}); // Clear errors
    handleAddUser(e);
  };

  // Enhanced password generation with validation
  const handleGeneratePassword = () => {
    generateRandomPassword();
    // Manually set password as valid (since demo passwords meet requirements)
    setPasswordErrors({
      length: true,
      uppercase: true,
      lowercase: true,
      number: true,
      special: true,
    });
  };

  return (
    <section>
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Add Team Member
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
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
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 ${
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
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 ${
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
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 ${
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="organizationRole"
                  value={formData.organizationRole}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent"
                >
                  <option value="viewer">Viewer</option>
                  <option value="planner">Planner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-xs text-[#9B2C62] hover:text-[#7A2250] font-medium"
                  >
                    Generate Secure Password
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 font-mono text-sm pr-12 ${
                      fieldErrors.password
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Create a strong password"
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

                {fieldErrors.password && (
                  <p className="text-xs text-red-600 mt-1">
                    {fieldErrors.password}
                  </p>
                )}

                {/* Password Requirements */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    Password must contain:
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div
                      className={`flex items-center space-x-1 ${
                        passwordErrors.length
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <span>• 8+ characters</span>
                      {passwordErrors.length ? <CheckIcon /> : <XIcon />}
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${
                        passwordErrors.uppercase
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <span>• Uppercase letter</span>
                      {passwordErrors.uppercase ? <CheckIcon /> : <XIcon />}
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${
                        passwordErrors.lowercase
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <span>• Lowercase letter</span>
                      {passwordErrors.lowercase ? <CheckIcon /> : <XIcon />}
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${
                        passwordErrors.number
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <span>• Number</span>
                      {passwordErrors.number ? <CheckIcon /> : <XIcon />}
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${
                        passwordErrors.special
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <span>• Special character</span>
                      {passwordErrors.special ? <CheckIcon /> : <XIcon />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFieldErrors({});
                    setPasswordErrors({
                      length: false,
                      uppercase: false,
                      lowercase: false,
                      number: false,
                      special: false,
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addUserStatus === "loading"}
                  className="bg-[#9B2C62] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#7A2250] disabled:opacity-50 disabled:cursor-not-allowed"
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
