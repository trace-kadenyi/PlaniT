import { useState, useEffect, useRef } from "react";
import { Plus, XCircle } from "lucide-react";

import {
  getExpensesByCategory,
  BudgetStatus,
  ExpenseListView,
  ExpenseByCategoryView,
} from "../utils/budgetHelpers";
import EditExpenseForm from "../expenses/forms/EditExpenseForm";
import CreateExpenseForm from "../expenses/forms/CreateExpenseForm";
import EditDeleteExpense from "../../shared/EditDeleteExpense";
import ExpenseTab from "./ExpenseTab";

export default function BudgetTab({
  expenses,
  budgetStatus,
  handleExpenseDelete,
}) {
  const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [activeView, setActiveView] = useState("list");
  const [scrollToForm, setScrollToForm] = useState(false);

  const formRef = useRef(null);

  // scroll to form start
  useEffect(() => {
    if (
      (scrollToForm || expenseToEdit) &&
      showCreateExpenseForm &&
      formRef.current
    ) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollToForm(false);
    }
  }, [scrollToForm, showCreateExpenseForm, expenseToEdit]);

  // Handle both array and Redux-style expense objects
  const expensesArray = Array.isArray(expenses)
    ? expenses
    : expenses?.items || [];
  const expensesByCategory = getExpensesByCategory(expensesArray);
  const isLoading = expenses?.status === "loading";

  return (
    <>
      <div className="flex sm:justify-between items-center mb-4 flex-col sm:flex-row gap-5 sm:gap-3">
        <h2 className="text-xl font-bold text-[#9B2C62]">Budget & Expenses</h2>
        <button
          onClick={() => {
            if (showCreateExpenseForm) {
              setExpenseToEdit(null);
            } else {
              setScrollToForm(true);
            }
            setShowCreateExpenseForm(!showCreateExpenseForm);
          }}
          className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-full bg-[#BE3455]/10 text-[#BE3455] hover:bg-[#BE3455]/20 transition text-xs cursor-pointer"
        >
          {showCreateExpenseForm ? (
            <XCircle className="w-3 h-3" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
          <span>{showCreateExpenseForm ? "Cancel" : "Add Expense"}</span>
        </button>
      </div>

      {/* Expense Form */}
      {showCreateExpenseForm && (
        <div ref={formRef} className="mb-6 scroll-mt-4">
          {expenseToEdit ? (
            <EditExpenseForm
              expense={expenseToEdit}
              onClose={() => {
                setExpenseToEdit(null);
                setShowCreateExpenseForm(false);
              }}
              budgetStatus={budgetStatus}
            />
          ) : (
            <CreateExpenseForm
              onClose={() => {
                setShowCreateExpenseForm(false);
              }}
              budgetStatus={budgetStatus}
            />
          )}
        </div>
      )}

      {/* Budget Status Summary */}
      {budgetStatus && <BudgetStatus budgetStatus={budgetStatus} />}

      {/* Loading/Empty States */}
      {isLoading && expensesArray.length === 0 && <p>Loading expenses...</p>}

      {expensesArray.length === 0 && !isLoading && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9]">
          <p className="text-gray-600">No expenses added yet.</p>
        </div>
      )}

      {/* Expense List */}
      {expensesArray.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9]">
          {/* tabs List View & By Category */}
          <ExpenseTab activeView={activeView} setActiveView={setActiveView} />

          {activeView === "list" ? (
            <ul className="space-y-4">
              {expensesArray.map((expense) => (
                <li
                  key={expense._id}
                  className="border border-[#F3EDE9] bg-white p-4 rounded-lg hover:shadow-md transition group"
                >
                  <ExpenseListView expense={expense}>
                    <EditDeleteExpense
                      setShowCreateExpenseForm={setShowCreateExpenseForm}
                      handleExpenseDelete={handleExpenseDelete}
                      setExpenseToEdit={setExpenseToEdit}
                      expense={expense}
                      setScrollToForm={setScrollToForm}
                    />
                  </ExpenseListView>
                </li>
              ))}
            </ul>
          ) : (
            // by category view
            <div className="space-y-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <ExpenseByCategoryView
                  key={category}
                  category={category}
                  amount={amount}
                  budgetStatus={budgetStatus}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
