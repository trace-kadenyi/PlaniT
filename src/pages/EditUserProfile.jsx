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
import { NoUserDetails } from "../components/user/UserManagement/UserNotFound";
import { EditUserForm } from "../components/user/forms/EditUserForm";

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

  // user details
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

  // Check if user can edit this specific user
  const { canEdit, isSelf, hasPermission } = canEditUser(
    authUser,
    userDetails,
    can
  );
  const canEditRole = canEdit;
  const availableRoles = getAvailableRoles(authUser?.role);
  const roleDescriptions = getRoleDescriptions();
  const roleLabels = getRoleLabels();

  // Check if fields should be disabled
  const shouldDisableFields = !canEditUser || isSelf;
  const shouldDisableRole = !canEditRole || isSelf;

  // handle save changes
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

  // onsubmit
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

  // no user details found
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
        <EditUserForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          shouldDisableFields={shouldDisableFields}
          errors={errors}
          shouldDisableRole={shouldDisableRole}
          isSelf={isSelf}
          updateRoleStatus={updateRoleStatus}
          userId={userId}
          Link={Link}
          updateStatus={updateStatus}
          userDetails={userDetails}
          authUser={authUser}
          selectedRole={selectedRole}
        />
      </div>
    </main>
  );
}
