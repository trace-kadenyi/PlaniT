// Password.jsx
import React, { useState, useEffect } from "react";
import { CheckIcon, XIcon } from "../ui/UserUiFragments";

const Password = ({
  password,
  onPasswordChange,
  showPasswordRequirements = true,
  className = "",
  triggerValidation = false,
  mode = "signup",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Shared password validation function
  const validatePassword = (password) => {
    const errors = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(Boolean);
  };

  // Handle password change with validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    validatePassword(value);
    onPasswordChange(value);
  };

  useEffect(() => {
    if (password) {
      validatePassword(password);
    }
  }, [password, triggerValidation]);

  return (
    <div className={`space-y-2 ${className}`}>
      {mode === "signup" && (
        <label className="text-sm font-medium text-gray-700">Password*</label>
      )}

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 pr-12 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:text-gray-400 dark:focus:ring-[#F59E0B] dark:border-gray-700"
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

      {/* Password Requirements */}
      {showPasswordRequirements && (
        <div className="space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-400/80">
            Password must contain:
          </p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div
              className={`flex items-center space-x-1 ${
                passwordErrors.length
                  ? "text-green-600"
                  : "text-gray-400 dark:text-gray-400/70"
              }`}
            >
              <span>• 8+ characters</span>
              {passwordErrors.length ? <CheckIcon /> : <XIcon />}
            </div>
            <div
              className={`flex items-center space-x-1 ${
                passwordErrors.uppercase
                  ? "text-green-600"
                  : "text-gray-400 dark:text-gray-400/70"
              }`}
            >
              <span>• Uppercase letter</span>
              {passwordErrors.uppercase ? <CheckIcon /> : <XIcon />}
            </div>
            <div
              className={`flex items-center space-x-1 ${
                passwordErrors.lowercase
                  ? "text-green-600"
                  : "text-gray-400 dark:text-gray-400/70"
              }`}
            >
              <span>• Lowercase letter</span>
              {passwordErrors.lowercase ? <CheckIcon /> : <XIcon />}
            </div>
            <div
              className={`flex items-center space-x-1 ${
                passwordErrors.number
                  ? "text-green-600"
                  : "text-gray-400 dark:text-gray-400/70"
              }`}
            >
              <span>• Number</span>
              {passwordErrors.number ? <CheckIcon /> : <XIcon />}
            </div>
            <div
              className={`flex items-center space-x-1 ${
                passwordErrors.special
                  ? "text-green-600"
                  : "text-gray-400 dark:text-gray-400/70"
              }`}
            >
              <span>• Special character</span>
              {passwordErrors.special ? <CheckIcon /> : <XIcon />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Password;

// Export the validation function for use outside the component
export const validatePassword = (password) => {
  const errors = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  };
  return {
    isValid: Object.values(errors).every(Boolean),
    errors,
  };
};

// generate random password
export const generateRandomPassword = () => {
  // Define character sets
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*";
  const allChars = uppercase + lowercase + numbers + special;

  // Start with one guaranteed character from each required set
  const guaranteedChars = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  // Generate remaining random characters
  const randomChars = [];
  for (let i = 0; i < 8; i++) {
    randomChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Combine and shuffle
  const allPasswordChars = [...guaranteedChars, ...randomChars];
  const shuffledPassword = allPasswordChars
    .sort(() => Math.random() - 0.5)
    .join("");

  return shuffledPassword;
};
