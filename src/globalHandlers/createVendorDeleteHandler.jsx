export const createVendorDeleteHandler = (
  dispatch,
  id,
  navigate,
  deleteVendor,
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
          type="vendor"
          onConfirm={async () => {
            try {
              dispatch(deleteVendor(id));
              toast.dismiss(t.id);
              toastWithProgress("Vendor deleted successfully");
              navigate("/vendors");
            } catch (error) {
              // Only dismiss the confirmation toast
              toast.dismiss(t.id);

              // Show error toast with progress
              toastWithProgress(error || "Failed to delete vendor");
            }
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
