export const mapEventToCard = (event) => ({
  id: event._id,
  name: event.name,
  type: event.type,
  date: event.date,
  location: event.location,
  budgetStatus: event.budgetStatus,
  status: event.status,
  description: event.description,
});

export const getColumnsFromEvents = (events, mapEventToCardFn) => {
  const filteredEvents = {
    planning: events.filter((event) => event.status === "Planning"),
    confirmed: events.filter((event) => event.status === "Confirmed"),
    inProgress: events.filter((event) => event.status === "In Progress"),
    completed: events.filter((event) => event.status === "Completed"),
    cancelled: events.filter((event) => event.status === "Cancelled"),
  };

  return {
    planning: {
      id: "planning",
      title: "Planning",
      tasks: filteredEvents.planning.map(mapEventToCardFn),
      color: "#F59E0B", // Amber
    },
    confirmed: {
      id: "confirmed",
      title: "Confirmed",
      tasks: filteredEvents.confirmed.map(mapEventToCardFn),
      color: "#3B82F6", // Blue
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      tasks: filteredEvents.inProgress.map(mapEventToCardFn),
      color: "#9B2C62", // Your brand color
    },
    completed: {
      id: "completed",
      title: "Completed",
      tasks: filteredEvents.completed.map(mapEventToCardFn),
      color: "#10B981", // Green
    },
    cancelled: {
      id: "cancelled",
      title: "Cancelled",
      tasks: filteredEvents.cancelled.map(mapEventToCardFn),
      color: "#EF4444", // Red
    },
  };
};

