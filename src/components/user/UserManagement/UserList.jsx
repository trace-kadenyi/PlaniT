import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Tooltip, CircularProgress } from "@mui/material";

import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
  canModifyUser,
  ROLES,
} from "../../../globalHooks/userPermissions";
import { truncateText } from "../../taskManagerCollection/utils/formatting";
import {
  DeactivateUserBtn,
  ReactivateUserBtn,
} from "../../buttons/UserButtons";

const UserList = ({
  users,
  editable = false,
  onRoleChange,
  onRemoveUser,
  onReactivateUser,
}) => {
  const { can, currentUser, isRole } = usePermissions();

  // Filter users based on permissions
  const filteredUsers = useMemo(() => {
    if (!users || users.length === 0) return [];

    // If current user is viewer or planner, filter out deactivated users
    if (isRole(ROLES.VIEWER, ROLES.PLANNER)) {
      return users.filter((user) => !user.isDeactivated);
    }

    // Admin and Super Admin can see all users
    return users;
  }, [users, isRole]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-auto dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-r dark:border-gray-900/10 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          Team Members ({filteredUsers.length})
          {/* Show indicator for filtered view */}
          {isRole(ROLES.VIEWER, ROLES.PLANNER) &&
            users.length !== filteredUsers.length && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                (Showing only active users)
              </span>
            )}
        </h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {filteredUsers
          .filter((user) => user && user._id)
          .sort((a, b) => {
            if (a._id === currentUser?._id) return -1;
            if (b._id === currentUser?._id) return 1;
            return 0;
          })
          .map((user) => (
            <UserListItem
              key={user._id.toString()}
              user={user}
              editable={editable}
              onRoleChange={onRoleChange}
              onRemoveUser={onRemoveUser}
              onReactivateUser={onReactivateUser}
            />
          ))}
      </div>
    </div>
  );
};

const UserListItem = ({
  user,
  editable,
  onRoleChange,
  onRemoveUser,
  onReactivateUser,
}) => {
  const { can, currentUser } = usePermissions();
  const { deleteStatus, deletingUserId, reactivateStatus, reactivatingUserId } =
    useSelector((state) => state.users);

  const isDeletingUser =
    deleteStatus === "loading" && deletingUserId === user._id;

  const isReactivatingUser =
    reactivateStatus === "loading" && reactivatingUserId === user._id;

  // Check if user has EDIT permission for this specific user
  const hasEditPermission = can(PERMISSIONS.EDIT, RESOURCES.USER, user);
  // Combine with canModifyUser to ensure hierarchy rules are respected
  const canEditRole =
    hasEditPermission && canModifyUser(currentUser, user, PERMISSIONS.EDIT);

  return (
    <div className="px-6 py-4 flex flex-col gap-3 sm:items-center justify-between sm:flex-row">
      <a href={`users/${user._id}`} className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-[#9B2C62] rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {user.firstName[0]}
            {user.lastName[0]}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-300">
            {truncateText(`${user.firstName} ${user.lastName}`, 25)}
            {user._id === currentUser?._id && (
              <span className="ml-2 text-xs bg-[#F59E0B] text-white px-2 py-1 rounded-full">
                You
              </span>
            )}
          </h3>
          <p className="text-gray-600 dark:text-gray-400/80 text-sm">
            {truncateText(`${user.email}`, 25)}
          </p>
        </div>
      </a>

      <div className="flex items-center space-x-4 ml-10 flex-wrap sm:flex-nowrap gap-2 sm:ml-0 px-4">
        {/* Role Display/Selector */}
        {editable && canEditRole ? (
          <RoleSelector
            user={user}
            currentUser={currentUser}
            onRoleChange={onRoleChange}
          />
        ) : (
          <RoleDisplay user={user} />
        )}

        {/* Delete Button */}
        {editable && !user.isDeactivated && (
          <DeactivateUserBtn
            onRemoveUser={onRemoveUser}
            user={user}
            currentUser={currentUser}
            isLoading={isDeletingUser}
          />
        )}

        {editable && user.isDeactivated && (
          <ReactivateUserBtn
            onReactivateUser={onReactivateUser}
            user={user}
            currentUser={currentUser}
            isLoading={isReactivatingUser}
          />
        )}
      </div>
    </div>
  );
};

const RoleDisplay = ({ user }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300">
    {user.role === ROLES.SUPER_ADMIN ? "Super Admin" : user.role}
  </span>
);

const RoleSelector = ({ user, onRoleChange }) => {
  const { updateRoleStatus, updatingUserId } = useSelector(
    (state) => state.users,
  );
  const { can, currentUser } = usePermissions();

  const isUpdatingThisUser =
    updateRoleStatus === "loading" && updatingUserId === user._id;

  // Check permissions again in the selector
  const hasEditPermission = can(PERMISSIONS.EDIT, RESOURCES.USER, user);
  const canModifyThisUser = canModifyUser(currentUser, user, PERMISSIONS.EDIT);
  const canEditRole = hasEditPermission && canModifyThisUser;
  const shouldDisable = !canEditRole;

  const getAvailableRoles = () => {
    const roles = [
      { value: ROLES.VIEWER, label: "Viewer" },
      { value: ROLES.PLANNER, label: "Planner" },
    ];

    // Check if current user can assign ADMIN role
    const canAssignAdmin = can(PERMISSIONS.EDIT, RESOURCES.USER, {
      role: ROLES.ADMIN,
    });
    if (canAssignAdmin) {
      roles.push({ value: ROLES.ADMIN, label: "Admin" });
    }

    // Check if current user can assign SUPER_ADMIN role
    const canAssignSuperAdmin = can(PERMISSIONS.EDIT, RESOURCES.USER, {
      role: ROLES.SUPER_ADMIN,
    });
    if (canAssignSuperAdmin) {
      roles.push({ value: ROLES.SUPER_ADMIN, label: "Super Admin" });
    }

    return roles;
  };

  const select = (
    <div className="relative min-w-[120px] h-[38px] flex items-center justify-center">
      {isUpdatingThisUser ? (
        <div
          className="w-full h-full flex items-center justify-center
    border border-[#9B2C62]/20 rounded-lg
    bg-white shadow-sm
    dark:bg-black dark:border-gray-800/60
    animate-pulse"
        >
          <CircularProgress
            size={18}
            color="inherit"
            className="text-[#9B2C62] dark:text-[#F59E0B]"
          />
        </div>
      ) : (
        <select
          value={user.role}
          onChange={
            canEditRole
              ? (e) => onRoleChange(user._id, e.target.value)
              : undefined
          }
          disabled={shouldDisable || user.isDeactivated}
          className={`min-w-[120px] border border-[#9B2C62]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#9B2C62] focus:border-[#9B2C62] transition-all duration-200 bg-white shadow-sm hover:border-[#9B2C62]/40 text-gray-700 dark:bg-black dark:border-gray-800/60 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] dark:text-gray-300 ${
            shouldDisable || user.isDeactivated ? "opacity-60 cursor-help" : ""
          }`}
        >
          {getAvailableRoles().map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );

  if (shouldDisable) {
    return (
      <Tooltip
        title={
          user._id === currentUser?._id
            ? "Cannot change your own role"
            : "Insufficient permissions to change this user's role"
        }
        arrow
      >
        <span className="inline-block">{select}</span>
      </Tooltip>
    );
  }

  if (user.isDeactivated) {
    return (
      <Tooltip title={"Reactivate user to update role"} arrow>
        <span className="inline-block">{select}</span>
      </Tooltip>
    );
  }

  return select;
};

export default UserList;
