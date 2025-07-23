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
export const getColumnsFromTasks = (sortedTasks, mapTaskToCardFn) => {
  const filteredTasks = {
    todo: sortedTasks.filter((task) => task.status === "To Do"),
    inProgress: sortedTasks.filter((task) => task.status === "In Progress"),
    inReview: sortedTasks.filter((task) => task.status === "In Review"),
    completed: sortedTasks.filter((task) => task.status === "Completed"),
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
