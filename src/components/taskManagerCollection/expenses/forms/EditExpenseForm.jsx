import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateExpense,
  resetExpenseStatuses,
} from "../../../../redux/expensesSlice";
import { toastWithProgress } from "../../../../globalHooks/useToastWithProgress";
import ExpenseFormFields from "./ExpenseFormFields";

export default function EditExpenseForm({ expense, onClose, budgetStatus }) {
  const dispatch = useDispatch();
  const expenseStatus = useSelector((state) => state.expenses.updateStatus);
  const expenseError = useSelector((state) => state.expenses.updateError);

  // initialize form
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "other",
    vendorName: "",
    paymentStatus: "pending",
    paymentDate: "",
    dueDate: "",
    notes: "",
    receiptUrl: "",
  });

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
        vendorName: expense.vendorName || "",
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
      };

      const result = await dispatch(
        updateExpense({
          id: expense._id,
          updatedExpense,
        })
      );

      if (updateExpense.fulfilled.match(result)) {
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
