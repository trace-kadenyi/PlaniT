import { useMemo } from "react";
import { useSelector } from "react-redux";

export const PERMISSIONS = {
  VIEW: "view",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  ARCHIVE: "archive",
  DELETE_ALL: "delete_all",
  MANAGE_USERS: "manage_users",
  DRAG_CARD: "drag_card",
  UPDATE_STATUS: "update_status",
  MANAGE_EVENT_STATUS: "manage_event_status",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  DELETE_PAID_EXPENSE: "delete_paid_expense",
};

export const RESOURCES = {
  VENDOR: "vendor",
  EVENT: "event",
  TASK: "task",
  CLIENT: "client",
  USER: "user",
  EXPENSE: "expense",
  AUDIT_LOG: "audit_log",
  BUDGET: "budget",
  ORGANIZATION: "organization",
  USER_HISTORY: "user_history",
};

export const ROLES = {
  VIEWER: "viewer",
  PLANNER: "planner",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

export const canModifyUser = (currentUser, targetUser) => {
  if (!currentUser || !targetUser) return false;
  const isSelf = targetUser._id?.toString() === currentUser._id?.toString();
  if (isSelf) return false;
  if (currentUser.role === ROLES.SUPER_ADMIN) return true;
  if (currentUser.role === ROLES.ADMIN && targetUser.role === ROLES.SUPER_ADMIN)
    return false;
  if (
    currentUser.role !== ROLES.ADMIN &&
    currentUser.role !== ROLES.SUPER_ADMIN
  )
    return false;
  return true;
};

export const usePermissions = () => {
  const currentUser = useSelector((state) => state.auth.user);

  const can = useMemo(() => {
    return (permission, resource = null, target = null) => {
      if (!currentUser?.permissions || !resource) return false;

      // Self history view
      if (
        resource === RESOURCES.USER_HISTORY &&
        permission === PERMISSIONS.VIEW &&
        target?._id?.toString() === currentUser._id?.toString()
      )
        return true;

      // Self edit always allowed
      if (
        resource === RESOURCES.USER &&
        permission === PERMISSIONS.EDIT &&
        target?._id?.toString() === currentUser._id?.toString()
      )
        return true;

      // Viewers can see drag UI but can't actually update
      if (
        permission === PERMISSIONS.DRAG_CARD &&
        currentUser.role === ROLES.VIEWER
      )
        return true;

      // Block viewers/planners from deactivated users
      if (
        resource === RESOURCES.USER &&
        target?.isDeactivated &&
        (currentUser.role === ROLES.VIEWER ||
          currentUser.role === ROLES.PLANNER)
      )
        return false;

      const resourcePermissions = currentUser.permissions[resource] || [];
      const hasBase = resourcePermissions.includes(permission);

      if (!hasBase) return false;

      // UI-level target checks
      if (target) {
        // Prevent self-delete
        if (
          permission === PERMISSIONS.DELETE &&
          target._id?.toString() === currentUser._id?.toString()
        )
          return false;

        // Admin can't touch super admin
        if (
          resource === RESOURCES.USER &&
          currentUser.role === ROLES.ADMIN &&
          target.role === ROLES.SUPER_ADMIN
        )
          return false;
      }

      return true;
    };
  }, [currentUser]);

  const isRole = useMemo(() => {
    return (...roles) => currentUser?.role && roles.includes(currentUser.role);
  }, [currentUser]);

  return { can, isRole, currentUser };
};
