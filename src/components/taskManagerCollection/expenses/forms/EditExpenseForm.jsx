import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateExpense,
  resetExpenseStatuses,
} from "../../../../redux/expensesSlice";
import { fetchVendors } from "../../../../redux/vendorsSlice";

import { toastWithProgress } from "../../../../globalHooks/useToastWithProgress";
import ExpenseFormFields from "./ExpenseFormFields";

export default function EditExpenseForm({
  expense,
  onClose,
  budgetStatus,
  onVendorAdded,
  onVendorRemoved,
  expenses,
}) {
  const dispatch = useDispatch();
  const expenseStatus = useSelector((state) => state.expenses.updateStatus);
  const expenseError = useSelector((state) => state.expenses.updateError);
  const { items: vendors, status: vendorsStatus } = useSelector(
    (state) => state.vendors
  );

  // initialize form
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "other",
    vendor: null,
    paymentStatus: "pending",
    paymentDate: "",
    dueDate: "",
    notes: "",
    receiptUrl: "",
  });

  // Fetch vendors on mount
  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  // Reset status when expense changes
  useEffect(() => {
    dispatch(resetExpenseStatuses());

    return () => {
      // Cleanup when component unmounts
      dispatch(resetExpenseStatuses());
    };
  }, [expense?._id, dispatch]);

  // populate form
  useEffect(() => {
    if (expense) {
      setForm({
        amount: expense.amount?.toString() || "",
        description: expense.description || "",
        category: expense.category || "other",
        vendor: expense.vendor?._id || expense.vendor || null,
        paymentStatus: expense.paymentStatus || "pending",
        paymentDate: expense.paymentDate
          ? expense.paymentDate.split("T")[0]
          : "",
        dueDate: expense.dueDate ? expense.dueDate.split("T")[0] : "",
        notes: expense.notes || "",
        receiptUrl: expense.receiptUrl || "",
      });
    }
  }, [expense]);

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedExpense = {
        ...form,
        amount: parseFloat(form.amount),
        vendor: form.vendor,
      };

      const result = await dispatch(
        updateExpense({
          id: expense._id,
          updatedExpense,
        })
      );

      if (updateExpense.fulfilled.match(result)) {
        const oldVendorId = expense.vendor?._id || expense.vendor;
        const newVendorId = form.vendor;

        // Add new vendor if changed
        if (newVendorId && newVendorId !== oldVendorId && onVendorAdded) {
          const selectedVendor = vendors.find((v) => v._id === newVendorId);
          if (selectedVendor) {
            onVendorAdded(selectedVendor);
          }
        }

        // Only remove old vendor if it's not used by other expenses
        if (oldVendorId && newVendorId !== oldVendorId && onVendorRemoved) {
          // Get all expenses that use this vendor
          const vendorUsageCount = expenses.filter(
            (e) =>
              (e.vendor?._id === oldVendorId || e.vendor === oldVendorId) &&
              e._id !== expense._id
          ).length;

          if (vendorUsageCount === 0) {
            onVendorRemoved(oldVendorId);
          }
        }
        toastWithProgress("Expense updated successfully");
        if (onClose) onClose();
      }
    } catch (err) {
      toastWithProgress("Failed to update expense");
      console.error("Update error:", err);
    }
  };

  // handle close
  const handleClose = () => {
    dispatch(resetExpenseStatuses());
    if (onClose) onClose();
  };

  return (
    <ExpenseFormFields
      form={form}
      onFieldChange={handleChange}
      onSubmit={handleSubmit}
      onClose={handleClose}
      expenseStatus={expenseStatus}
      expenseError={expenseError}
      budgetStatus={budgetStatus}
      mode="edit"
    />
  );
}
