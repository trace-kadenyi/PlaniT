export const createVendorArchiveHandler = (
  dispatch,
  id,
  isArchived,
  toggleArchiveVendor,
  fetchVendors,
  fetchVendorStats,
  filterMode,
  toast,
  toastWithProgress,
  ArchiveConfirmationToast
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
