export const createTaskDeleteHandler = (
  dispatch,
  deleteTask,
  toast,
  toastWithProgress,
  DeleteConfirmationToast
) => {
  return (taskId, onDone) => {
    const duration = 10000;
    toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type="task"
          onConfirm={() => {
            return dispatch(deleteTask(taskId))
              .unwrap()
              .then(() => {
                toast.dismiss(t.id);
                onDone?.(); // ✅ RESET
                toastWithProgress("Task deleted successfully");
              })
              .catch((err) => {
                toast.dismiss(t.id);
                onDone?.(); // ✅ RESET
                toastWithProgress(`Failed to delete task: ${err}`);
              })
              .finally(() => {
                toast.dismiss(t.id);
                onDone?.();
              });
          }}
          onCancel={() => {
            toast.dismiss(t.id);
            onDone?.(); // ✅ RESET
          }}
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
    // Clear any existing state first
    navigate(`/events/${eventId}`, { replace: true, state: {} });

    // Then navigate with scroll state
    setTimeout(() => {
      navigate(`/events/${eventId}`, {
        state: {
          scrollToTaskId: task._id,
          scrollNonce: Date.now(),
        },
      });
    }, 0);
  } else {
    navigate("/tasks/board");
  }
};
