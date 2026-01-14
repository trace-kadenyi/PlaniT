export const createAllVendorsDeleteHandler = (
  dispatch,
  navigate,
  deleteAllVendors,
  toast,
  toastWithProgress,
  DeleteConfirmationToast,
  resetVendorStatuses,
  toastLock
) => {
  return () => {
    if (toastLock.isLocked()) return; // 🔒 BLOCK MULTI-CLICK

    const duration = 10000;

    const toastId = toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type="vendors"
          onConfirm={async () => {
            try {
              const result = await dispatch(deleteAllVendors()).unwrap();
              toast.dismiss(t.id);

              const deletedCount = result?.deletedCount ?? 0;

              if (deletedCount > 0) {
                toastWithProgress(
                  `${deletedCount} vendor${
                    deletedCount > 1 ? "s" : ""
                  } deleted successfully`
                );
                // reset vendor status after successful deletion
                dispatch(resetVendorStatuses());
              } else {
                toastWithProgress("No vendors to delete");
              }

              navigate("/vendors");
            } catch (error) {
              toast.dismiss(t.id);
              toastWithProgress(error || "Failed to delete all vendors");
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
      { duration, position: "top-center" }
    );
    toastLock.lock(toastId); // 🔒 LOCK AFTER TOAST SPAWNS

    // ✅ SAFETY NET
    setTimeout(toastLock.unlock, duration + 100);
  };
};
