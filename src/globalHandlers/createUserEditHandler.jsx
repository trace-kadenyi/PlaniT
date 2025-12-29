export const createUserEditHandler = (
  dispatch,
  userId,
  navigate,
  updateUser,
  updateUserRole,
  toast,
  toastWithProgress,
  EditConfirmationToast
) => {
  return (formData, originalUserData) => {
    const duration = 100000;

    toast(
      (t) => (
        <EditConfirmationToast
          t={t}
          duration={duration}
          type="user"
          formData={formData}
          originalUserData={originalUserData}
          onConfirm={async () => {
            try {
              // Wait for the update to complete
              const updates = [];

              // Check what changes are being made
              const hasBasicInfoChanged =
                formData.firstName !== originalUserData.firstName ||
                formData.lastName !== originalUserData.lastName ||
                formData.email !== originalUserData.email ||
                formData.phone !== (originalUserData.phone || "");

              const hasRoleChanged = formData.role !== originalUserData.role;

              // Update basic information if changed
              if (hasBasicInfoChanged) {
                const updateData = {
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  email: formData.email,
                  phone: formData.phone || null,
                };
                updates.push(
                  dispatch(
                    updateUser({ userId, userData: updateData })
                  ).unwrap()
                );
              }

              // Update role if changed
              if (hasRoleChanged) {
                updates.push(
                  dispatch(
                    updateUserRole({ userId, role: formData.role })
                  ).unwrap()
                );
              }

              // Wait for all updates to complete
              if (updates.length > 0) {
                await Promise.all(updates);
                toast.dismiss(t.id);
                toastWithProgress("User updated successfully");
                navigate(`/users/${userId}`);
              } else {
                toast.dismiss(t.id);
                toastWithProgress("No changes detected");
              }
            } catch (error) {
              // Only dismiss the confirmation toast
              toast.dismiss(t.id);

              // Show error toast with progress
              toastWithProgress(error || "Failed to update user");
            }
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
