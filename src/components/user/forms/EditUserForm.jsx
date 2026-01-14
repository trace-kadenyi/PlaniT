import { useEffect, useState } from "react";
import { User, Shield } from "lucide-react";

import {
  getAvailableRoles,
  getRoleDescriptions,
  getRoleLabels,
  canEditUser,
} from "../../../globalHooks/usePermissionHelpers";
import { EditUserFormBtn } from "../../buttons/UserButtons";
import UserFormPassManagement, {
  ShowPassFieldsBtn,
} from "../UserManagement/UserFormPassManagement";
import UserFormRoleManagement from "../UserManagement/UserFormRoleManagement";

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
  isEditConfirmActive,
  navigate,
}) {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordMode, setPasswordMode] = useState("");
  const availableRoles = getAvailableRoles(authUser?.role);
  const roleDescriptions = getRoleDescriptions();
  const roleLabels = getRoleLabels();

  const newPasswordVal = watch("newPassword", "");

  // check permissions
  useEffect(() => {
    if (isSelf) {
      // User editing themselves
      setShowPasswordFields(true);
      setPasswordMode("self");
    } else if (authUser?.role === "super_admin") {
      // Super admin editing anyone (including other super admins)
      setShowPasswordFields(true);
      setPasswordMode("other");
    } else if (
      authUser?.role === "admin" &&
      userDetails?.role !== "super_admin"
    ) {
      // Admin editing non-super-admin users
      setShowPasswordFields(true);
      setPasswordMode("other");
    } else {
      // No permission to change password
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
        <UserFormPassManagement
          passwordMode={passwordMode}
          register={register}
          newPasswordVal={newPasswordVal}
          shouldDisableFields={shouldDisableFields}
          errors={errors}
          setValue={setValue}
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
      <UserFormRoleManagement
        isSelf={isSelf}
        shouldDisableRole={shouldDisableRole}
        register={register}
        updateRoleStatus={updateRoleStatus}
        availableRoles={availableRoles}
        roleLabels={roleLabels}
        selectedRole={selectedRole}
        roleDescriptions={roleDescriptions}
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {/* cancel btn */}
        <button
          type="button"
          disabled={updateStatus === "loading" || isEditConfirmActive}
          onClick={() => navigate(`/users/${userId}`)}
          className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        {/* edit btn/save changes */}
        <EditUserFormBtn
          userDetails={userDetails}
          updateRoleStatus={updateRoleStatus}
          updateStatus={updateStatus}
          canEditUser={canEditUser}
          isSelf={isSelf}
          authUser={authUser}
          isEditConfirmActive={isEditConfirmActive}
        />
      </div>
    </form>
  );
}
