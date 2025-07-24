import { useMemo } from "react";
import { filterByDateRange } from "../../../utils/dashboardDateHandlers";
import { filterTasks } from "../../../utils/dashboardHelpers";

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
