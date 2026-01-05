import { User, Shield, Key } from "lucide-react";

import {
  getAvailableRoles,
  getRoleDescriptions,
  getRoleLabels,
  canEditUser,
} from "../../../globalHooks/usePermissionHelpers";
import { EditUserFormBtn } from "../../buttons/UserButtons";
import { useEffect, useState } from "react";

export function EditUserForm({
  handleSubmit,
  onSubmit,
  register,
  shouldDisableFields,
  errors,
  shouldDisableRole,
  isSelf,
  updateRoleStatus,
  userId,
  Link,
  updateStatus,
  userDetails,
  authUser,
  selectedRole,
  watch,
}) {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordMode, setPasswordMode] = useState("");
  const availableRoles = getAvailableRoles(authUser?.role);
  const roleDescriptions = getRoleDescriptions();
  const roleLabels = getRoleLabels();

  const newPasswordVal = watch("newPassword", "");

  useEffect(() => {
    if (isSelf) {
      setShowPasswordFields(true);
      setPasswordMode("self");
    } else if (authUser?.role === "admin" || authUser?.role === "super_admin") {
      setShowPasswordFields(true);
      setPasswordMode("other");
    }
  }, [isSelf, authUser]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Basic Information Card */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              {...register("firstName", {
                required: "First name is required",
                maxLength: {
                  value: 50,
                  message: "First name must be 50 characters or fewer",
                },
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:focus:ring-[#D97706] focus:border-transparent"
              placeholder="First name"
              disabled={shouldDisableFields}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              {...register("lastName", {
                required: "Last name is required",
                maxLength: {
                  value: 50,
                  message: "Last name must be 50 characters or fewer",
                },
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:focus:ring-[#D97706] focus:border-transparent"
              placeholder="Last name"
              disabled={shouldDisableFields}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Please enter a valid email",
                },
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:focus:ring-[#D97706] focus:border-transparent"
              placeholder="email@example.com"
              disabled={shouldDisableFields}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Card */}
      {showPasswordFields && showPasswordChange && (
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Key className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
            Change Password
          </h2>

          {passwordMode === "self" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  {...register("currentPassword", {
                    required: newPasswordVal
                      ? "Current password is required to change password"
                      : false,
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter current password"
                  disabled={shouldDisableFields}
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  {...register("newPassword", {
                    validate: (value) => {
                      if (!value) return true; // Optional field
                      const passwordRegex =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
                      return (
                        passwordRegex.test(value) ||
                        "Must contain uppercase, lowercase, number, and special character"
                      );
                    },
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Leave blank to keep current"
                  disabled={shouldDisableFields}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    validate: (value) => {
                      if (newPasswordVal && value !== newPasswordVal) {
                        return "Passwords do not match";
                      }
                      return true;
                    },
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Confirm new password"
                  disabled={shouldDisableFields}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          ) : (
            // Admin changing someone else's password
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  {...register("newPassword", {
                    validate: (value) => {
                      if (!value) return true; // Optional field
                      const passwordRegex =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
                      return (
                        passwordRegex.test(value) ||
                        "Must contain uppercase, lowercase, number, and special character"
                      );
                    },
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Set new password for this user"
                  disabled={shouldDisableFields}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    validate: (value) => {
                      const newPassword = watch("newPassword");
                      if (newPassword && value !== newPassword) {
                        return "Passwords do not match";
                      }
                      return true;
                    },
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Confirm new password"
                  disabled={shouldDisableFields}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                As an admin, you can reset this user's password without knowing
                their current one.
              </p>
            </div>
          )}
        </div>
      )}

      {/* button to show password fields */}
      {showPasswordFields && !showPasswordChange && (
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
              Password
            </h2>
            <button
              type="button"
              onClick={() => setShowPasswordChange(true)}
              className="text-sm text-[#9B2C62] dark:text-[#D97706] hover:underline font-medium"
            >
              Change Password
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Your password can be changed here. Click "Change Password" to
            update.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs font-semibold">
            You will have to log in again after password change.
          </p>
        </div>
      )}
      {/* Role Section */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
            Role & Permissions
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isSelf ? "(You cannot change your own role)" : ""}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            User Role
          </label>

          {shouldDisableRole ? (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="text-gray-600 dark:text-gray-400">
                {isSelf
                  ? "You cannot change your own role. Contact another administrator if you need to change your permissions."
                  : "You don't have permission to change this user's role."}
              </div>
            </div>
          ) : (
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E3CBC1] dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:focus:ring-[#D97706] focus:border-transparent"
              disabled={updateRoleStatus === "loading"}
            >
              <option value="">Select a role</option>
              {availableRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          )}

          {/* Role Permissions Preview */}
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 border border-[#F59E0B]/20 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {roleLabels[selectedRole]} Permissions
            </h3>
            <ul className="space-y-2">
              {roleDescriptions[selectedRole]?.map((permission, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      permission.isRestricted ? "bg-red-500" : "bg-[#F59E0B]"
                    } mt-1.5`}
                  ></div>
                  <span
                    className={
                      permission.isRestricted
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  >
                    {permission.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {/* cancel btn */}
        <Link
          to={`/users/${userId}`}
          className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors duration-200"
        >
          Cancel
        </Link>

        {/* edit btn/save changes */}
        <EditUserFormBtn
          userDetails={userDetails}
          updateRoleStatus={updateRoleStatus}
          updateStatus={updateStatus}
          canEditUser={canEditUser}
          isSelf={isSelf}
          authUser={authUser}
        />
      </div>
    </form>
  );
}
