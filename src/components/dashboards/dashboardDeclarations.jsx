// Calculate events statistics
export const getTotalEvents = (dashboardItems) => dashboardItems.length;

export const getSortedActiveUpcomingEvents = (dashboardItems) => {
  return [...dashboardItems]
    .filter(
      (event) =>
        (event.status === "In Progress" || event.status === "Planning") &&
        new Date(event.date) > new Date() &&
        event.status !== "Cancelled"
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
};

export const getActiveUpcomingEventsCount = (dashboardItems) => {
  return dashboardItems.filter(
    (event) =>
      (event.status === "In Progress" || event.status === "Planning") &&
      new Date(event.date) > new Date()
  ).length;
};

// Calculate tasks statistics
export const getTotalTasks = (tasks) => tasks.length;

export const getPendingTasks = (tasks) => {
  return Array.isArray(tasks)
    ? tasks.filter((task) => {
        const status = task?.status?.toLowerCase();
        return (
          status === "to do" ||
          status === "in review" ||
          status === "in progress"
        );
      }).length
    : 0;
};

export const getCompletedTasks = (tasks) => {
  return Array.isArray(tasks)
    ? tasks.filter((task) => {
        const status = task?.status?.toLowerCase();
        return status === "completed";
      }).length
    : 0;
};
