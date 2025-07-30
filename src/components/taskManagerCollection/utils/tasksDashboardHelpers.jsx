import { updateTask, clearUpdateError } from "../../../redux/tasksSlice";
import { taskToastProgress } from "../../../globalHooks/useToastWithProgress";

// map task to card func
export const mapTaskToCard = (task) => ({
  id: task._id,
  title: task.title,
  event: task.eventName || task.eventId?.name || "Unassigned",
  eventId: task.eventId?._id || null,
  due: task.deadline
    ? new Date(task.deadline).toLocaleDateString()
    : "No deadline",
  priority: task.priority.toLowerCase(),
  assignee: task.assignedTo,
  status: task.status,
});

// get columns from tasks func
export const getColumnsFromTasks = (tasks, mapTaskToCardFn) => {
  const filteredTasks = {
    todo: tasks.filter((task) => task.status === "To Do"),
    inProgress: tasks.filter((task) => task.status === "In Progress"),
    inReview: tasks.filter((task) => task.status === "In Review"),
    completed: tasks.filter((task) => task.status === "Completed"),
  };

  return {
    todo: {
      id: "todo",
      title: "To Do",
      tasks: filteredTasks.todo.map(mapTaskToCardFn),
      color: "#F59E0B",
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      tasks: filteredTasks.inProgress.map(mapTaskToCardFn),
      color: "#FF7E33",
    },
    inReview: {
      id: "inReview",
      title: "In Review",
      tasks: filteredTasks.inReview.map(mapTaskToCardFn),
      color: "#9B2C62",
    },
    completed: {
      id: "completed",
      title: "Completed",
      tasks: filteredTasks.completed.map(mapTaskToCardFn),
      color: "#4CAF50",
    },
  };
};

// on drag end func
export const handleDragEnd = async (
  result,
  { tasks, columns, setColumns, dispatch }
) => {
  const { source, destination, draggableId } = result;

  if (!destination || source.droppableId === destination.droppableId) return;

  const statusMap = {
    todo: "To Do",
    inProgress: "In Progress",
    inReview: "In Review",
    completed: "Completed",
  };
  const newStatus = statusMap[destination.droppableId];

  // Find the original task with populated event data
  const originalTask = tasks.find((task) => task._id === draggableId);
  if (!originalTask) return;

  // Store current columns for rollback
  const currentColumns = columns;

  try {
    // Store the task title before optimistic update
    const taskTitle = originalTask.title;
    const formerStatus = originalTask.status;
    // Optimistic update
    setColumns((prevColumns) => {
      const newColumns = JSON.parse(JSON.stringify(prevColumns));
      const sourceColumn = newColumns[source.droppableId];
      const destColumn = newColumns[destination.droppableId];

      // Find and remove the task
      const taskIndex = sourceColumn.tasks.findIndex(
        (t) => t.id === draggableId
      );
      if (taskIndex === -1) return prevColumns;

      const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);

      // Create new task with guaranteed event data
      const updatedTask = {
        ...movedTask,
        status: newStatus,
        event:
          originalTask.eventName || originalTask.eventId?.name || "Unassigned",
      };

      destColumn.tasks.splice(destination.index, 0, updatedTask);

      return newColumns;
    });

    // API update
    await dispatch(
      updateTask({
        taskId: draggableId,
        updatedData: { status: newStatus },
      })
    ).unwrap();
    taskToastProgress(
      <span>
        Status of <span className="font-bold">{taskTitle}</span> successfully
        updated from{" "}
        <span className="font-semibold text-[#9B2C62]">{formerStatus}</span> to{" "}
        <span className="font-semibold text-[#9B2C62]">{newStatus}</span>.
      </span>
    );
  } catch (err) {
    setColumns(currentColumns);
    console.error("Task update failed:", err);
  }
};

// get initial columns
export const getInitialColumns = () => ({
  todo: {
    id: "todo",
    title: "To Do",
    tasks: [],
    color: "#F59E0B",
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    tasks: [],
    color: "#FF7E33",
  },
  inReview: {
    id: "inReview",
    title: "In Review",
    tasks: [],
    color: "#9B2C62",
  },
  completed: {
    id: "completed",
    title: "Completed",
    tasks: [],
    color: "#4CAF50",
  },
});

// filter tasks func
export const filterTasks = (
  tasks,
  filters,
  filterByDateRange,
  customDateRange = null
) => {
  const searchTerm = filters.search?.toLowerCase() || "";

  return tasks.filter((task) => {
    const matchesPriority =
      filters.priority === "all" ||
      task.priority.toLowerCase() === filters.priority;
    const matchesAssignee =
      filters.assignee === "all" || task.assignedTo === filters.assignee;
    const matchesDate = filterByDateRange(
      task,
      filters.dateRange,
      filters.dateRange === "custom" ? customDateRange : null
    );
    const matchesSearch =
      searchTerm === "" ||
      task.title.toLowerCase().includes(searchTerm) ||
      (task.eventName && task.eventName.toLowerCase().includes(searchTerm)) ||
      (task.assignedTo && task.assignedTo.toLowerCase().includes(searchTerm));

    return matchesPriority && matchesAssignee && matchesDate && matchesSearch;
  });
};

// loading state
export const LoadingDashboard = () => {
  return (
    <div className="flex space-x-4 animate-pulse justify-center">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-100 rounded-lg p-4 w-72 h-64"></div>
      ))}
    </div>
  );
};

// update error render
export const UpdateDashboardError = ({ updateError, dispatch }) => {
  return (
    <div className="p-3 bg-red-50 text-red-600 rounded mb-4 flex justify-between">
      <span>Update failed: {updateError}</span>
      <button
        onClick={() => dispatch(clearUpdateError())}
        className="text-[#9B2C62] font-medium"
      >
        Retry
      </button>
    </div>
  );
};

// fetch error render
export const FetchDashboardError = ({ fetchError }) => {
  return (
    <div className="p-3 bg-red-50 text-red-600 rounded mb-4">
      Failed to load tasks: {fetchError}
    </div>
  );
};
