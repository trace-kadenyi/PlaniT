import { dateFilters } from "../utils/handlers/dashboardDateHandlers";

export const tasksFilterConfig = {
  searchPlaceholder: "Search tasks by title, event or assignee...",
  dateLabel: "Due Date",
  dateFilters: dateFilters,
  defaultFilters: {
    priority: "all",
    assignee: "all",
    dateRange: "all",
    search: "",
  },
  filters: [
    {
      id: "priority",
      label: "Priority",
      options: [
        { value: "all", label: "All Priorities" }, // Removed key
        { value: "high", label: "High Priority", className: "high" },
        { value: "medium", label: "Medium Priority", className: "medium" },
        { value: "low", label: "Low Priority", className: "low" },
      ],
    },
    {
      id: "assignee",
      label: "Assignee",
      options: (data) => [
        { value: "all", label: "All Assignees" }, // Removed key
        ...data.assignees.map((assignee) => ({
          value: assignee,
          label: assignee, // Removed key
        })),
      ],
    },
  ],
};
