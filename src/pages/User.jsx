import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Shield, ArrowLeft, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

import { fetchUserDetails, deleteUser } from "../redux/usersSlice";
import { fetchAllTasks } from "../redux/tasksSlice";

import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
  ROLES,
} from "../globalHooks/userPermissions";
import PermissionButton from "../components/buttons/PermissionButton";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";
import { createUserDeleteHandler } from "../globalHandlers/createUserDeleteHandler";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import { GenLoadingState } from "../components/shared/LoadingStates";
import useUserEvents from "../globalHooks/useUserEvents";
import UserNotFound from "../components/user/UserManagement/UserNotFound";
import UserProfileCard from "../components/user/UserManagement/UserProfileCard";

export default function User() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { can, currentUser: authUser } = usePermissions();
  const tasksState = useSelector((state) => state.tasks);

  const {
    currentUser: userData,
    fetchDetailsStatus,
    fetchDetailsError,
    deleteStatus,
  } = useSelector((state) => state.users);

  // fetch user details
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetails(userId));
    }
  }, [dispatch, userId]);

  // Fetch tasks when user data loads
  useEffect(() => {
    if (userData && userData._id) {
      dispatch(fetchAllTasks());
    }
  }, [userData, dispatch]);

  // Calculate user tasks and events from Redux state:
  const userTasks = userData
    ? tasksState.items.filter((task) => task.assignedTo?._id === userData._id)
    : [];

  // Calculate userEvents from userTasks
  const userEvents = useUserEvents(userTasks);

  // handle remove user
  const handleRemoveUser = (userId) => {
    return createUserDeleteHandler(
      dispatch,
      userId,
      navigate,
      deleteUser,
      toast,
      toastWithProgress,
      DeleteConfirmationToast
    )();
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
          PermissionButton={PermissionButton}
          PERMISSIONS={PERMISSIONS}
          RESOURCES={RESOURCES}
          authUser={authUser}
          userId={userId}
          handleRemoveUser={handleRemoveUser}
          deleteStatus={deleteStatus}
        />

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Role & Permissions Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-lg p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#FF9933] w-full h-full rounded-bl-full"></div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#FF9933]">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Role Details & Permissions
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 border border-[#F3EDE9] dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                  Current Permissions
                </h3>
                <ul className="space-y-2 text-sm">
                  {userData.role === ROLES.SUPER_ADMIN && (
                    <>
                      <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Full organization access
                      </li>
                      <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Manage other super admins
                      </li>
                      <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Complete control over all settings
                      </li>
                    </>
                  )}
                  {userData.role === ROLES.ADMIN && (
                    <>
                      <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Manage users (except super admins)
                      </li>
                      <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Create/edit all events and content
                      </li>
                      <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Full administrative privileges
                      </li>
                    </>
                  )}
                  {userData.role === ROLES.PLANNER && (
                    <>
                      <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Create and edit events
                      </li>
                      <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Manage vendors and clients
                      </li>
                      <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        View all organization content
                      </li>
                      <li className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Cannot manage users
                      </li>
                    </>
                  )}
                  {userData.role === ROLES.VIEWER && (
                    <>
                      <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        View all organization content
                      </li>
                      <li className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Cannot create or edit anything
                      </li>
                      <li className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Read-only access
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Assigned Events Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-lg p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="bg-gradient-to-br from-[#9B2C62] to-[#801f4f] w-full h-full rounded-bl-full"></div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#9B2C62] to-[#801f4f]">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Associated Events & Tasks
              </h2>
            </div>

            {userEvents.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Events
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-white">
                    {userEvents.length}
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {userTasks.length}
                    {userTasks.length > 1
                      ? " individual tasks"
                      : " individual task"}
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#9B2C62] to-[#F59E0B] dark:from-pink-900 dark:to-[#D97706]"
                        style={{
                          width: `${Math.min(userEvents.length * 20, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Events List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {userEvents.slice(0, 5).map((event) => (
                    <div
                      key={event._id}
                      className="p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg border border-[#F3EDE9] dark:border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4
                            onClick={() => navigate(`/events/${event._id}`)}
                            className="font-medium text-gray-800 dark:text-white cursor-pointer"
                          >
                            {event.name}
                          </h4>
                          {event.date && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Event Date:{" "}
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-[#D97706] dark:bg-[#9B2C62] text-white dark:text-white px-2 py-1 rounded">
                              {event.taskCount} task
                              {event.taskCount !== 1 ? "s" : ""}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              •
                              {
                                event.tasks.filter(
                                  (t) => t.status === "Completed"
                                ).length
                              }{" "}
                              completed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {userEvents.length > 5 && (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                      + {userEvents.length - 5} more events
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-8 border border-[#F3EDE9] dark:border-gray-700 text-center">
                <div className="mx-auto max-w-sm flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-[#F59E0B]" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    No events assigned
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    This user is not currently assigned to any tasks or events
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
