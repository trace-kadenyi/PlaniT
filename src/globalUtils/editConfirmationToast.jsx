import React, { useEffect, useState } from "react";
import { Edit2, AlertCircle, CheckCircle, X, ChevronRight } from "lucide-react";

const EditConfirmationToast = ({
  t,
  duration,
  type,
  formData,
  originalUserData,
  onConfirm,
  onCancel,
}) => {
  const [progress, setProgress] = useState(100);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return prev - 100 / (duration / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  if (!formData || !originalUserData) {
    return null;
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onCancel(), 300);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => onConfirm(), 300);
  };

  // Determine what changes are being made
  const hasRoleChanged = formData.role !== originalUserData.role;
  const hasNameChanged =
    formData.firstName !== originalUserData.firstName ||
    formData.lastName !== originalUserData.lastName;
  const hasEmailChanged = formData.email !== originalUserData.email;

  const changeCount = [hasRoleChanged, hasNameChanged, hasEmailChanged].filter(
    Boolean
  ).length;

  const getTitle = () => {
    if (changeCount > 1) return `${changeCount} Changes Detected`;
    if (hasRoleChanged) return "Update User Role";
    if (hasNameChanged) return "Update User Name";
    if (hasEmailChanged) return "Update User Email";
    return "Update User Profile";
  };

  const roleLabels = {
    super_admin: "Super Admin",
    admin: "Admin",
    planner: "Planner",
    viewer: "Viewer",
  };

  return (
    <div
      className={`relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 max-w-md w-full mx-auto border border-gray-100 dark:border-gray-700 transform transition-all duration-300 ${
        isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
      } hover:shadow-2xl transition-shadow duration-300`}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/5 to-[#9B2C62]/5 dark:from-[#F59E0B]/10 dark:to-[#9B2C62]/10 rounded-2xl -m-1 blur-xl -z-10"></div>

      {/* Close button with animation */}
      <button
        onClick={handleClose}
        className="absolute top-3 sm:top-1 right-3 sm:right-2 p-1 rounded-full bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 transform hover:rotate-90"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        {/* Icon with animation */}
        <div className="flex-shrink-0 relative self-center sm:self-start">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
            <Edit2 className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </div>
          {changeCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#9B2C62] to-[#801f4f] text-white text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-md">
              {changeCount}
            </div>
          )}
        </div>

        <div className="flex-1 w-full min-w-0">
          {/* Header with count */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3 sm:mb-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">
              {getTitle()}
            </h3>
          </div>

          {/* User info preview */}
          <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {originalUserData.firstName?.[0]}
                  {originalUserData.lastName?.[0]}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {originalUserData.firstName} {originalUserData.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {originalUserData.email}
                </p>
              </div>
            </div>
          </div>

          {/* Changes summary - animated */}
          {(hasRoleChanged || hasNameChanged || hasEmailChanged) && (
            <div className="mb-5 sm:mb-6 animate-[slideUp_0.3s_ease-out]">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                <span className="font-semibold truncate">Changes Summary</span>
              </div>

              <div className="space-y-3">
                {hasRoleChanged && (
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 gap-2 xs:gap-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                      Role
                    </span>
                    <div className="flex flex-wrap items-center justify-end xs:justify-start gap-2 min-w-0">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {roleLabels[originalUserData.role] ||
                          originalUserData.role}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded whitespace-nowrap">
                        {roleLabels[formData.role] || formData.role}
                      </span>
                    </div>
                  </div>
                )}

                {hasNameChanged && (
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-100 dark:border-green-800/30 gap-2 xs:gap-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                      Name
                    </span>
                    <div className="flex flex-col items-end xs:items-start text-right xs:text-left min-w-0">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 line-through truncate w-full">
                        {originalUserData.firstName} {originalUserData.lastName}
                      </p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate w-full">
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                  </div>
                )}

                {hasEmailChanged && (
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30 gap-2 xs:gap-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                      Email
                    </span>
                    <div className="flex flex-col items-end xs:items-start text-right xs:text-left min-w-0">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 line-through truncate w-full">
                        {originalUserData.email}
                      </p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate w-full">
                        {formData.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col xs:flex-row justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 sm:px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 order-2 xs:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 sm:px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl hover:shadow-lg hover:shadow-[#F59E0B]/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group order-1 xs:order-2"
            >
              <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Confirm Changes
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar with animation */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5">
        <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-b-2xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#9B2C62] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Add some CSS for animations */}
    </div>
  );
};

export default EditConfirmationToast;
