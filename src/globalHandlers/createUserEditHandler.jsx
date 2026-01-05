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
  return (updateData, originalUserData, fullFormData) => {
    const duration = 10000;

    // Use fullFormData if provided, otherwise use updateData
    const formDataForToast = fullFormData || updateData;

    toast(
      (t) => (
        <EditConfirmationToast
          t={t}
          duration={duration}
          type="user"
          formData={formDataForToast} // Pass the full form data with role
          originalUserData={originalUserData}
          onConfirm={async () => {
            try {
              // Wait for the update to complete
              const updates = [];

              // Check what changes are being made
              const hasBasicInfoChanged =
                updateData.firstName !== originalUserData.firstName ||
                updateData.lastName !== originalUserData.lastName ||
                updateData.email !== originalUserData.email;

              const hasRoleChanged =
                formDataForToast.role !== originalUserData.role;
              const hasPasswordChanged = !!updateData.newPassword;

              // Update user info (including password if present)
              if (hasBasicInfoChanged || hasPasswordChanged) {
                // Always send ALL data including passwords
                const userUpdateData = {
                  firstName: updateData.firstName,
                  lastName: updateData.lastName,
                  email: updateData.email,
                  // Add password fields if they exist
                  ...(updateData.newPassword && {
                    newPassword: updateData.newPassword,
                  }),
                  ...(updateData.currentPassword && {
                    currentPassword: updateData.currentPassword,
                  }),
                };

                updates.push(
                  dispatch(
                    updateUser({ userId, userData: userUpdateData })
                  ).unwrap()
                );
              }

              // Update role if changed (only if role is different)
              if (hasRoleChanged && formDataForToast.role) {
                updates.push(
                  dispatch(
                    updateUserRole({ userId, role: formDataForToast.role })
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
