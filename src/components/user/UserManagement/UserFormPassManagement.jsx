import { useState } from "react";
import { Key } from "lucide-react";

import Password, { generateRandomPassword } from "../../shared/Password";
import { PasswordInput } from "../../ui/Button";

export default function UserFormPassManagement({
  passwordMode,
  register,
  newPasswordVal,
  shouldDisableFields,
  errors,
  setValue,
}) {
  const [triggerPasswordValidation, setTriggerPasswordValidation] =
    useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Handle password generation
  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setValue("newPassword", newPassword);
    setTriggerPasswordValidation((prev) => !prev);
  };

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Key className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
        Change Password
      </h2>

      {passwordMode === "self" ? (
        <div className="space-y-4">
          {/* Current Password field remains the same */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <PasswordInput
              register={register}
              name="currentPassword"
              placeholder="Enter current password"
              disabled={shouldDisableFields}
              required={!!newPasswordVal}
              showPassword={showCurrentPassword}
              togglePassword={() =>
                setShowCurrentPassword(!showCurrentPassword)
              }
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password using Password component */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
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
              password={newPasswordVal}
              onPasswordChange={(value) => setValue("newPassword", value)}
              triggerValidation={triggerPasswordValidation}
              mode="editUser"
              className="mt-1"
            />

            {errors.newPassword && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
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
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
            As an admin, you can reset this user's password without knowing
            their current one.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password (optional)
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
              password={newPasswordVal}
              onPasswordChange={(value) => setValue("newPassword", value)}
              triggerValidation={triggerPasswordValidation}
              mode="editUser"
              className="mt-1"
            />

            {errors.newPassword && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
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
      )}
    </div>
  );
}

// show password fields button
export function ShowPassFieldsBtn({ setShowPasswordChange, isSelf }) {
  return (
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
        Your password can be changed here. Click "Change Password" to update.
      </p>
      {isSelf && (
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs font-semibold">
          You will have to log in again after password change.
        </p>
      )}
    </div>
  );
}
