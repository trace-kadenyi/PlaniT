import { useMemo } from "react";
import { filterByDateRange } from "../utils/handlers/dashboardDateHandlers";
import { filterTasks } from "../tasks/tasksDashboard/tasksDashboardHelpers";

// use task filters
export function useTaskFilters(tasks, filters, customDateRange) {
  return useMemo(() => {
    return filterTasks(
      tasks,
      filters,
      (task, range, custom) =>
        filterByDateRange(
          task,
          range,
          custom,
          (t) => t.deadline,
          (t) => t.status
        ),
      filters.dateRange === "custom" ? customDateRange : null
    );
  }, [tasks, filters, customDateRange]);
}

// Extract unique assignees for filter dropdown
export function useAssignees(tasks) {
  return useMemo(() => {
    const uniqueAssignees = new Set();
    let hasUnassignedTasks = false;

    tasks.forEach((task) => {
      if (task.assignedTo) {
        uniqueAssignees.add(task.assignedTo);
      } else {
        hasUnassignedTasks = true; // Flag if any task is unassigned
      }
    });

    // Include "Unassigned" only if there are unassigned tasks
    const assignees = ["all", ...Array.from(uniqueAssignees)];
    if (hasUnassignedTasks) assignees.push("Unassigned");

    return assignees;
  }, [tasks]);
}
