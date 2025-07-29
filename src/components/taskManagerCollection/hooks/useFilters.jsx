import { useMemo } from "react";
import { filterByDateRange } from "../utils/handlers/dashboardDateHandlers";
import { filterTasks } from "../utils/tasksDashboardHelpers";

// use task filters
export function useTaskFilters(tasks, filters, customDateRange) {
  return useMemo(() => {
    return filterTasks(
      tasks,
      filters,
      filterByDateRange,
      filters.dateRange === "custom" ? customDateRange : null
    );
  }, [tasks, filters, customDateRange]);
}

// Extract unique assignees for filter dropdown
export function useAssignees(tasks) {
  return useMemo(() => {
    const uniqueAssignees = new Set();
    tasks.forEach((task) => {
      if (task.assignedTo) uniqueAssignees.add(task.assignedTo);
    });
    return ["all", ...Array.from(uniqueAssignees)];
  }, [tasks]);
}
