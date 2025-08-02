import { taskToastProgress } from "../../../../globalHooks/useToastWithProgress";

// map event to card
export const mapEventToCard = (event) => ({
  id: event._id,
  name: event.name,
  type: event.type,
  date: event.date,
  location: event.location,
  status: event.status,
  budgetStatus: event.budgetStatus || {
    totalBudget: 0,
    totalExpenses: 0,
    remainingBudget: 0,
  },
});

// get columns from events
export const getColumnsFromEvents = (events, mapEventToCardFn) => {
  const filteredEvents = {
    planning: events.filter((event) => event.status === "Planning"),
    inProgress: events.filter((event) => event.status === "In Progress"),
    completed: events.filter((event) => event.status === "Completed"),
    cancelled: events.filter((event) => event.status === "Cancelled"),
  };

  return {
    planning: {
      id: "planning",
      title: "Planning",
      tasks: filteredEvents.planning.map(mapEventToCardFn),
      // color: "#F59E0B",
      color: "#DBEAFE",
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      tasks: filteredEvents.inProgress.map(mapEventToCardFn),
      color: "#9B2C62",
    },
    completed: {
      id: "completed",
      title: "Completed",
      tasks: filteredEvents.completed.map(mapEventToCardFn),
      color: "#10B981",
    },
    cancelled: {
      id: "cancelled",
      title: "Cancelled",
      tasks: filteredEvents.cancelled.map(mapEventToCardFn),
      color: "#EF4444",
    },
  };
};

// handle event drag
export const handleEventDragEnd = async (
  result,
  { events, columns, setColumns, dispatch, updateEvent }
) => {
  const { source, destination, draggableId } = result;

  if (!destination || source.droppableId === destination.droppableId) return;

  const statusMap = {
    planning: "Planning",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  const newStatus = statusMap[destination.droppableId];

  const originalEvent = events.find((event) => event._id === draggableId);
  if (!originalEvent) return;

  const currentColumns = JSON.parse(JSON.stringify(columns));

  try {
    const eventName = originalEvent.name;
    const formerStatus = originalEvent.status;

    // Optimistic update
    setColumns((prevColumns) => {
      const newColumns = JSON.parse(JSON.stringify(prevColumns));
      const sourceColumn = newColumns[source.droppableId];
      const destColumn = newColumns[destination.droppableId];

      const taskIndex = sourceColumn.tasks.findIndex(
        (t) => t.id === draggableId
      );
      if (taskIndex === -1) return prevColumns;

      const [movedEvent] = sourceColumn.tasks.splice(taskIndex, 1);
      const updatedEvent = { ...movedEvent, status: newStatus };
      destColumn.tasks.splice(destination.index, 0, updatedEvent);

      return newColumns;
    });

    // API update using existing updateEvent thunk
    await dispatch(
      updateEvent({
        eventId: draggableId,
        updatedEvent: { status: newStatus },
      })
    ).unwrap();

    // ✅ Manually sync dashboardItems to reflect new status
    dispatch({
      type: "events/updateDashboardItemStatus",
      payload: { ...originalEvent, status: newStatus },
    });

    taskToastProgress(
      <span>
        Status of <span className="font-bold">{eventName}</span> updated from{" "}
        <span className="font-semibold text-[#9B2C62]">{formerStatus}</span> to{" "}
        <span className="font-semibold text-[#9B2C62]">{newStatus}</span>.
      </span>
    );
  } catch (err) {
    setColumns(currentColumns);
    console.error("Event status update failed:", err);
  }
};

// get initial event columns
export const getInitialEventColumns = () => ({
  planning: {
    id: "planning",
    title: "Planning",
    tasks: [],
    color: "#F59E0B",
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    tasks: [],
    color: "#9B2C62",
  },
  completed: {
    id: "completed",
    title: "Completed",
    tasks: [],
    color: "#10B981",
  },
  cancelled: {
    id: "cancelled",
    title: "Cancelled",
    tasks: [],
    color: "#EF4444",
  },
});

// filter by date range
export const filterByDateRange = (
  event,
  range,
  customRange = { start: "", end: "" }
) => {
  if (!event.date) return false;

  // Normalize all dates to midnight (strip time components)
  const normalizeDate = (dateStr) => {
    const d = new Date(dateStr);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const eventDate = normalizeDate(event.date);
  const now = normalizeDate(new Date());

  if (range === "custom") {
    if (!customRange.start || !customRange.end) return false;
    const startDate = normalizeDate(customRange.start);
    const endDate = normalizeDate(customRange.end);
    return eventDate >= startDate && eventDate <= endDate;
  }

  // Calculate week boundaries once
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  const endOfThisWeek = new Date(startOfThisWeek);
  endOfThisWeek.setDate(startOfThisWeek.getDate() + 6);

  switch (range) {
    case "today":
      return eventDate.getTime() === now.getTime();

    case "tomorrow":
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      return eventDate.getTime() === tomorrow.getTime();

    case "thisWeek": // Changed from "week" to match tasks
      return eventDate >= startOfThisWeek && eventDate <= endOfThisWeek;

    case "nextWeek":
      const startOfNextWeek = new Date(endOfThisWeek);
      startOfNextWeek.setDate(endOfThisWeek.getDate() + 1);
      const endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
      return eventDate >= startOfNextWeek && eventDate <= endOfNextWeek;

    case "month":
      return (
        eventDate.getFullYear() === now.getFullYear() &&
        eventDate.getMonth() === now.getMonth()
      );

    case "overdue":
      return eventDate < now && event.status !== "Completed";

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

// filter events
export const filterEvents = (
  events,
  filters,
  filterByDateRange,
  customDateRange = null
) => {
  const searchTerm = filters.search?.toLowerCase() || "";

  return events.filter((event) => {
    const matchesType = filters.type === "all" || event.type === filters.type;
    const matchesDate = filterByDateRange(
      event,
      filters.dateRange,
      filters.dateRange === "custom" ? customDateRange : null
    );
    const matchesSearch =
      searchTerm === "" ||
      event.name.toLowerCase().includes(searchTerm) ||
      (event.type && event.type.toLowerCase().includes(searchTerm)) ||
      (event.location.city &&
        event.location.city.toLowerCase().includes(searchTerm)) ||
      (event.location.country &&
        event.location.country.toLowerCase().includes(searchTerm));

    return matchesType && matchesDate && matchesSearch;
  });
};
