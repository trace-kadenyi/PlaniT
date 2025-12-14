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
