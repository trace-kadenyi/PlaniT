import { useMemo } from "react";

export function useEventFilters(
  events,
  archiveFilter = "active",
  canViewArchived = false,
) {
  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    let result = events;

    // FIRST: Apply permission-based filtering (users without permission can't see archived events)
    // If user can't view archived events and filter is not explicitly set to archived,
    // filter out archived events
    if (!canViewArchived && archiveFilter !== "archived") {
      result = result.filter((event) => !event.isArchived);
    }

    // THEN: Apply archive filter
    switch (archiveFilter) {
      case "active":
        return result.filter((event) => !event.isArchived);
      case "archived":
        return result.filter((event) => event.isArchived);
      case "all":
      default:
        return result;
    }
  }, [events, archiveFilter, canViewArchived]);

  const activeCount = useMemo(
    () => events?.filter((event) => !event.isArchived).length || 0,
    [events],
  );

  const archivedCount = useMemo(
    () => events?.filter((event) => event.isArchived).length || 0,
    [events],
  );

  return {
    filteredEvents,
    activeCount,
    archivedCount,
  };
}
