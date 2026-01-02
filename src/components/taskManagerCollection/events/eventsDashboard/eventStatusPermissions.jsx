export const STATUS_PERMISSIONS = {
  planning: {
    allowedRoles: ["planner", "admin", "super_admin"],
  },
  inprogress: {
    allowedRoles: ["planner", "admin", "super_admin"],
  },
  completed: {
    allowedRoles: ["planner", "admin", "super_admin"],
    // requireAllTasksDone: false,
  },
  cancelled: {
    allowedRoles: ["planner", "admin", "super_admin"],
  },
};

export const canTransitionStatus = (
  currentUser,
  fromStatus,
  toStatus,
  eventData = {}
) => {
  const userRole = currentUser?.role;

  // Convert to lowercase and remove spaces
  const toStatusKey = toStatus.toLowerCase().replace(/\s+/g, "");

  const toStatusConfig = STATUS_PERMISSIONS[toStatusKey];

  if (!toStatusConfig) {
    console.error(`No config found for status: ${toStatusKey}`);
    return false;
  }

  // ONLY check role permission
  if (!toStatusConfig.allowedRoles.includes(userRole)) {
    console.error(`User role ${userRole} cannot move to ${toStatus}`);
    return false;
  }

  // Optional: Check additional business rules (like requireAllTasksDone)
  //   if (toStatusKey === 'completed' && toStatusConfig.requireAllTasksDone) {
  //     if (!eventData.allTasksDone) {
  //       return false;
  //     }
  //   }

  return true;
};
