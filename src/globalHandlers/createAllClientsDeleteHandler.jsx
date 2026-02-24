export const createAllClientsDeleteHandler = (
  dispatch,
  navigate,
  deleteAllClients,
  toast,
  toastWithProgress,
  DeleteConfirmationToast,
  toastLock,
) => {
  return () => {
    if (toastLock.isLocked()) return; // 🔒 BLOCK MULTI-CLICK

    const duration = 10000;

    const toastId = toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type="clients"
          onConfirm={async () => {
            try {
              const result = await dispatch(deleteAllClients()).unwrap();
              toast.dismiss(t.id);

              const deletedCount = result?.summary?.deleteCount ?? 0;

              if (deletedCount > 0) {
                toastWithProgress(
                  `${deletedCount} client${
                    deletedCount > 1 ? "s" : ""
                  } deleted successfully`,
                );
              } else {
                toastWithProgress("No clients to delete");
              }

              navigate("/clients");
            } catch (error) {
              toastWithProgress(error || "Failed to delete all clients");
            } finally {
              toastLock.unlock(); // 🔓 ALWAYS UNLOCK
            }
          }}
          onCancel={() => {
            toast.dismiss(t.id);
            toastLock.unlock(); // 🔓 unlock on cancel
          }}
        />
      ),
      { duration, position: "top-center" },
    );

    toastLock.lock(toastId); // 🔒 LOCK AFTER TOAST SPAWNS

    // ✅ SAFETY NET
    setTimeout(toastLock.unlock, duration + 100);
  };
};
