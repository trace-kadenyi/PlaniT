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

  const basePermissions = {
    [RESOURCES.VENDOR]: [PERMISSIONS.VIEW],
    [RESOURCES.EVENT]: [PERMISSIONS.VIEW],
    [RESOURCES.TASK]: [PERMISSIONS.VIEW],
    [RESOURCES.CLIENT]: [PERMISSIONS.VIEW],
    [RESOURCES.USER]: [PERMISSIONS.VIEW], // Everyone can view users
    [RESOURCES.EXPENSE]: [PERMISSIONS.VIEW],
  };

  if (hierarchy >= ROLE_HIERARCHY[ROLES.PLANNER]) {
    // Planners get create/edit/archive for most resources
    [
      RESOURCES.VENDOR,
      RESOURCES.EVENT,
      RESOURCES.TASK,
      RESOURCES.CLIENT,
      RESOURCES.EXPENSE,
    ].forEach((resource) => {
      basePermissions[resource].push(
        PERMISSIONS.CREATE,
        PERMISSIONS.EDIT,
        PERMISSIONS.ARCHIVE
      );
    });
  }

  if (hierarchy >= ROLE_HIERARCHY[ROLES.ADMIN]) {
    // Admins and Super Admins get ALL permissions for ALL resources
    Object.values(RESOURCES).forEach((resource) => {
      basePermissions[resource].push(
        PERMISSIONS.CREATE,
        PERMISSIONS.EDIT,
        PERMISSIONS.DELETE,
        PERMISSIONS.ARCHIVE,
        PERMISSIONS.DELETE_ALL,
        PERMISSIONS.MANAGE_USERS
      );
    });
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
  if (!currentUser?.role || !resource) return false;

  const userRole = currentUser.role;

  // RULE 1: Get base permissions based on role
  const basePermissions = getBasePermissionsForRole(userRole);
  const resourcePermissions = basePermissions[resource] || [];

  if (!resourcePermissions.includes(permission)) {
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
  // Safety check
  if (!currentUser || !targetUser) return false;

  const currentRole = currentUser.role;
  const targetRole = targetUser.role || targetUser;
  const isSelf = targetUser._id && targetUser._id === currentUser._id;

  // RULE 1: Cannot modify yourself (except maybe some actions)
  if (isSelf) {
    // Can never delete yourself
    if (action === PERMISSIONS.DELETE) return false;
    // Can never change your own role (this is the fix!)
    if (action === PERMISSIONS.EDIT) return false;
    // For other actions, maybe allow (like updating profile)
    return false; // Or true if you want to allow profile updates
  }

  // RULE 2: Super admins can modify anyone else
  if (currentRole === ROLES.SUPER_ADMIN) {
    return true;
  }

  // RULE 3: Admins cannot modify super admins
  if (currentRole === ROLES.ADMIN && targetRole === ROLES.SUPER_ADMIN) {
    return false;
  }

  // RULE 4: Everyone else can only modify users with lower/equal role
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
