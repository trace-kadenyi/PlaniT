import { useMemo } from "react";
import { useSelector } from "react-redux";
import useUserEvents from "../globalHooks/useUserEvents";

export function useUserMemoizedData(userId, userData) {
  const tasksState = useSelector((state) => state.tasks);

  // Raw update history from Redux
  const rawUpdateHistory = useSelector(
    (state) => state.users.updateHistory[userId]
  );

  // Fetch history status
  const fetchHistoryStatus = useSelector(
    (state) => state.users.fetchHistoryStatus
  );

  // Memoized update history
  const updateHistory = useMemo(
    () => rawUpdateHistory || [],
    [rawUpdateHistory]
  );

  // Memoized user tasks
  const userTasks = useMemo(() => {
    if (!userData) return [];
    return tasksState.items.filter(
      (task) => task.assignedTo?._id === userData._id
    );
  }, [userData, tasksState.items]);

  // Use the existing useUserEvents hook
  const userEvents = useUserEvents(userTasks);


}
