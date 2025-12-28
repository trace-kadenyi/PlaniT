import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit2,
  Trash2,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Briefcase
} from "lucide-react";
import { usePermissions, PERMISSIONS, RESOURCES, ROLES } from "../globalHooks/userPermissions";
import PermissionButton from "../components/buttons/PermissionButton";
import { fetchUserDetails, deleteUser } from "../redux/usersSlice";
import toast from "react-hot-toast";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";

export default function User() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { can, currentUser: authUser } = usePermissions();
  const {
    currentUser: userData,
    fetchDetailsStatus,
    fetchDetailsError,
    deleteStatus
  } = useSelector((state) => state.users);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetails(userId));
    }
  }, [dispatch, userId]);

  const handleDeleteUser = async () => {
    if (!can(PERMISSIONS.DELETE, RESOURCES.USER, userData)) {
      toast.error("You don't have permission to delete this user");
      return;
    }

    const confirmed = await DeleteConfirmationToast(
      "Delete User",
      `Are you sure you want to remove ${userData?.firstName} ${userData?.lastName} from the organization? This action cannot be undone.`
    );

    if (confirmed) {
      setIsDeleting(true);
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success("User removed successfully");
        navigate("/users");
      } catch (err) {
        toast.error(err.message || "Failed to delete user");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (fetchDetailsStatus === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62] dark:border-[#D97706]"></div>
      </div>
    );
  }

  if (fetchDetailsError || !userData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-[#E3CBC1] dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              User Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {fetchDetailsError || "The user you're looking for doesn't exist or you don't have access."}
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

  const isSelf = userData._id === authUser?._id;
  const roleColors = {
    [ROLES.SUPER_ADMIN]: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    [ROLES.ADMIN]: "bg-[#9B2C62]/10 text-[#9B2C62] dark:bg-[#9B2C62]/20 dark:text-[#D97706]",
    [ROLES.PLANNER]: "bg-[#F59E0B]/10 text-[#F59E0B] dark:bg-[#D97706]/20 dark:text-[#F59E0B]",
    [ROLES.VIEWER]: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Never logged in";
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-4 sm:p-6">
      {/* Back Navigation */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link
          to="/users"
          className="inline-flex items-center gap-2 text-[#9B2C62] dark:text-[#D97706] hover:text-[#801f4f] dark:hover:text-[#F59E0B] font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team Members
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 overflow-hidden mb-8">
          {/* Gradient Header */}
          <div className="h-2 bg-gradient-to-r from-[#9B2C62] via-[#F59E0B] to-[#FF9933]"></div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
              {/* User Info */}
              <div className="flex flex-col sm:flex-row items-start gap-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#9B2C62] to-[#F59E0B] flex items-center justify-center shadow-xl">
                    <span className="text-white text-4xl font-bold">
                      {userData.firstName[0]}{userData.lastName[0]}
                    </span>
                  </div>
                  {isSelf && (
                    <div className="absolute -bottom-2 -right-2 bg-[#F59E0B] text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md">
                      You
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      {userData.firstName} {userData.lastName}
                    </h1>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${roleColors[userData.role]}`}>
                      <Shield className="w-4 h-4" />
                      {roleLabels[userData.role]}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FFF7ED] dark:bg-gray-800/50">
                      <Mail className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                        <div className="font-medium text-gray-900 dark:text-white">{userData.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FFF7ED] dark:bg-gray-800/50">
                      <Calendar className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Joined</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatDate(userData.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FFF7ED] dark:bg-gray-800/50">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${userData.isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {userData.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {userData.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FFF7ED] dark:bg-gray-800/50">
                      <Clock className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Last Login</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatDateTime(userData.lastLogin)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 min-w-[200px]">
                <PermissionButton
                  to={`/users/${userId}/edit`}
                  permission={PERMISSIONS.EDIT}
                  resource={RESOURCES.USER}
                  target={userData}
                  tooltipTitle="Edit user details"
                  fallbackTooltip="Cannot edit this user"
                  className="flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white px-5 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </PermissionButton>

                <PermissionButton
                  permission={PERMISSIONS.DELETE}
                  resource={RESOURCES.USER}
                  target={userData}
                  onClick={handleDeleteUser}
                  loading={deleteStatus === "loading" || isDeleting}
                  disabled={deleteStatus === "loading" || isDeleting}
                  tooltipTitle="Remove user from organization"
                  fallbackTooltip="Cannot remove this user"
                  className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-5 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                >
                  <Trash2 className="w-5 h-5" />
                  {deleteStatus === "loading" || isDeleting ? "Removing..." : "Remove User"}
                </PermissionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Role Details Card */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
              Role Details
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-[#9B2C62]/5 to-[#F59E0B]/5 dark:from-gray-800/50 dark:to-gray-900/50 border border-[#9B2C62]/10 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Permissions</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {userData.role === ROLES.SUPER_ADMIN && (
                    <>
                      <li className="flex items-center gap-2">✓ Full organization access</li>
                      <li className="flex items-center gap-2">✓ Manage other super admins</li>
                      <li className="flex items-center gap-2">✓ Complete control over all settings</li>
                    </>
                  )}
                  {userData.role === ROLES.ADMIN && (
                    <>
                      <li className="flex items-center gap-2">✓ Manage users (except super admins)</li>
                      <li className="flex items-center gap-2">✓ Create/edit all events and content</li>
                      <li className="flex items-center gap-2">✓ Full administrative privileges</li>
                    </>
                  )}
                  {userData.role === ROLES.PLANNER && (
                    <>
                      <li className="flex items-center gap-2">✓ Create and edit events</li>
                      <li className="flex items-center gap-2">✓ Manage vendors and clients</li>
                      <li className="flex items-center gap-2">✓ View all organization content</li>
                      <li className="flex items-center gap-2">✗ Cannot manage users</li>
                    </>
                  )}
                  {userData.role === ROLES.VIEWER && (
                    <>
                      <li className="flex items-center gap-2">✓ View all organization content</li>
                      <li className="flex items-center gap-2">✗ Cannot create or edit anything</li>
                      <li className="flex items-center gap-2">✗ Read-only access</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Assigned Events Card */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black rounded-2xl shadow-lg border border-[#E3CBC1] dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#9B2C62] dark:text-[#D97706]" />
              Assigned Events
            </h2>

            {userData.assignedEvents && userData.assignedEvents.length > 0 ? (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-[#FFF7ED] dark:bg-gray-800/50 border border-[#F59E0B]/20 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Assigned Events</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userData.assignedEvents.length}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  This user is assigned to {userData.assignedEvents.length} event(s)
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#FFF7ED] dark:bg-gray-800/50 border border-[#F59E0B]/20 dark:border-gray-700 text-center">
                <div className="text-gray-500 dark:text-gray-400 mb-2">No events assigned</div>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  This user is not currently assigned to any events
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}