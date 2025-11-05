export const createUserDeleteHandler = (
  dispatch,
  id,
  navigate,
  removeOrganizationUser,
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
          onConfirm={() => {
            dispatch(removeOrganizationUser(id));
            toast.dismiss(t.id);
            toastWithProgress("User deleted successfully");
            navigate("/team");
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
