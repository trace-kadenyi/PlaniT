export const createTaskDeleteHandler = (
  dispatch,
  deleteTask,
  toast,
  toastWithProgress,
  DeleteConfirmationToast
) => {
  return (taskId) => {
    const duration = 10000;
    toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type="task"
          onConfirm={() => {
            dispatch(deleteTask(taskId))
              .unwrap()
              .then(() => {
                toast.dismiss(t.id);
                toastWithProgress("Task deleted successfully");
              })
              .catch((err) => {
                toast.dismiss(t.id);
                toastWithProgress(`Failed to delete task: ${err}`);
              });
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};

// task event id
export const getTaskEventId = (task) => {
  if (!task) return null;

  if (typeof task.eventId === "object" && task.eventId !== null) {
    return task.eventId._id || task.eventId.id || task.eventId;
  }

  return task.eventId;
};

export const navigateToTask = (navigate, task) => {
  const eventId = getTaskEventId(task);

  if (eventId && task._id) {
    navigate(`/events/${eventId}`, {
      state: {
        scrollToTaskId: task._id,
        scrollNonce: Date.now(),
      },
    });
  } else {
    navigate("/tasks/board");
  }
};
