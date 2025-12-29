export const createClientDeleteHandler = (
  dispatch,
  id,
  navigate,
  deleteClient,
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
          type="client"
          onConfirm={async () => {
            try {
              dispatch(deleteClient(id));
              toast.dismiss(t.id);
              toastWithProgress("Client deleted successfully");
              navigate("/clients");
            } catch (error) {
              // Only dismiss the confirmation toast
              toast.dismiss(t.id);

              // Show error toast with progress
              toastWithProgress(error || "Failed to delete client");
            }
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
