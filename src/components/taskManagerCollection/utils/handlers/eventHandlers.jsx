export const createEventDeleteHandler = (
  dispatch,
  id,
  navigate,
  deleteEvent,
  toast,
  toastWithProgress,
  DeleteConfirmationToast
) => {
  return () => {
    const duration = 10000;
    toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type="event"
          onConfirm={() => {
            return dispatch(deleteEvent(id))
              .unwrap()
              .then(() => {
                toast.dismiss(t.id);
                toastWithProgress("Event deleted successfully");
                navigate("/events");
              })
              .catch((err) => {
                toast.dismiss(t.id);
                toastWithProgress(err?.message || "Failed to delete event");
              });
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};

// export const createEventDeleteHandler = (
//   dispatch,
//   id,
//   navigate,
//   deleteEvent,
//   toast,
//   toastWithProgress,
//   DeleteConfirmationToast,
//   lockRef
// ) => {
//   return () => {
//     if (lockRef.current) return;
//     lockRef.current = true;

//     const unlock = () => {
//       lockRef.current = false;
//     };

//     const duration = 10000;

//     toast(
//       (t) => (
//         <DeleteConfirmationToast
//           t={t}
//           duration={duration}
//           type="event"
//           onConfirm={() => {
//             return dispatch(deleteEvent(id))
//               .unwrap()
//               .then(() => {
//                 toastWithProgress("Event deleted successfully");
//                 navigate("/events");
//               })
//               .catch((err) => {
//                 toastWithProgress(err?.message || "Failed to delete event");
//               })
//               .finally(() => {
//                 toast.dismiss(t.id);
//                 unlock();
//               });
//           }}
//           onCancel={() => {
//             toast.dismiss(t.id);
//             unlock();
//           }}
//         />
//       ),
//       { duration, position: "top-center" }
//     );
//   };
// };

export const createLockedDeleteHandler = (
  dispatch,
  deleteAction,
  toast,
  toastWithProgress,
  DeleteConfirmationToast,
  lockRef
) => {
  return (id, options = {}) => {
    if (lockRef.current) return; // 🔒 HARD LOCK

    const { duration = 10000, type = "event", entityName, onSuccess } = options;

    const unlock = () => {
      lockRef.current = null;
    };

    const toastId = toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type={type}
          entityName={entityName}
          onConfirm={() => {
            // ✅ MUST return promise (loader depends on this)
            return dispatch(deleteAction(id))
              .unwrap()
              .then(() => {
                toastWithProgress(`${type} deleted successfully`);
                onSuccess?.();
              })
              .catch((err) => {
                toastWithProgress(err?.message || `Failed to delete ${type}`);
              })
              .finally(() => {
                toast.dismiss(t.id);
                unlock(); // 🔓 always unlock
              });
          }}
          onCancel={() => {
            toast.dismiss(t.id);
            unlock(); // 🔓 unlock on cancel
          }}
        />
      ),
      {
        duration,
        position: "top-center",
      }
    );

    lockRef.current = toastId;

    // ✅ SAFETY NET (timeout)
    setTimeout(unlock, duration + 100);
  };
};
