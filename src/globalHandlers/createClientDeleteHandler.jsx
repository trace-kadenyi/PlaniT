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
          onConfirm={() => {
            dispatch(deleteClient(id));
            toast.dismiss(t.id);
            toastWithProgress("Client deleted successfully");
            navigate("/clients");
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
