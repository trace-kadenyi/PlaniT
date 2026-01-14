// export const createTaskDeleteHandler = (
//   dispatch,
//   deleteTask,
//   toast,
//   toastWithProgress,
//   DeleteConfirmationToast
// ) => {
//   return (taskId) => {
//     const duration = 10000;
//     toast(
//       (t) => (
//         <DeleteConfirmationToast
//           t={t}
//           duration={duration}
//           type="task"
//           onConfirm={() => {
//             return dispatch(deleteTask(taskId))
//               .unwrap()
//               .then(() => {
//                 toast.dismiss(t.id);
//                 toastWithProgress("Task deleted successfully");
//               })
//               .catch((err) => {
//                 toast.dismiss(t.id);
//                 toastWithProgress(`Failed to delete task: ${err}`);
//               });
//           }}
//           onCancel={() => toast.dismiss(t.id)}
//         />
//       ),
//       { duration, position: "top-center" }
//     );
//   };
// };

// task event id

export const createTaskDeleteHandler = (
  dispatch,
  deleteTask,
  toast,
  toastWithProgress,
  DeleteConfirmationToast
) => {
  return (taskId) => {
    const duration = 10000;

    return new Promise((resolve) => {
      let settled = false;

      const safeResolve = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      // 🔒 HARD SAFETY NET — handles auto-dismiss
      const fallbackTimer = setTimeout(() => {
        safeResolve();
      }, duration + 100);

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
                  toastWithProgress("Task deleted successfully");
                })
                .catch((err) => {
                  toastWithProgress(`Failed to delete task: ${err}`);
                })
                .finally(() => {
                  clearTimeout(fallbackTimer);
                  toast.dismiss(t.id);
                  safeResolve();
                });
            }}
            onCancel={() => {
              clearTimeout(fallbackTimer);
              toast.dismiss(t.id);
              safeResolve();
            }}
          />
        ),
        {
          duration,
          position: "top-center",
        }
      );
    });
  };
};

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
