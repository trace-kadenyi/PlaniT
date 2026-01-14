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
