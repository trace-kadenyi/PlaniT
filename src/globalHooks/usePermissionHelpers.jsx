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
const ROLE_PERMISSION_TEXTS = {
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
};

// Smart helper to check if a permission is restricted
const isRestrictedPermission = (text) => {
  const lowerText = text.toLowerCase().trim();

  // Rules for detecting restricted permissions (in order of priority)
  const restrictedRules = [
    // Exact negative phrases at the start
    /^(cannot|can't|no\s+access\s+to|read-only|restricted\s+to)/,

    // Contains negative phrases anywhere
    /\b(cannot|can't|no\s+access|read-only|restricted)\b/,

    // Contains "except" or "excluding"
    /\b(except|excluding|but\s+not)\b/,

    // Contains negative action words
    /\b(no\s+permission\s+to|unable\s+to|not\s+allowed\s+to|prohibited\s+from)\b/,
  ];

  const allowedRules = [
    // These are positive even if they contain certain keywords
    /^can\s+(manage|create|edit|view|access)/,
    /full\s+access/,
    /complete\s+control/,
  ];

  // First check if it's explicitly allowed (overrides everything)
  if (allowedRules.some((pattern) => pattern.test(lowerText))) {
    return false;
  }

  // Then check if it's restricted
  return restrictedRules.some((pattern) => pattern.test(lowerText));
};

// Helper to get role descriptions with styling
export const getRoleDescriptions = () => {
  const descriptions = {};

  Object.keys(ROLE_PERMISSION_TEXTS).forEach((role) => {
    descriptions[role] = ROLE_PERMISSION_TEXTS[role].map((text) => ({
      text,
      isRestricted: isRestrictedPermission(text),
    }));
  });

  return descriptions;
};

// Helper to get plain role descriptions (just strings)
export const getPlainRoleDescriptions = () => ROLE_PERMISSION_TEXTS;

// Helper to get role colors
export const getRoleColors = () => ({
  [ROLES.SUPER_ADMIN]: "bg-gradient-to-r from-black to-pink-900 text-white",
  [ROLES.ADMIN]: "bg-gradient-to-r from-black to-[#F59E0B] text-white",
  [ROLES.PLANNER]: "bg-gradient-to-r from-black to-[#D97706] text-white",
  [ROLES.VIEWER]: "bg-gradient-to-r from-black to-gray-800 text-white",
});

// Helper to get role labels
export const getRoleLabels = () => ({
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Admin",
  [ROLES.PLANNER]: "Planner",
  [ROLES.VIEWER]: "Viewer",
});

// // Helper to check if user can edit another user
export const canEditUser = (authUser, targetUser, can) => {
  const isSelf = authUser?._id === targetUser?._id;
  const hasPermission = can(PERMISSIONS.EDIT, RESOURCES.USER, targetUser);

  return {
    canEdit: isSelf || hasPermission, // <- Allow self-edits OR has permission
    canEditRole: hasPermission && !isSelf,
    isSelf,
  };
};
