import { taskToastProgress } from "../../../../globalHooks/useToastWithProgress";

export const createExpenseDeleteHandler = (
  dispatch,
  deleteExpense,
  toast,
  toastWithProgress,
  DeleteConfirmationToast,
  onVendorRemoved
) => {
  return (expenseId, vendorId) => {
    const duration = 10000;
    toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          type="expense"
          onConfirm={() => {
            dispatch(deleteExpense(expenseId))
              .unwrap()
              .then(() => {
                // Remove vendor if it exists
                if (vendorId && onVendorRemoved) {
                  onVendorRemoved(vendorId);
                }
                toast.dismiss(t.id);
                toastWithProgress("Expense deleted successfully");
              })
              .catch((err) => {
                toast.dismiss(t.id);
                taskToastProgress(
                  <span className="font-semibold text-[#9B2C62]">
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
