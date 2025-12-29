import { ROLES, PERMISSIONS, RESOURCES } from "./userPermissions";

// Helper to determine available roles for a user to assign
export const getAvailableRoles = (currentUserRole) => {
  const roles = [];

  if (currentUserRole === ROLES.SUPER_ADMIN) {
    roles.push(
      { value: ROLES.VIEWER, label: "Viewer" },
      { value: ROLES.PLANNER, label: "Planner" },
      { value: ROLES.ADMIN, label: "Admin" },
      { value: ROLES.SUPER_ADMIN, label: "Super Admin" }
    );
  } else if (currentUserRole === ROLES.ADMIN) {
    roles.push(
      { value: ROLES.VIEWER, label: "Viewer" },
      { value: ROLES.PLANNER, label: "Planner" },
      { value: ROLES.ADMIN, label: "Admin" }
    );
  } else {
    // Default - can't assign roles
    roles.push({ value: ROLES.VIEWER, label: "Viewer" });
  }

  return roles;
};

// Helper to get role descriptions
export const getRoleDescriptions = () => ({
  [ROLES.SUPER_ADMIN]: [
    "Full organization access including managing other super admins",
    "Complete control over all settings and configurations",
    "Can manage all users, events, vendors, and clients",
  ],
  [ROLES.ADMIN]: [
    "Can manage users (except super admins)",
    "Create/edit all events and content",
    "Full administrative privileges",
  ],
  [ROLES.PLANNER]: [
    "Can create and edit events",
    "Manage assigned vendors and clients",
    "View all organization content",
    "Cannot manage users",
  ],
  [ROLES.VIEWER]: [
    "Can view all organization content",
    "Cannot create or edit anything",
    "Read-only access",
  ],
});

// Helper to get role colors
export const getRoleColors = () => ({
  [ROLES.SUPER_ADMIN]:
    "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
  [ROLES.ADMIN]: "bg-gradient-to-r from-[#9B2C62] to-[#801f4f] text-white",
  [ROLES.PLANNER]: "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white",
  [ROLES.VIEWER]: "bg-gradient-to-r from-gray-600 to-gray-800 text-white",
});

// Helper to get role labels
export const getRoleLabels = () => ({
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Admin",
  [ROLES.PLANNER]: "Planner",
  [ROLES.VIEWER]: "Viewer",
});

// Helper to check if user can edit another user
export const canEditUser = (authUser, targetUser, can) => {
  const isSelf = authUser?._id === targetUser?._id;
  const hasPermission = can(PERMISSIONS.EDIT, RESOURCES.USER, targetUser);

  return {
    canEdit: hasPermission && !isSelf,
    isSelf,
    hasPermission,
  };
};
