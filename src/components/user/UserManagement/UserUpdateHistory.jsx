import React, { useState } from "react";
import {
  History,
  User,
  Shield,
  Key,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";

import { ViewUpdateHistory } from "../../ui/Button";

const UserUpdateHistory = ({
  updateHistory,
  fetchHistoryStatus,
  isSelf,
  authUser,
  userRole,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // Function to get icon for update type
  const getUpdateIcon = (type) => {
    switch (type) {
      case "role_change":
        return <Shield className="w-4 h-4 dark:text-white" />;
      case "password_change":
        return <Key className="w-4 h-4 dark:text-white" />;
      case "profile_update":
        return <User className="w-4 h-4 dark:text-white" />;
      default:
        return <History className="w-4 h-4 dark:text-white" />;
    }
  };

  // Function to get field icon
  const getFieldIcon = (field) => {
    switch (field) {
      case "phone":
        return <Phone className="w-3 h-3" />;
      case "email":
        return <Mail className="w-3 h-3" />;
      case "password":
        return <Key className="w-3 h-3" />;
      case "role":
        return <Shield className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Check if user can view history (only self or admins)
  const canViewHistory = () => {
    if (isSelf) return true;
    if (authUser?.role === "super_admin") return true;

    // Admins can only view non-super-admin history
    if (authUser?.role === "admin") {
      return userRole !== "super_admin";
    }

    return false;
  };

  if (!canViewHistory()) {
    return null; // Don't show history section
  }

  //   IP/Browser info check
  const canViewIpInfo = () => {
    // Only super admins can see IP info for super admins
    if (userRole === "super_admin" && authUser?.role !== "super_admin") {
      return false;
    }

    return ["super_admin", "admin"].includes(authUser?.role);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#F3EDE9] shadow-lg p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 mb-6 hover:shadow-xl transition-all duration-300 group">
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
        <div className="bg-gradient-to-br from-[#9B2C62] to-[#F59E0B] w-full h-full rounded-bl-full"></div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#801f4f] to-[#9B2C62]">
          <History className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Update History
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Recent changes to this profile
          </p>
        </div>
      </div>

      {fetchHistoryStatus === "loading" ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9B2C62]"></div>
        </div>
      ) : updateHistory.length === 0 ? (
        <div className="bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl p-8 border border-[#F3EDE9] dark:border-gray-700 text-center">
          <div className="mx-auto max-w-sm flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
              No update history
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No changes have been made to this profile yet
            </p>
          </div>
        </div>
      ) : isExpanded ? (
        <div className="space-y-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Showing last {updateHistory.length} update
            {updateHistory.length !== 1 ? "s" : ""}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {updateHistory.map((update, index) => (
              <div
                key={update._id || index}
                className="p-4 bg-gradient-to-br from-[#FFF9F5] to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl border border-[#F3EDE9] dark:border-gray-700 hover:border-[#9B2C62]/50 dark:hover:border-[#D97706]/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2 flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#9B2C62]/10 dark:bg-[#9B2C62]/20">
                      {getUpdateIcon(update.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white text-sm">
                        {update.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Updated by: {update.updatedBy?.firstName || "Unknown"}
                        {!isSelf && ` (${update.updatedByRole})`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-auto sm:ml-0">
                    {new Date(update.createdAt).toLocaleDateString()} at{" "}
                    {new Date(update.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Show detailed changes if available */}
                {update.changes && update.changes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Changes made:
                    </div>
                    <div className="space-y-2">
                      {update.changes.map((change, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          {getFieldIcon(change.field) && (
                            <div className="text-[#9B2C62] dark:text-[#D97706]">
                              {getFieldIcon(change.field)}
                            </div>
                          )}
                          <span className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium capitalize">
                              {change.field
                                .replace(/([A-Z])/g, " $1")
                                .toLowerCase()}
                              :
                            </span>{" "}
                            {change.field === "password" ? (
                              <span className="text-gray-500 dark:text-gray-400">
                                ••••••••
                              </span>
                            ) : (
                              <>
                                {change.oldValue ? (
                                  <>
                                    <span className="text-red-600 dark:text-red-400 line-through">
                                      {change.oldValue}
                                    </span>
                                    {" → "}
                                    <span className="text-green-600 dark:text-green-500">
                                      {change.newValue}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-green-600 dark:text-green-400">
                                    {change.newValue}
                                  </span>
                                )}
                              </>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* IP and Browser info (for admins) */}
                {canViewIpInfo() && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">From IP:</span>{" "}
                      {update.ipAddress || "Unknown"}
                      {update.userAgent && (
                        <span className="ml-4">
                          <span className="font-medium">Browser:</span>{" "}
                          {update.userAgent.substring(0, 50)}
                          {update.userAgent.length > 50 ? "..." : ""}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Only a maximum of 50 updates will be stored • Total updates:{" "}
              {updateHistory.length}
            </p>
          </div>
        </div>
      ) : (
        <ViewUpdateHistory
          setIsExpanded={setIsExpanded}
          History={History}
          updateHistory={updateHistory}
          ChevronDown={ChevronDown}
        />
      )}
    </div>
  );
};

export default UserUpdateHistory;
