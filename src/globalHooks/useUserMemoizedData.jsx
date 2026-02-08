import { useMemo } from "react";
import { useSelector } from "react-redux";

import useUserEvents from "../globalHooks/useUserEvents";

export function useUserMemoizedData(userId, userData) {
  const tasksState = useSelector((state) => state.tasks);

  // Raw update history from Redux
  const rawUpdateHistory = useSelector(
    (state) => state.users.updateHistory[userId],
  );

  // Fetch history status
  const fetchHistoryStatus = useSelector(
    (state) => state.users.fetchHistoryStatus,
  );

  // Memoized update history
  const updateHistory = useMemo(
    () => rawUpdateHistory || [],
    [rawUpdateHistory],
  );

  // Memoized user tasks
  const userTasks = useMemo(() => {
    if (!userData) return [];
    return tasksState.items.filter(
      (task) => task.assignedTo?._id === userData._id,
    );
  }, [userData, tasksState.items]);

  // Use the existing useUserEvents hook
  const userEvents = useUserEvents(userTasks);

  return {
    updateHistory,
    fetchHistoryStatus,
    userTasks,
    userEvents,
    tasksState,
  };
}

// user filters
export function useUserFilters(users, statusFilter = "all", userRole = null) {
  const filteredUsers = useMemo(() => {
    if (!users || users.length === 0) return [];

    let result = users;

    // FIRST: Apply permission-based filtering (viewers/planners can't see deactivated users)
    if (userRole && (userRole === "viewer" || userRole === "planner")) {
      result = result.filter((user) => !user.isDeactivated);
    }

    // THEN: Apply status filter
    if (statusFilter === "active") {
      return result.filter((user) => !user.isDeactivated);
    }
    if (statusFilter === "inactive") {
      return result.filter((user) => user.isDeactivated);
    }

    return result; // "all"
  }, [users, statusFilter, userRole]); // Add userRole to dependencies

  const activeCount = useMemo(
    () => users?.filter((user) => !user.isDeactivated).length || 0,
    [users],
  );

  const inactiveCount = useMemo(
    () => users?.filter((user) => user.isDeactivated).length || 0,
    [users],
  );

  return {
    filteredUsers,
    activeCount,
    inactiveCount,
  };
}
