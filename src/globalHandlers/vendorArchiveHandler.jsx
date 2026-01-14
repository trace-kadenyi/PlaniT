import { toast } from "react-hot-toast";

export const createVendorArchiveHandler = (
  dispatch,
  id,
  isArchived,
  vendor,
  toggleArchiveVendor,
  fetchVendors,
  fetchVendorStats,
  filterMode,
  toastWithProgress,
  ArchiveConfirmationToast,
  toastLock,
  navigate = null // Optional navigate function
) => {
  return () => {
    if (toastLock.isLocked()) return; // 🔒

    const duration = 10000;
    const vendorName = vendor?.name || "Vendor";

    // 🔒 LOCK
    toastLock.lock("archive-vendor");

    const unlock = () => {
      toastLock.unlock();
    };

    const toastId = toast(
      (t) => (
        <ArchiveConfirmationToast
          t={t}
          duration={duration}
          isArchived={isArchived}
          onConfirm={() => {
            return dispatch(toggleArchiveVendor(id))
              .unwrap()
              .then(() => {
                toast.dismiss(t.id);
                toastWithProgress(
                  <span>
                    <strong className="font-bold">{vendorName}</strong>
                    {isArchived ? " restored" : " archived"} successfully
                  </span>
                );
                // Refresh data if these functions are provided
                if (fetchVendors && fetchVendorStats && filterMode) {
                  dispatch(fetchVendorStats());
                }
                // Navigate if provided
                if (navigate) navigate("/vendors");
              })
              .catch((error) => {
                toast.dismiss(t.id);
                toastWithProgress(
                  error.message || "Failed to update vendor status"
                );
              })
              .finally(() => {
                toast.dismiss(t.id);
                unlock(); // 🔓 ALWAYS unlock
              });
          }}
          onCancel={() => {
            toast.dismiss(t.id);
            unlock(); // 🔓 unlock on cancel
          }}
        />
      ),
      { duration, position: "top-center" }
    );

    // 🛟 SAFETY NET (timeout auto-dismiss)
    setTimeout(unlock, duration + 100);
  };
};
