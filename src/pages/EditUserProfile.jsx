import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { ArrowLeft, Save, User, Shield, AlertCircle } from "lucide-react";

import {
  fetchUserDetails,
  updateUser,
  updateUserRole,
} from "../redux/usersSlice";

import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
  ROLES,
} from "../globalHooks/userPermissions";
import {
  getAvailableRoles,
  getRoleDescriptions,
  getRoleLabels,
  canEditUser,
} from "../globalHooks/usePermissionHelpers";
import { createUserEditHandler } from "../globalHandlers/createUserEditHandler";
import PermissionButton from "../components/buttons/PermissionButton";
import EditConfirmationToast from "../globalUtils/editConfirmationToast";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";

export default function EditUserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { can, currentUser: authUser } = usePermissions();

  const {
    currentUser: userDetails,
    fetchDetailsStatus,
    updateRoleStatus,
    updateStatus,
  } = useSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  // Watch for role changes to show appropriate permissions
  const selectedRole = watch("role", userDetails?.role || ROLES.VIEWER);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetails(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userDetails) {
      setValue("firstName", userDetails.firstName || "");
      setValue("lastName", userDetails.lastName || "");
      setValue("email", userDetails.email || "");
      setValue("role", userDetails.role || ROLES.VIEWER);
    }
  }, [userDetails, setValue]);

  // Get available roles based on current user's permissions

  // Check if user can edit this specific user
  const { canEdit, isSelf, hasPermission } = canEditUser(
    authUser,
    userDetails,
    can
  );
  const canEditRole = canEdit;

  // Check if fields should be disabled
  const shouldDisableFields = !canEditUser || isSelf;
  const shouldDisableRole = !canEditRole || isSelf;

  const handleSaveChanges = createUserEditHandler(
    dispatch,
    userId,
    navigate,
    updateUser,
    updateUserRole,
    toast,
    toastWithProgress,
    EditConfirmationToast
  );

  const onSubmit = async (formData) => {
    if (!canEditUser) {
      toast.error("You don't have permission to edit this user");
      return;
    }

    // Check if there are actual changes
    const hasRoleChange = formData.role !== userDetails.role;
    const hasBasicChanges =
      formData.firstName !== userDetails.firstName ||
      formData.lastName !== userDetails.lastName ||
      formData.email !== userDetails.email;

    if (!hasRoleChange && !hasBasicChanges) {
      toastWithProgress("No changes detected");
      return;
    }

    // Show confirmation toast with the handler
    handleSaveChanges(formData, userDetails);
  };

  if (fetchDetailsStatus === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62] dark:border-[#D97706]"></div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-[#E3CBC1] dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              User Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The user you're trying to edit doesn't exist.
            </p>
            <Link
              to="/users"
              className="inline-flex items-center gap-2 bg-[#9B2C62] hover:bg-[#801f4f] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const availableRoles = getAvailableRoles(authUser?.role);
  const roleDescriptions = getRoleDescriptions();
  const roleLabels = getRoleLabels();

  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-4 sm:p-10 pb-15">
      {/* Back Navigation */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          to={`/users/${userId}`}
          className="inline-flex items-center gap-2 text-[#9B2C62] dark:text-[#D97706] hover:text-[#801f4f] dark:hover:text-[#F59E0B] font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9B2C62] to-[#F59E0B] flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {userDetails.firstName?.[0]}
                {userDetails.lastName?.[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit {userDetails.firstName} {userDetails.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isSelf
                  ? "Edit your own profile information"
                  : "Update user details and permissions"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
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
                          permission.isRestricted
                            ? "bg-red-500"
                            : "bg-[#F59E0B]"
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
            <Link
              to={`/users/${userId}`}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors duration-200"
            >
              Cancel
            </Link>

            <PermissionButton
              permission={PERMISSIONS.EDIT}
              resource={RESOURCES.USER}
              target={userDetails}
              type="submit"
              loading={
                updateRoleStatus === "loading" || updateStatus === "loading"
              }
              disabled={
                !canEditUser ||
                updateRoleStatus === "loading" ||
                updateStatus === "loading"
              }
              tooltipTitle={
                isSelf
                  ? "You cannot edit your own profile"
                  : canEditUser
                  ? "Save changes"
                  : "You don't have permission to edit this user"
              }
              fallbackTooltip={`${
                isSelf &&
                (authUser.role === "super_admin" || authUser.role === "admin")
                  ? "You cannot edit your own profile"
                  : "You don't have permission to edit this user"
              }`}
              className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {updateRoleStatus === "loading" || updateStatus === "loading"
                ? "Saving..."
                : "Save Changes"}
            </PermissionButton>
          </div>
        </form>
      </div>
    </main>
  );
}
