import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { createExpense, resetExpenseStatuses } from "../../../../redux/expensesSlice";
import { toastWithProgress } from "../../../../globalHooks/useToastWithProgress";
import ExpenseFormFields from "./ExpenseFormFields";

export default function CreateExpenseForm({ onClose }) {
  const dispatch = useDispatch();
  const { id: eventId } = useParams();
  const expenseStatus = useSelector((state) => state.expenses.createStatus);
  const expenseError = useSelector((state) => state.expenses.createError);

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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const expenseData = {
      ...form,
      amount: parseFloat(form.amount),
      eventId,
    };
    
    dispatch(createExpense(expenseData))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toastWithProgress("Expense added successfully");
          if (onClose) onClose();
        }
      })
      .catch((err) => {
        toastWithProgress(`Error: ${err.message}`);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Reset status when unmounting
  useEffect(() => {
    return () => {
      dispatch(resetExpenseStatuses());
    };
  }, [dispatch]);

  return (
    <ExpenseFormFields
      form={form}
      onFieldChange={handleChange}
      onSubmit={handleSubmit}
      onClose={onClose}
      expenseStatus={expenseStatus}
      expenseError={expenseError}
      mode="create"
    />
  );
}