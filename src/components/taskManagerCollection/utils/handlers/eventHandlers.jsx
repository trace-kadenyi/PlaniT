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
