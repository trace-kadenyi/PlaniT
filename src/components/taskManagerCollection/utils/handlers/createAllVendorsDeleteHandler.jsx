export const createAllClientsDeleteHandler = (
  dispatch,
  navigate,
  deleteAllVendors,
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
          type="vendors"
          onConfirm={async () => {
            const resultAction = await dispatch(deleteAllVendors());
            toast.dismiss(t.id);

            if (deleteAllVendors.fulfilled.match(resultAction)) {
              const deletedCount = resultAction.payload?.deletedCount ?? 0;

              if (deletedCount > 0) {
                toastWithProgress(
                  `${deletedCount} vendor${
                    deletedCount > 1 ? "s" : ""
                  } deleted successfully`
                );
              } else {
                toastWithProgress("No vendors to delete");
              }

              navigate("/vendors");
            } else {
              toast.error("Failed to delete all vendors");
            }
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
