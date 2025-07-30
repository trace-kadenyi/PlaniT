// filter by date range
export const filterByDateRange = (
  item,
  range,
  customRange = { start: "", end: "" },
  getDateFn = (i) => i.date, // Default assumes item has `date`
  getStatusFn = (i) => i.status || null // Optional status check for "overdue"
) => {
  const rawDate = getDateFn(item);
  if (!rawDate) return false;

  // Normalize date to remove time
  const normalizeDate = (dateStr) => {
    const d = new Date(dateStr);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const itemDate = normalizeDate(rawDate);
  const now = normalizeDate(new Date());

  if (range === "custom") {
    if (!customRange.start || !customRange.end) return false;
    const startDate = normalizeDate(customRange.start);
    const endDate = normalizeDate(customRange.end);
    return itemDate >= startDate && itemDate <= endDate;
  }

  // Week boundaries
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  const endOfThisWeek = new Date(startOfThisWeek);
  endOfThisWeek.setDate(startOfThisWeek.getDate() + 6);

  switch (range) {
    case "today":
      return itemDate.getTime() === now.getTime();

    case "tomorrow":
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      return itemDate.getTime() === tomorrow.getTime();

    case "thisWeek":
      return itemDate >= startOfThisWeek && itemDate <= endOfThisWeek;

    case "nextWeek":
      const startOfNextWeek = new Date(endOfThisWeek);
      startOfNextWeek.setDate(endOfThisWeek.getDate() + 1);
      const endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
      return itemDate >= startOfNextWeek && itemDate <= endOfNextWeek;

    case "month":
      return (
        itemDate.getFullYear() === now.getFullYear() &&
        itemDate.getMonth() === now.getMonth()
      );

    case "overdue":
      return itemDate < now && getStatusFn(item) !== "Completed";

    default: // "all"
      return true;
  }
};

// date filters
export const dateFilters = {
  all: "All Dates",
  today: "Today",
  tomorrow: "Tomorrow",
  thisWeek: "This Week",
  nextWeek: "Next Week",
  month: "This Month",
  overdue: "Overdue",
  custom: "Custom Range",
};
