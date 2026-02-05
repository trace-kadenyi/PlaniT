export const createUserReactivateHandler = (
  dispatch,
  id,
  navigate,
  reactivateUser,
  toast,
  toastWithProgress,
  UserReactivateConfirmationToast,
  toastLock,
) => {
  return () => {
    if (toastLock.isLocked()) return; // 🔒

    const duration = 10000;

    toastLock.lock("user-reactivate");

    const toastId = toast(
      (t) => (
        <UserReactivateConfirmationToast
          t={t}
          duration={duration}
          type="user"
          onConfirm={async () => {
            try {
              // Wait for reactivation to complete
              const result = await dispatch(reactivateUser(id)).unwrap();

              toast.dismiss(t.id);
              toastWithProgress("User reactivated successfully");

              // Stay consistent with delete flow
              navigate("/team");
            } catch (error) {
              // Only dismiss confirmation toast
              toast.dismiss(t.id);

              toastWithProgress(error || "Failed to reactivate user");
            } finally {
              toast.dismiss(t.id);
              toastLock.unlock(); // 🔓 ALWAYS
            }
          }}
          onCancel={() => {
            toast.dismiss(t.id);
            toastLock.unlock(); // 🔓
          }}
        />
      ),
      { duration, position: "top-center" },
    );

    toastLock.lock(toastId);

    // 🛟 safety net
    setTimeout(toastLock.unlock, duration + 100);
  };
};
