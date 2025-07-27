export const createExpenseDeleteHandler = (
  dispatch,
  deleteExpense,
  toast,
  toastWithProgress,
  DeleteConfirmationToast
) => {
  return (expenseId) => {
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
                toast.dismiss(t.id);
                toastWithProgress("Expense deleted successfully");
              })
              .catch((err) => {
                toast.dismiss(t.id);
                toastWithProgress(
                  `Failed to delete expense: ${err.message || err}`
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
