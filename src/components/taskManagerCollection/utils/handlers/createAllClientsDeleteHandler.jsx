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
          type="all clients"
          onConfirm={async () => {
            const resultAction = await dispatch(deleteAllClients());
            toast.dismiss(t.id);

            if (deleteAllClients.fulfilled.match(resultAction)) {
              const deletedCount = resultAction.payload?.deletedCount ?? 0;

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
            } else {
              toast.error("Failed to delete all clients");
            }
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
