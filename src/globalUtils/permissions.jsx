export const ROLES = {
  VIEWER: "viewer",
  EDITOR: "editor",
  ADMIN: "admin",
};

export const PERMISSIONS = {
  VIEW: "view",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  MANAGE_USERS: "manage_users",
};

export const ROLE_PERMISSIONS = {
  [ROLES.VIEWER]: [PERMISSIONS.VIEW],
  [ROLES.EDITOR]: [PERMISSIONS.VIEW, PERMISSIONS.CREATE, PERMISSIONS.EDIT],
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
};

export const hasPermission = (userRole, requiredPermission) => {
  return ROLE_PERMISSIONS[userRole]?.includes(requiredPermission) || false;
};
