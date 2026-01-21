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

    return new Promise((resolve) => {
      let settled = false;

      const safeResolve = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      // 🔒 Safety net for auto-timeout
      const fallbackTimer = setTimeout(() => {
        safeResolve();
      }, duration + 100);

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
                  if (vendorId && onVendorRemoved) {
                    onVendorRemoved(vendorId, expenses || []);
                  }

                  const successMessage =
                    expensePaymentStatus === "paid"
                      ? "Paid expense deleted successfully. This action has been logged in the audit trail."
                      : "Expense deleted successfully";

                  toastWithProgress(successMessage);
                })
                .catch((err) => {
                  taskToastProgress(
                    <span className="font-semibold text-[#9B2C62] dark:text-[#F59E0B]">
                      {err.message || err}
                    </span>
                  );
                })
                .finally(() => {
                  clearTimeout(fallbackTimer);
                  toast.dismiss(t.id);
                  safeResolve();
                });
            }}
            onCancel={() => {
              clearTimeout(fallbackTimer);
              toast.dismiss(t.id);
              safeResolve();
            }}
          />
        ),
        {
          duration,
          position: "top-center",
        }
      );
    });
  };
};
