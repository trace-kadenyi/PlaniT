export const createUserEditHandler = (
  dispatch,
  userId,
  navigate,
  updateUser,
  updateUserRole,
  toast,
  toastWithProgress,
  EditConfirmationToast,
  handleLogout,
  currentUserId
) => {
  return (updateData, originalUserData, fullFormData) => {
    const duration = 10000;

    // Use fullFormData if provided, otherwise use updateData
    const formDataForToast = fullFormData || updateData;
    // const isSelf = originalUserData._id === userId;
    const isSelf = currentUserId === originalUserData._id;

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

                if (hasPasswordChanged && isSelf) {
                  toastWithProgress(`Password updated! Logging out...`);
                  handleLogout();
                } else {
                  toastWithProgress("User updated successfully");
                  navigate(`/users/${userId}`);
                }
              } else {
                toast.dismiss(t.id);
                toastWithProgress("No changes detected");
              }
            } catch (error) {
              toast.dismiss(t.id);

              // SPECIFIC HANDLING FOR PASSWORD ERRORS
              if (error.includes?.("Current password is incorrect")) {
                // Show error but DON'T logout
                toastWithProgress(
                  "Current password is incorrect. Please try again."
                );
                // Stay on the edit page - don't navigate anywhere
              }
              // Handle other specific errors
              else if (error.includes?.("Password must contain")) {
                toastWithProgress("New password doesn't meet requirements.");
              } else if (error.includes?.("Email already exists")) {
                toastWithProgress("This email is already in use.");
              } else {
                // For other errors, use generic message
                toastWithProgress(error || "Failed to update user");
              }
            }
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
