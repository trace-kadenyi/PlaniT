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
          onConfirm={() => {
            dispatch(deleteVendor(id));
            toast.dismiss(t.id);
            toastWithProgress("Vendor deleted successfully");
            navigate("/vendors");
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
