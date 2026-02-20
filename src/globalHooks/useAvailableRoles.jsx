import { useMemo } from "react";

import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
  ROLES,
} from "./userPermissions";

/**
 * Custom hook to get available roles based on user permissions
 * @param {Object} options - Configuration options
 * @param {Object} options.targetUser - The user being modified (optional)
 * @returns {Array} Array of available roles with value and label
 */
export const useAvailableRoles = (targetUser = null) => {
  const { can, currentUser } = usePermissions();

  return useMemo(() => {
    const roles = [
      { value: ROLES.VIEWER, label: "Viewer" },
      { value: ROLES.PLANNER, label: "Planner" },
    ];

    // Check if current user can assign ADMIN role
    const canAssignAdmin = can(PERMISSIONS.EDIT, RESOURCES.USER, {
      role: ROLES.ADMIN,
      ...(targetUser && { targetUser }),
    });

    if (canAssignAdmin) {
      roles.push({ value: ROLES.ADMIN, label: "Admin" });
    }

    // Check if current user can assign SUPER_ADMIN role
    const canAssignSuperAdmin = can(PERMISSIONS.EDIT, RESOURCES.USER, {
      role: ROLES.SUPER_ADMIN,
      ...(targetUser && { targetUser }),
    });

    if (canAssignSuperAdmin) {
      roles.push({ value: ROLES.SUPER_ADMIN, label: "Super Admin" });
    }

    return roles;
  }, [can, targetUser]);
};

/**
 * Utility function to get available roles (for non-hook usage)
 * @param {Object} permissions - The permissions object from usePermissions
 * @param {Object} targetUser - The user being modified (optional)
 * @returns {Array} Array of available roles with value and label
 */
export const getAvailableRoles = (permissions, targetUser = null) => {
  const { can } = permissions;

  const roles = [
    { value: ROLES.VIEWER, label: "Viewer" },
    { value: ROLES.PLANNER, label: "Planner" },
  ];

  const canAssignAdmin = can(PERMISSIONS.EDIT, RESOURCES.USER, {
    role: ROLES.ADMIN,
    ...(targetUser && { targetUser }),
  });

  if (canAssignAdmin) {
    roles.push({ value: ROLES.ADMIN, label: "Admin" });
  }

  const canAssignSuperAdmin = can(PERMISSIONS.EDIT, RESOURCES.USER, {
    role: ROLES.SUPER_ADMIN,
    ...(targetUser && { targetUser }),
  });

  if (canAssignSuperAdmin) {
    roles.push({ value: ROLES.SUPER_ADMIN, label: "Super Admin" });
  }

  return roles;
};
