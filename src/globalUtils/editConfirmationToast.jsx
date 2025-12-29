import React from "react";
import { Edit2, AlertCircle, CheckCircle } from "lucide-react";

const EditConfirmationToast = ({
  t,
  duration,
  type,
  formData,
  originalUserData,
  onConfirm,
  onCancel,
}) => {
  if (!formData || !originalUserData) {
    return null;
  }

  // Determine what changes are being made
  const hasRoleChanged = formData.role !== originalUserData.role;
  const hasNameChanged =
    formData.firstName !== originalUserData.firstName ||
    formData.lastName !== originalUserData.lastName;
  const hasEmailChanged = formData.email !== originalUserData.email;
  const hasPhoneChanged = formData.phone !== (originalUserData.phone || "");

  const getTitle = () => {
    if (
      hasRoleChanged &&
      (hasNameChanged || hasEmailChanged || hasPhoneChanged)
    ) {
      return "Update User Profile & Role";
    }
    if (hasRoleChanged) return "Update User Role";
    return "Update User Profile";
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700">
      {/* Close button */}
      <button
        onClick={() => onCancel()}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        ✕
      </button>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] flex items-center justify-center">
            <Edit2 className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {getTitle()}
          </h3>

          {/* Changes summary */}
          {(hasRoleChanged ||
            hasNameChanged ||
            hasEmailChanged ||
            hasPhoneChanged) && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Changes Summary:</span>
              </div>
              <div className="space-y-2 text-xs">
                {hasRoleChanged && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Role:
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {originalUserData.role} → {formData.role}
                    </span>
                  </div>
                )}
                {hasNameChanged && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Name:
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {originalUserData.firstName} {originalUserData.lastName} →{" "}
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                )}
                {hasEmailChanged && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Email:
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {originalUserData.email} → {formData.email}
                    </span>
                  </div>
                )}
                {hasPhoneChanged && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Phone:
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {originalUserData.phone || "Not set"} →{" "}
                      {formData.phone || "Not set"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => onCancel()}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Confirm Changes
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700 rounded-b-xl">
        <div
          className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] transition-all duration-10000 ease-linear"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default EditConfirmationToast;
