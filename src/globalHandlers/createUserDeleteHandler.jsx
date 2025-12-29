export const createUserDeleteHandler = (
  dispatch,
  id,
  navigate,
  deleteUser,
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
          type="user"
          onConfirm={async () => {
            try {
              // Wait for the delete to complete
              const result = await dispatch(deleteUser(id)).unwrap();

              toast.dismiss(t.id);
              toastWithProgress("User deleted successfully");
              navigate("/team");
            } catch (error) {
              // Only dismiss the confirmation toast
              toast.dismiss(t.id);

              // Show error toast with progress
              toastWithProgress(error || "Failed to delete user");
            }
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
