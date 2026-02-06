import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Shield, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import {
  fetchUserDetails,
  deleteUser,
  fetchUserUpdateHistory,
  reactivateUser,
} from "../redux/usersSlice";
import { logoutUser } from "../redux/authSlice";
import { fetchAllTasks } from "../redux/tasksSlice";

import { usePermissions, ROLES } from "../globalHooks/userPermissions";
import { createUserDeactivateHandler } from "../globalHandlers/createUserDeactivateHandler";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import { GenLoadingState } from "../components/shared/LoadingStates";
import { useUserMemoizedData } from "../globalHooks/useUserMemoizedData";
import UserNotFound from "../components/user/UserManagement/UserNotFound";
import UserProfileCard from "../components/user/UserManagement/UserProfileCard";
import { UserDetailsGrid } from "../components/user/UserManagement/UserDetailsGrid";
import UserUpdateHistory from "../components/user/UserManagement/UserUpdateHistory";
import { useToastLock } from "../globalUtils/useToastLock";
import UserDeactivateConfirmationToast from "../globalUtils/userDeactivateConfirmationToast";
import { createUserReactivateHandler } from "../globalHandlers/createUserReactivateHandler";
import UserReactivateConfirmationToast from "../globalUtils/userReactivateConfirmationToast";

export default function User() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toastLock = useToastLock();

  const { can, currentUser: authUser } = usePermissions();

  // selectors
  const {
    currentUser: userData,
    fetchDetailsStatus,
    fetchDetailsError,
    deleteStatus,
    reactivateStatus,
  } = useSelector((state) => state.users);

  const {
    updateHistory,
    fetchHistoryStatus,
    userTasks,
    userEvents,
    tasksState,
  } = useUserMemoizedData(userId, userData);

  // fetch user details
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetails(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    // Check if viewer/planner trying to view deactivated user
    if (
      userData?.isDeactivated &&
      authUser &&
      (authUser.role === ROLES.VIEWER || authUser.role === ROLES.PLANNER)
    ) {
      // Redirect to users list
      navigate("/users");
      toastWithProgress("You don't have permission to view this user");
    }
  }, [userData, authUser, navigate, toast]);

  // Fetch tasks when user data loads
  useEffect(() => {
    if (userData && userData._id) {
      dispatch(fetchAllTasks());
    }
  }, [userData, dispatch]);

  // Fetch update history when user data loads if authorized
  useEffect(() => {
    const isSelf = userData?._id === authUser?._id;

    // Check if user is admin trying to view super admin
    const isAdminViewingSuperAdmin =
      authUser?.role === "admin" && userData?.role === "super_admin";

    // Can view history if:
    // 1. It's themselves (isSelf), OR
    // 2. They're a super admin, OR
    // 3. They're an admin AND the target user is NOT a super admin
    const canViewHistory =
      isSelf ||
      authUser?.role === "super_admin" ||
      (authUser?.role === "admin" && !isAdminViewingSuperAdmin);

    if (userData && userData._id && canViewHistory) {
      dispatch(fetchUserUpdateHistory(userId));
    }
  }, [dispatch, userId, userData, authUser]);

  // handle remove user
  const handleRemoveUser = (userId) => {
    return createUserDeactivateHandler(
      dispatch,
      userId,
      navigate,
      deleteUser,
      toast,
      toastWithProgress,
      UserDeactivateConfirmationToast,
      toastLock,
    )();
  };

  // handle reactivate user
  const handleReactivateUser = (userId) => {
    return createUserReactivateHandler(
      dispatch,
      userId,
      navigate,
      reactivateUser,
      toast,
      toastWithProgress,
      UserReactivateConfirmationToast,
      toastLock,
    )();
  };

  // Handle logout
  const handleLogout = () => {
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

  // handle loading state
  if (fetchDetailsStatus === "loading" || tasksState.status === "loading") {
    return <GenLoadingState message="Loading user details..." />;
  }

  // user not found UI
  if (fetchDetailsError || !userData) {
    return (
      <UserNotFound
        Shield={Shield}
        fetchDetailsError={fetchDetailsError}
        ArrowLeft={ArrowLeft}
        Link={Link}
      />
    );
  }

  // logged in user declaration
  const isSelf = userData._id === authUser?._id;

  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-4 sm:p-10 pb-15">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F59E0B]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#9B2C62]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F59E0B]/10 rounded-full blur-lg dark:bg-[#F59E0B]/20"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#9B2C62]/10 rounded-full blur-lg dark:bg-[#9B2C62]/20"></div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706] mt-10 mb-2 sm:my-2">
                Team Member Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-4xl">
                View detailed information about team member's role, permissions,
                and activity
              </p>
            </div>

            <Link
              to="/users"
              className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-[#9B2C62] dark:text-[#D97706] hover:text-[#801f4f] dark:hover:text-[#F59E0B] font-medium px-4 py-3 rounded-xl border border-[#F3EDE9] dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Team
            </Link>
          </div>
        </div>

        {/* Main Profile Card */}
        <UserProfileCard
          userData={userData}
          isSelf={isSelf}
          authUser={authUser}
          userId={userId}
          handleRemoveUser={handleRemoveUser}
          handleReactivateUser={handleReactivateUser}
          deleteStatus={deleteStatus}
          reactivateStatus={reactivateStatus}
          onLogout={handleLogout}
          isInactive={userData.isDeactivated}
        />

        {/* Details Grid */}
        <UserDetailsGrid
          userData={userData}
          userEvents={userEvents}
          userTasks={userTasks}
          isInactive={userData.isDeactivated}
        />

        {/* Update History Section */}
        <UserUpdateHistory
          updateHistory={updateHistory}
          fetchHistoryStatus={fetchHistoryStatus}
          isSelf={isSelf}
          authUser={authUser}
          userRole={userData.role}
        />
      </div>
    </main>
  );
}
