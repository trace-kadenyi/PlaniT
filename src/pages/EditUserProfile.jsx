import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft, AlertCircle } from "lucide-react";

import {
  fetchUserDetails,
  setCurrentUser,
  updateUser,
  updateUserRole,
} from "../redux/usersSlice";
import { logoutUser } from "../redux/authSlice";

import { usePermissions, ROLES } from "../globalHooks/userPermissions";
import { canEditUser } from "../globalHooks/usePermissionHelpers";
import { createUserEditHandler } from "../globalHandlers/createUserEditHandler";
import EditConfirmationToast from "../globalUtils/editConfirmationToast";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import { NoUserDetails } from "../components/user/UserManagement/UserNotFound";
import { EditUserForm } from "../components/user/forms/EditUserForm";
import { GenLoadingState } from "../components/shared/LoadingStates";

export default function EditUserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditConfirmActive, setIsEditConfirmActive] = useState(false);

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

    // Cleanup: clear currentUser when leaving edit page
    return () => {
      dispatch(setCurrentUser(null));
    };
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
  const { canEdit, isSelf, canEditRole } = canEditUser(
    authUser,
    userDetails,
    can,
  );

  // Check if fields should be disabled
  const shouldDisableFields = !canEdit;
  const shouldDisableRole = !canEditRole;

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("sidebarCollapsed");
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.log("Logout error:", error);
        // Still redirect to login even if API call fails
        navigate("/login");
      });
  };

  // handle save changes
  const handleSaveChanges = createUserEditHandler(
    dispatch,
    userId,
    navigate,
    updateUser,
    updateUserRole,
    toast,
    toastWithProgress,
    EditConfirmationToast,
    handleLogout,
    authUser._id,
    setIsEditConfirmActive,
  );

  // Auto-show password fields for self or admins
  useEffect(() => {
    if (isSelf) {
      setValue("passwordMode", "self");
    } else if (
      (authUser?.role === ROLES.ADMIN ||
        authUser?.role === ROLES.SUPER_ADMIN) &&
      userDetails?.role !== ROLES.SUPER_ADMIN
    ) {
      setValue("passwordMode", "other");
    }
  }, [isSelf, authUser, userDetails, setValue]);

  // Register password fields
  useEffect(() => {
    register("passwordMode");
    register("currentPassword");
    register("newPassword");
    register("confirmPassword");
  }, [register]);

  // onsubmit
  const onSubmit = async (formData) => {
    if (!canEdit) {
      // Changed from canEditUser to canEdit
      toastWithProgress("You don't have permission to edit this user");
      return;
    }

    // Check if there are actual changes
    const hasRoleChange = formData.role !== userDetails.role;
    const hasBasicChanges =
      formData.firstName !== userDetails.firstName ||
      formData.lastName !== userDetails.lastName ||
      formData.email !== userDetails.email;
    const hasPasswordChange = !!formData.newPassword;

    if (!hasRoleChange && !hasBasicChanges && !hasPasswordChange) {
      toastWithProgress("No changes detected");
      return;
    }

    // Prepare data for API
    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
    };

    // Add password fields if changing password
    if (hasPasswordChange) {
      updateData.newPassword = formData.newPassword;
      if (isSelf) {
        updateData.currentPassword = formData.currentPassword;
      }
    }

    // Show confirmation toast with the handler
    handleSaveChanges(updateData, userDetails, formData);
  };

  // loading states
  if (fetchDetailsStatus === "loading") {
    return <GenLoadingState message="Loading user details..." />;
  }

  // failed
  if (fetchDetailsStatus === "failed") {
    return (
      <NoUserDetails
        AlertCircle={AlertCircle}
        Link={Link}
        ArrowLeft={ArrowLeft}
        message="Failed to Load User"
        details="Error loading user details. Please try again."
      />
    );
  }

  // no user details found
  if (!userDetails) {
    return (
      <NoUserDetails
        AlertCircle={AlertCircle}
        Link={Link}
        ArrowLeft={ArrowLeft}
        message="User Not Found"
        details="The user you're trying to edit doesn't exist."
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-4 sm:px-10 py-15">
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
          watch={watch}
          setValue={setValue}
          isEditConfirmActive={isEditConfirmActive}
          navigate={navigate}
        />
      </div>
    </main>
  );
}
