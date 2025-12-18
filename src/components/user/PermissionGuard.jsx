import { hasPermission } from "../utils/permissions";

const PermissionGuard = ({
  userRole,
  requiredPermission,
  children,
  fallback = null,
}) => {
  if (!hasPermission(userRole, requiredPermission)) {
    return fallback;
  }

  return children;
};

export default PermissionGuard;
