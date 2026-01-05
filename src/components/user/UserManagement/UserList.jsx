import React from "react";
import { Tooltip } from "@mui/material";

import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
  canModifyUser,
  ROLES,
} from "../../../globalHooks/userPermissions";
import PermissionButton from "../../buttons/PermissionButton";
import { truncateText } from "../../taskManagerCollection/utils/formatting";
import { RemoveUserBtn } from "../../buttons/UserButtons";

const UserList = ({ users, editable = false, onRoleChange, onRemoveUser }) => {
  const { can, currentUser } = usePermissions();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-auto dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-r dark:border-gray-900/10 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
          Team Members ({users.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {users
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
            />
          ))}
      </div>
    </div>
  );
};

const UserListItem = ({ user, editable, onRoleChange, onRemoveUser }) => {
  const { can, currentUser } = usePermissions();

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

      <div className="flex items-center space-x-4 ml-10 flex-wrap sm:flex-nowrap gap-2 sm:ml-0">
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
        {editable && (
          <RemoveUserBtn
            onRemoveUser={onRemoveUser}
            user={user}
            currentUser={currentUser}
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
  const { can, currentUser } = usePermissions();

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
    <select
      value={user.role}
      onChange={
        canEditRole ? (e) => onRoleChange(user._id, e.target.value) : undefined
      }
      disabled={shouldDisable}
      className={`min-w-[120px] border border-[#9B2C62]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#9B2C62] focus:border-[#9B2C62] transition-all duration-200 bg-white shadow-sm hover:border-[#9B2C62]/40 text-gray-700 dark:bg-black dark:border-gray-900 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] dark:text-gray-300 ${
        shouldDisable ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {getAvailableRoles().map((role) => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </select>
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
        <span>{select}</span>
      </Tooltip>
    );
  }

  return select;
};

export default UserList;
