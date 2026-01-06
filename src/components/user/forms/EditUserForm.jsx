import { useEffect, useState } from "react";
import { User, Shield, Key } from "lucide-react";

import {
  getAvailableRoles,
  getRoleDescriptions,
  getRoleLabels,
  canEditUser,
} from "../../../globalHooks/usePermissionHelpers";
import { EditUserFormBtn } from "../../buttons/UserButtons";
import Password, { generateRandomPassword } from "../../shared/Password";
import UserFormPassword, {
  ShowPassFieldsBtn,
} from "../UserManagement/UserFormPassword";

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
  setValue,
}) {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordMode, setPasswordMode] = useState("");
  const [triggerPasswordValidation, setTriggerPasswordValidation] =
    useState(false);
  const availableRoles = getAvailableRoles(authUser?.role);
  const roleDescriptions = getRoleDescriptions();
  const roleLabels = getRoleLabels();

  const newPasswordVal = watch("newPassword", "");

  // check permissions
  useEffect(() => {
    if (isSelf) {
      setShowPasswordFields(true);
      setPasswordMode("self");
    } else if (
      (authUser?.role === "admin" || authUser?.role === "super_admin") &&
      userDetails?.role !== "super_admin"
    ) {
      setShowPasswordFields(true);
      setPasswordMode("other");
    } else {
      setShowPasswordFields(false);
    }
  }, [isSelf, authUser, userDetails]);


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
        <UserFormPassword
          passwordMode={passwordMode}
          register={register}
          newPasswordVal={newPasswordVal}
          shouldDisableFields={shouldDisableFields}
          errors={errors}
          setValue={setValue}
          triggerPasswordValidation={triggerPasswordValidation}
          setTriggerPasswordValidation={setTriggerPasswordValidation}
        />
      )}

      {/* button to show password fields */}
      {showPasswordFields && !showPasswordChange && (
        <ShowPassFieldsBtn
          setShowPasswordChange={setShowPasswordChange}
          isSelf={isSelf}
        />
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
