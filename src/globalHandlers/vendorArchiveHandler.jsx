import { toast } from "react-hot-toast";

export const createVendorArchiveHandler = (
  dispatch,
  id,
  isArchived,
  toggleArchiveVendor,
  fetchVendors,
  fetchVendorStats,
  filterMode,
  toastWithProgress,
  ArchiveConfirmationToast,
  navigate = null // Optional navigate function
) => {
  return () => {
    const duration = 10000;
    toast(
      (t) => (
        <ArchiveConfirmationToast
          t={t}
          duration={duration}
          isArchived={isArchived}
          onConfirm={() => {
            dispatch(toggleArchiveVendor(id))
              .unwrap()
              .then(() => {
                toast.dismiss(t.id);
                toastWithProgress(
                  `Vendor ${isArchived ? "restored" : "archived"} successfully`
                );
                // Refresh data if these functions are provided
                if (fetchVendors && fetchVendorStats && filterMode) {
                  dispatch(
                    fetchVendors({
                      archived:
                        filterMode === "archived"
                          ? true
                          : filterMode === "active"
                          ? false
                          : undefined,
                    })
                  );
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
              });
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
