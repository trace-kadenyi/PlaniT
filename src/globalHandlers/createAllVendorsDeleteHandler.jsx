export const createAllVendorsDeleteHandler = (
  dispatch,
  navigate,
  deleteAllVendors,
  toast,
  toastWithProgress,
  DeleteConfirmationToast,
  resetVendorStatuses
) => {
  return () => {
    const duration = 10000;

    toast(
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
            }
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
