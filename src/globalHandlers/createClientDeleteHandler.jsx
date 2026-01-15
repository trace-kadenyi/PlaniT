export const createClientDeleteHandler = (
  dispatch,
  id,
  navigate,
  deleteClient,
  toast,
  toastWithProgress,
  DeleteConfirmationToast,
  toastLock
) => {
  return () => {
    if (toastLock.isLocked()) return; // 🔒

    const duration = 10000;

    toastLock.lock("client-delete");

    const toastId = toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type="client"
          onConfirm={async () => {
            try {
              await dispatch(deleteClient(id)).unwrap();
              toast.dismiss(t.id);
              toastWithProgress("Client deleted successfully");
              navigate("/clients");
            } catch (error) {
              // Only dismiss the confirmation toast
              toast.dismiss(t.id);

              // Show error toast with progress
              toastWithProgress(error || "Failed to delete client");
            } finally {
              toast.dismiss(t.id);
              toastLock.unlock(); // 🔓 ALWAYS
            }
          }}
          onCancel={() => {
            toast.dismiss(t.id);
            toastLock.unlock(); // 🔓
          }}
        />
      ),
      { duration, position: "top-center" }
    );
    toastLock.lock(toastId);

    // 🛟 safety net
    setTimeout(toastLock.unlock, duration + 100);
  };
};
