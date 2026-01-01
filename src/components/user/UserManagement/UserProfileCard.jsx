import {
  Mail,
  Shield,
  Edit2,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  getRoleColors,
  getRoleLabels,
} from "../../../globalHooks/usePermissionHelpers";
import {
  formatYearMonthDay,
  formatHourMinute,
} from "../../../globalUtils/dateHelpers";

export default function UserProfileCard({
  userData,
  isSelf,
  PermissionButton,
  PERMISSIONS,
  RESOURCES,
  authUser,
  userId,
  handleRemoveUser,
  deleteStatus,
}) {
  const roleColors = getRoleColors();
  const roleLabels = getRoleLabels();

  return (
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

                {/* delete btn */}
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
                  {deleteStatus === "loading" ? "Removing..." : "Remove User"}
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
              Member since {formatYearMonthDay(userData.createdAt)}
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
                      ? formatHourMinute(userData.lastLogin)
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
                <span className="text-gray-600 dark:text-gray-400">Email</span>
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
  );
}
