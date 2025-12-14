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

export const getSortedRecentTasks = (tasks) => {
  return [...tasks]
    .filter((task) => task.status !== "Completed" && task.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);
};

// calculate budget stats
export const getTotalBudget = (dashboardItems) => {
  return dashboardItems.reduce((sum, event) => {
    const budget = event.budgetStatus?.totalBudget || 0;
    return sum + budget;
  }, 0);
};

export const getTotalExpenses = (dashboardItems) => {
  return dashboardItems.reduce((sum, event) => {
    const expenses = event.budgetStatus?.totalExpenses || 0;
    return parseFloat((sum + expenses).toFixed(2));
  }, 0);
};

// Group events by status for quick overview

export const groupEventByStatus = (dashboardItems) => {
  return {
    planning: dashboardItems.filter((event) => event.status === "Planning"),
    "in-progress": dashboardItems.filter(
      (event) => event.status === "In Progress"
    ),
    completed: dashboardItems.filter((event) => event.status === "Completed"),
    cancelled: dashboardItems.filter((event) => event.status === "Cancelled"),
  };
};
