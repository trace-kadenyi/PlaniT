import { useState, useRef } from "react";
import { Plus, XCircle } from "lucide-react";

import {
  getExpensesByCategory,
  BudgetStatus,
  ExpenseListView,
} from "../utils/budgetHelpers";
import EditExpenseForm from "../expenses/forms/EditExpenseForm";
import CreateExpenseForm from "../expenses/forms/CreateExpenseForm";
import EditDeleteExpense from "../../shared/EditDeleteExpense";
import ExpenseTabs from "./ExpenseTabs";

export default function BudgetTab({
  expenses,
  budgetStatus,
  handleExpenseDelete,
}) {
  const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [activeView, setActiveView] = useState("list");

  const formRef = useRef(null);

  // Handle both array and Redux-style expense objects
  const expensesArray = Array.isArray(expenses)
    ? expenses
    : expenses?.items || [];
  const expensesByCategory = getExpensesByCategory(expensesArray);
  const isLoading = expenses?.status === "loading";

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#9B2C62]">Budget & Expenses</h2>
        <button
          onClick={() => {
            if (showCreateExpenseForm) {
              setExpenseToEdit(null);
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
        <div ref={formRef} className="mb-6">
          {expenseToEdit ? (
            <EditExpenseForm
              expense={expenseToEdit}
              onClose={() => {
                setExpenseToEdit(null);
                setShowCreateExpenseForm(false);
              }}
            />
          ) : (
            <CreateExpenseForm
              onClose={() => {
                setShowCreateExpenseForm(false);
              }}
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
          <ExpenseTabs activeView={activeView} setActiveView={setActiveView} />

          {activeView === "list" ? (
            <ul className="space-y-4">
              {expensesArray.map((expense) => (
                <li
                  key={expense._id}
                  className="relative border-b border-[#F3EDE9] pb-4 last:border-b-0 group hover:bg-[#FFF5EB]/50"
                >
                  <ExpenseListView expense={expense} />

                  {/* Edit/Delete Buttons */}
                  <EditDeleteExpense
                    showCreateExpenseForm={showCreateExpenseForm}
                    setShowCreateExpenseForm={setShowCreateExpenseForm}
                    handleExpenseDelete={handleExpenseDelete}
                    setExpenseToEdit={setExpenseToEdit}
                    formRef={formRef}
                    expense={expense}
                  />
                </li>
              ))}
            </ul>
          ) : (
            // by category
            <div className="space-y-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div
                  key={category}
                  className="border-b border-[#F3EDE9] pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-[#6B3B0F] capitalize">
                      {category}
                    </h3>
                    <div className="text-right">
                      <p className="font-bold text-[#6B3B0F]">
                        ${amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-[#9B2C62]/70">
                        {budgetStatus?.totalExpenses > 0
                          ? (
                              (amount / budgetStatus.totalExpenses) *
                              100
                            ).toFixed(1)
                          : "0"}
                        % of expenses
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
