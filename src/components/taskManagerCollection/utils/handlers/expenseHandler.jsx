import { taskToastProgress } from "../../../../globalHooks/useToastWithProgress";
import { supabase } from "../../../../globalUtils/supabaseClient";

export const createExpenseDeleteHandler = (
  dispatch,
  deleteExpense,
  toast,
  toastWithProgress,
  DeleteConfirmationToast,
  onVendorRemoved,
) => {
  return (expenseId, vendorId, expenses, expensePaymentStatus, receiptUrl) => {
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
                .then(async () => {
                  if (vendorId && onVendorRemoved) {
                    onVendorRemoved(vendorId, expenses || []);
                  }

                  // ✅ DELETE RECEIPT
                  if (expensePaymentStatus === "paid" && receiptUrl) {
                    try {
                      const filePath = new URL(receiptUrl).pathname.split(
                        "planit-receipts/",
                      )[1];

                      if (filePath) {
                        await supabase.storage
                          .from("planit-receipts")
                          .remove([filePath]);
                      }
                    } catch (err) {
                      console.warn("Receipt deletion failed:", err);
                      // intentionally non-blocking
                    }
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
                    </span>,
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
        },
      );
    });
  };
};
