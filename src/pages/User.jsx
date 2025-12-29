import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Shield,
  Edit2,
  Trash2,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
  ROLES,
} from "../globalHooks/userPermissions";
import PermissionButton from "../components/buttons/PermissionButton";

import { fetchUserDetails, deleteUser } from "../redux/usersSlice";
import { fetchAllTasks } from "../redux/tasksSlice";

import toast from "react-hot-toast";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";
import { createUserDeleteHandler } from "../globalHandlers/createUserDeleteHandler";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import { GenLoadingState } from "../components/shared/LoadingStates";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { can, currentUser: authUser } = usePermissions();
  // const [userTasks, setUserTasks] = useState([]);
  // const [userEvents, setUserEvents] = useState([]);
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
  const userEvents = React.useMemo(() => {
    if (!userTasks.length) return [];

    const eventsMap = new Map();
    userTasks.forEach((task) => {
      if (task.eventId) {
        const eventId = task.eventId._id || task.eventId;
        if (!eventsMap.has(eventId)) {
          eventsMap.set(eventId, {
            _id: eventId,
            name: task.eventName || "Unnamed Event",
            date: task.eventId?.date,
            taskCount: 1,
            tasks: [task],
          });
        } else {
          const event = eventsMap.get(eventId);
          event.taskCount += 1;
          event.tasks.push(task);
        }
      }
    });

    return Array.from(eventsMap.values());
  }, [userTasks]);

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

  if (fetchDetailsStatus === "loading" || tasksState.status === "loading") {
    return <GenLoadingState message="Loading user details..." />;
  }

  if (fetchDetailsError || !userData) {
    return (
      <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-4 sm:p-10 pb-15">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F59E0B]/10 rounded-full blur-lg dark:bg-[#F59E0B]/20"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#9B2C62]/10 rounded-full blur-lg dark:bg-[#9B2C62]/20"></div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706] mt-10 mb-2 sm:my-2">
                User Not Found
              </h1>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-sm p-8 text-center dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              User Not Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {fetchDetailsError ||
                "The user you're looking for doesn't exist or you don't have access."}
            </p>
            <Link
              to="/users"
              className="inline-flex items-center gap-2 bg-[#9B2C62] hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Team Members
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isSelf = userData._id === authUser?._id;
  const roleColors = {
    [ROLES.SUPER_ADMIN]:
      "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
    [ROLES.ADMIN]: "bg-gradient-to-r from-[#9B2C62] to-[#801f4f] text-white",
    [ROLES.PLANNER]: "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white",
    [ROLES.VIEWER]: "bg-gradient-to-r from-gray-600 to-gray-800 text-white",
  };

  const roleLabels = {
    [ROLES.SUPER_ADMIN]: "Super Admin",
    [ROLES.ADMIN]: "Admin",
    [ROLES.PLANNER]: "Planner",
    [ROLES.VIEWER]: "Viewer",
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Never logged in";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-lg p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 mb-8 hover:shadow-xl transition-all duration-300 group">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="bg-gradient-to-br from-[#9B2C62] to-[#F59E0B] w-full h-full rounded-bl-full"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6 sm:gap-10 lg:gap-6 justify-center">
              <div className="flex items-center flex-col gap-5">
                <div className="relative">
                  {/* Deep Mulberry Focused Avatar Gradient */}
                  <div className="w-25 h-25 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full relative flex items-center justify-center shadow-xl overflow-hidden">
                    {/* Rich mulberry base with subtle gold accents */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#9B2C62] via-[#801f4f] to-[#9B2C62]/90"></div>

                    {/* Elegant gold accent ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-[#F59E0B]/30 to-transparent"></div>

                    {/* Soft inner highlight */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/10 via-transparent to-[#9B2C62]/20"></div>

                    {/* Deep mulberry overlay with shimmer */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#9B2C62]/70 via-[#801f4f]/80 to-[#9B2C62]/90 backdrop-blur-[1px]"></div>

                    {/* Gold accent corner */}
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-full blur-md opacity-40"></div>

                    {/* Inner content with enhanced visibility */}
                    <span className="relative text-white text-5xl font-bold z-10 text-shadow-lg">
                      {userData.firstName[0]}
                      {userData.lastName[0]}
                    </span>
                  </div>

                  {/* "You" badge */}
                  {isSelf && (
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-xs px-4 py-1.5 rounded-full font-medium shadow-lg z-20">
                      You
                    </div>
                  )}
                </div>

                <div className="text-center lg:text-left">
                  <div
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold ${
                      roleColors[userData.role]
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    {roleLabels[userData.role]}
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div>
                <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-700 mx-auto">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
                    Actions
                  </h3>

                  <div className="space-y-2 flex flex-col">
                    {/* edit btn */}
                    <PermissionButton
                      to={`/users/${userId}/edit`}
                      permission={PERMISSIONS.EDIT}
                      resource={RESOURCES.USER}
                      target={userData}
                      tooltipTitle="Edit user details"
                      fallbackTooltip={`${
                        authUser.firstName === userData.firstName &&
                        authUser.lastName === userData.lastName &&
                        (authUser.role === "super_admin" ||
                          authUser.role === "admin")
                          ? "You cannot edit your own profile"
                          : "You do not have permission to edit this user"
                      }`}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#9B2C62] to-[#801f4f] hover:opacity-90 text-white px-5 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Edit2 className="w-5 h-5" />
                      Edit Profile
                    </PermissionButton>

                    <PermissionButton
                      permission={PERMISSIONS.DELETE}
                      resource={RESOURCES.USER}
                      target={userData}
                      onClick={() => handleRemoveUser(userId)}
                      loading={deleteStatus === "loading"}
                      disabled={deleteStatus === "loading"}
                      tooltipTitle="Remove user from organization"
                      fallbackTooltip={`${
                        authUser.firstName === userData.firstName &&
                        authUser.lastName === userData.lastName &&
                        (authUser.role === "super_admin" ||
                          authUser.role === "admin")
                          ? "You cannot remove your own profile"
                          : "You do not have permission to remove this user"
                      }`}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-white/80 to-rose-50/80 dark:from-gray-900/30 dark:to-[#9B2C62]/10 hover:from-rose-50 hover:to-rose-100/80 dark:hover:from-gray-800/40 dark:hover:to-[#9B2C62]/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-[#9B2C62]/30 px-5 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-[#9B2C62]/50 group"
                    >
                      <Trash2 className="w-5 h-5" />
                      {deleteStatus === "loading"
                        ? "Removing..."
                        : "Remove User"}
                    </PermissionButton>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isSelf
                        ? "Note: You cannot edit or delete your own account"
                        : "Only admins can modify user roles and permissions"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 break-words">
                  {userData.firstName} {userData.lastName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Member since {formatDate(userData.createdAt)}
                </p>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-4 border border-[#F3EDE9] dark:border-gray-700">
                  <div className="flex items-center flex-wrap gap-3">
                    <div
                      className={`p-3 rounded-full ${
                        userData.isActive
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}
                    >
                      {userData.isActive ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Current Status
                      </p>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        {userData.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-4 border border-[#F3EDE9] dark:border-gray-700">
                  <div className="flex items-center flex-wrap gap-3">
                    <div className="p-3 rounded-full bg-[#9B2C62]/10 dark:bg-[#9B2C62]/20">
                      <Clock className="w-6 h-6 text-[#9B2C62] dark:text-[#D97706]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last Login
                      </p>
                      <p className="text-md font-bold text-gray-800 dark:text-white">
                        {userData.lastLogin
                          ? formatDateTime(userData.lastLogin)
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg gap-2 flex-wrap">
                    <span className="text-gray-600 dark:text-gray-400">
                      Email
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white break-all">
                      {userData.email}
                    </span>
                  </div>
                  {userData.phone && (
                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">
                        Phone
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {userData.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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
                Assigned Events & Tasks
              </h2>
            </div>

            {userEvents.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-5 border border-[#F3EDE9] dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Assigned Events
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-white">
                    {userEvents.length}
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Across {userTasks.length} total tasks
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#9B2C62] to-[#F59E0B]"
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
                          <h4 className="font-medium text-gray-800 dark:text-white">
                            {event.name}
                          </h4>
                          {event.date && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Event Date:{" "}
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
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

        {/* Footer Note */}
        <div className="text-center mt-10">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Profile last updated:{" "}
            {formatDateTime(userData.updatedAt || userData.createdAt)}
          </p>
        </div>
      </div>
    </main>
  );
}
