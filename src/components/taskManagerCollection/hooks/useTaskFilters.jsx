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
        // Extract only the name from the assignedTo object
        if (typeof task.assignedTo === "object" && task.assignedTo.firstName) {
          const assigneeName = `${task.assignedTo.firstName} ${task.assignedTo.lastName}`;
          uniqueAssignees.add(assigneeName);
        } else {
          // Fallback if it's just an ID string
          uniqueAssignees.add(task.assignedTo);
        }
      } else {
        hasUnassignedTasks = true;
      }
    });

    const assignees = Array.from(uniqueAssignees);
    if (hasUnassignedTasks) assignees.push("Unassigned");

    return assignees;
  }, [tasks]);
}
