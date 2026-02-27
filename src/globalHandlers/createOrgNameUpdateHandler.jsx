export const createOrgNameUpdateHandler = (
  dispatch,
  name,
  oldName,
  updateOrganizationName,
  toast,
  toastWithProgress,
  OrgNameUpdateConfirmationToast,
  toastLock,
) => {
  return () => {
    if (toastLock.isLocked()) return;

    const duration = 10000;
    toastLock.lock("org-name-update");

    const toastId = toast(
      (t) => (
        <OrgNameUpdateConfirmationToast
          t={t}
          duration={duration}
          newName={name}
          oldName={oldName}
          onConfirm={async () => {
            try {
              await dispatch(updateOrganizationName(name)).unwrap();
              toast.dismiss(t.id);
              toastWithProgress("Organization name updated successfully");
            } catch (error) {
              toast.dismiss(t.id);
              toastWithProgress(error || "Failed to update organization name");
            } finally {
              toast.dismiss(t.id);
              toastLock.unlock();
            }
          }}
          onCancel={() => {
            toast.dismiss(t.id);
            toastLock.unlock();
          }}
        />
      ),
      { duration, position: "top-center" },
    );
    toastLock.lock(toastId);
    setTimeout(toastLock.unlock, duration + 100);
  };
};
