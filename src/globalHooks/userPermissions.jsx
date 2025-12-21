import { useMemo } from "react";
import { useSelector } from "react-redux";

// 1. Core permissions
export const PERMISSIONS = {
  VIEW: "view",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  ARCHIVE: "archive",
  DELETE_ALL: "delete_all",
  MANAGE_USERS: "manage_users",
};

export const RESOURCES = {
  VENDOR: "vendor",
  EVENT: "event",
  TASK: "task",
  CLIENT: "client",
  USER: "user",
  EXPENSE: "expense",
};

export const ROLES = {
  VIEWER: "viewer",
  PLANNER: "planner",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

// 2. SIMPLE role hierarchy
const ROLE_HIERARCHY = {
  [ROLES.VIEWER]: 1,
  [ROLES.PLANNER]: 2,
  [ROLES.ADMIN]: 3,
  [ROLES.SUPER_ADMIN]: 4,
};

// 3. ONE SIMPLE RULE: Everyone gets base permissions based on hierarchy
const getBasePermissionsForRole = (role) => {
  const hierarchy = ROLE_HIERARCHY[role] || 0;

  const basePermissions = [PERMISSIONS.VIEW];

  if (hierarchy >= ROLE_HIERARCHY[ROLES.PLANNER]) {
    basePermissions.push(
      PERMISSIONS.CREATE,
      PERMISSIONS.EDIT,
      PERMISSIONS.ARCHIVE
    );
  }

  if (hierarchy >= ROLE_HIERARCHY[ROLES.ADMIN]) {
    // Admins and Super Admins get ALL permissions
    basePermissions.push(
      PERMISSIONS.DELETE,
      PERMISSIONS.DELETE_ALL,
      PERMISSIONS.MANAGE_USERS
    );
  }

  return basePermissions;
};

// 4. The magic function with ALL your special rules
const checkPermission = (
  currentUser,
  permission,
  resource = null,
  targetUser = null
) => {
  if (!currentUser?.role) return false;

  const userRole = currentUser.role;

  // RULE 1: Get base permissions based on role
  const basePermissions = getBasePermissionsForRole(userRole);
  if (!basePermissions.includes(permission)) {
    return false;
  }

  // RULE 2: Special case - DELETE_ALL requires Admin+ (not Planner)
  if (permission === PERMISSIONS.DELETE_ALL) {
    return userRole === ROLES.ADMIN || userRole === ROLES.SUPER_ADMIN;
  }

  // RULE 3: User management protection (Admins can't touch Super Admins)
  if (resource === RESOURCES.USER && targetUser) {
    return canModifyUser(currentUser, targetUser, permission);
  }

  // RULE 4: Prevent self-deletion
  if (
    permission === PERMISSIONS.DELETE &&
    targetUser?._id === currentUser._id
  ) {
    return false;
  }

  // For ALL other cases: if user has base permission, they're good!
  return true;
};

// 5. Special function ONLY for user modification (Super Admin protection)
export const canModifyUser = (currentUser, targetUser, action) => {
  const currentRole = currentUser.role;
  const targetRole = targetUser.role || targetUser;

  // Super admins can modify anyone (except themselves for delete)
  if (currentRole === ROLES.SUPER_ADMIN) {
    if (action === PERMISSIONS.DELETE && targetUser._id === currentUser._id) {
      return false; // Can't delete yourself
    }
    return true;
  }

  // Admins cannot modify super admins
  if (currentRole === ROLES.ADMIN && targetRole === ROLES.SUPER_ADMIN) {
    return false;
  }

  // Everyone else can only modify users with lower/equal role
  const currentLevel = ROLE_HIERARCHY[currentRole];
  const targetLevel = ROLE_HIERARCHY[targetRole];

  return currentLevel >= targetLevel;
};

// 6. Main hook - SIMPLE API
export const usePermissions = () => {
  const currentUser = useSelector((state) => state.auth.user);

  const can = useMemo(() => {
    return (permission, resource = null, target = null) => {
      return checkPermission(currentUser, permission, resource, target);
    };
  }, [currentUser]);

  const isRole = useMemo(() => {
    return (...roles) => {
      return currentUser?.role && roles.includes(currentUser.role);
    };
  }, [currentUser]);

  return { can, isRole, currentUser };
};
