export const createAllClientsDeleteHandler = (
  dispatch,
  navigate,
  deleteAllClients,
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
          type="clients"
          onConfirm={async () => {
            try {
              const result = await dispatch(deleteAllClients()).unwrap();
              toast.dismiss(t.id);

              const deletedCount = result?.deletedCount ?? 0;

              if (deletedCount > 0) {
                toastWithProgress(
                  `${deletedCount} client${
                    deletedCount > 1 ? "s" : ""
                  } deleted successfully`
                );
              } else {
                toastWithProgress("No clients to delete");
              }

              navigate("/clients");
            } catch (error) {
              toast.dismiss(t.id);
              toastWithProgress(error || "Failed to delete all clients");
            }
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
