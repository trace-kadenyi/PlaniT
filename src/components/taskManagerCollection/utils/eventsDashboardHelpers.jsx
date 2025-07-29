import { updateEventStatus, clearUpdateError } from "../../../redux/eventsSlice";
import { taskToastProgress } from "../../../globalHooks/useToastWithProgress";

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
      color: "#F59E0B",
    },
    confirmed: {
      id: "confirmed",
      title: "Confirmed",
      tasks: filteredEvents.confirmed.map(mapEventToCardFn),
      color: "#3B82F6",
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

export const handleEventDragEnd = async (
  result,
  { events, columns, setColumns, dispatch, updateStatus }
) => {
  const { source, destination, draggableId } = result;

  if (!destination || source.droppableId === destination.droppableId) return;

  const statusMap = {
    planning: "Planning",
    confirmed: "Confirmed",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  const newStatus = statusMap[destination.droppableId];

  const originalEvent = events.find((event) => event._id === draggableId);
  if (!originalEvent) return;

  const currentColumns = columns;

  try {
    const eventName = originalEvent.name;
    const formerStatus = originalEvent.status;
    
    // Optimistic update
    setColumns((prevColumns) => {
      const newColumns = JSON.parse(JSON.stringify(prevColumns));
      const sourceColumn = newColumns[source.droppableId];
      const destColumn = newColumns[destination.droppableId];

      const taskIndex = sourceColumn.tasks.findIndex((t) => t.id === draggableId);
      if (taskIndex === -1) return prevColumns;

      const [movedEvent] = sourceColumn.tasks.splice(taskIndex, 1);
      const updatedEvent = { ...movedEvent, status: newStatus };
      destColumn.tasks.splice(destination.index, 0, updatedEvent);

      return newColumns;
    });

    // API update
    await dispatch(
      updateStatus({
        eventId: draggableId,
        updatedData: { status: newStatus },
      })
    ).unwrap();
    
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

export const getInitialEventColumns = () => ({
  planning: {
    id: "planning",
    title: "Planning",
    tasks: [],
    color: "#F59E0B",
  },
  confirmed: {
    id: "confirmed",
    title: "Confirmed",
    tasks: [],
    color: "#3B82F6",
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






