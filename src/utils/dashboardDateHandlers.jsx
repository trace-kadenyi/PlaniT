// date filters
export const dateFilters = {
  all: "All Dates",
  today: "Today",
  tomorrow: "Tomorrow",
  thisWeek: "This Week",
  nextWeek: "Next Week",
  overdue: "Overdue",
  custom: "Custom Range",
};

// filter by date range
export const filterByDateRange = (
  task,
  range,
  customRange = { start: "", end: "" }
) => {
  if (!task.deadline) return false;
  const taskDate = new Date(task.deadline);

  if (range === "custom") {
    if (!customRange.start || !customRange.end) return false;
    const startDate = new Date(customRange.start);
    const endDate = new Date(customRange.end);
    return taskDate >= startDate && taskDate <= endDate;
  }
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  switch (range) {
    case "today":
      return taskDate.toDateString() === now.toDateString();
    case "tomorrow":
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      return taskDate.toDateString() === tomorrow.toDateString();
    case "thisWeek":
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    case "nextWeek":
      const nextWeekStart = new Date(endOfWeek);
      nextWeekStart.setDate(endOfWeek.getDate() + 1);
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
      return taskDate >= nextWeekStart && taskDate <= nextWeekEnd;
    case "overdue":
      return taskDate < now;
    default:
      return true;
  }
};