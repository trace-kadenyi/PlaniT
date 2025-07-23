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

