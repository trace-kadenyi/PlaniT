import { taskToastProgress } from "../../../../globalHooks/useToastWithProgress";

export const createExpenseDeleteHandler = (
  dispatch,
  deleteExpense,
  toast,
  toastWithProgress,
  DeleteConfirmationToast,
  onVendorRemoved
) => {
  return (expenseId, vendorId, expenses, expensePaymentStatus) => {
    const duration = 10000;
    toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type="expense"
          expensePaymentStatus={expensePaymentStatus}
          onConfirm={() => {
            return dispatch(deleteExpense(expenseId))
              .unwrap()
              .then(() => {
                // Add null check before calling onVendorRemoved
                if (vendorId && onVendorRemoved) {
                  onVendorRemoved(vendorId, expenses || []);
                }
                toast.dismiss(t.id);
                const successMessage =
                  expensePaymentStatus === "paid"
                    ? "Paid expense deleted successfully. This action has been logged in the audit trail."
                    : "Expense deleted successfully";

                toastWithProgress(successMessage);
              })
              .catch((err) => {
                toast.dismiss(t.id);
                taskToastProgress(
                  <span className="font-semibold text-[#9B2C62] dark:text-[#F59E0B]">
                    {err.message || err}
                  </span>
                );
              });
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      { duration, position: "top-center" }
    );
  };
};
