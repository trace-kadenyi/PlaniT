import { useState, useEffect, useRef } from "react";
import { Plus, XCircle, Pencil, Trash2 } from "lucide-react";

import { getExpensesByCategory } from "../utils/budgetHelpers";
import EditExpenseForm from "../expenses/forms/EditExpenseForm";
import CreateExpenseForm from "../expenses/forms/CreateExpenseForm";

export default function BudgetTab({
  expenses,
  budgetStatus,
  handleExpenseDelete,
}) {
  const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [scrollToForm, setScrollToForm] = useState(false);
  const [activeView, setActiveView] = useState("list");

  const formRef = useRef(null);

  // Handle both array and Redux-style expense objects
  const expensesArray = Array.isArray(expenses)
    ? expenses
    : expenses?.items || [];
  const expensesByCategory = getExpensesByCategory(expensesArray);
  const isLoading = expenses?.status === "loading";

  useEffect(() => {
    if (scrollToForm && showCreateExpenseForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollToForm(false);
    }
  }, [scrollToForm, showCreateExpenseForm]);

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
      {budgetStatus && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-[#F3EDE9] mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-[#FFF5EB] p-3 rounded-lg">
              <p className="text-sm text-[#6B3B0F]">Total Budget</p>
              <p className="text-xl font-bold text-[#9B2C62]">
                ${budgetStatus.totalBudget?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="bg-[#FFF5EB] p-3 rounded-lg">
              <p className="text-sm text-[#6B3B0F]">Total Expenses</p>
              <p className="text-xl font-bold text-[#9B2C62]">
                ${budgetStatus.totalExpenses?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="bg-[#FFF5EB] p-3 rounded-lg">
              <p className="text-sm text-[#6B3B0F]">Remaining</p>
              <p className="text-xl font-bold text-[#9B2C62]">
                $
                {(
                  budgetStatus.totalBudget - budgetStatus.totalExpenses
                )?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
      )}

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#6B3B0F]">
              {activeView === "list" ? "Expenses" : "Expenses by Category"}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView("list")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeView === "list"
                    ? "bg-[#9B2C62] text-white"
                    : "bg-[#FFF5EB] text-[#6B3B0F] hover:bg-[#F3EDE9]"
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setActiveView("categories")}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeView === "categories"
                    ? "bg-[#9B2C62] text-white"
                    : "bg-[#FFF5EB] text-[#6B3B0F] hover:bg-[#F3EDE9]"
                }`}
              >
                By Category
              </button>
            </div>
          </div>

          {activeView === "list" ? (
            <ul className="space-y-4">
              {expensesArray.map((expense) => (
                <li
                  key={expense._id}
                  className="relative border-b border-[#F3EDE9] pb-4 last:border-b-0 group hover:bg-[#FFF5EB]/50"
                >
                  <div className="flex justify-between">
                    <div className="w-3/4">
                      <h3 className="font-medium text-[#6B3B0F]">
                        {expense.description}
                      </h3>
                      <p className="text-sm text-[#9B2C62]/70 capitalize">
                        {expense.category}
                        {expense.vendorName && ` • ${expense.vendorName}`}
                      </p>
                      {expense.dueDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(expense.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#6B3B0F]">
                        ${expense.amount.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${
                          expense.paymentStatus === "paid"
                            ? "text-green-600"
                            : "text-[#F59E0B]"
                        }`}
                      >
                        {expense.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Edit/Delete Buttons */}
                  <div className="transform -translate-y-1/2 flex space-x-2 mt-4 flex justify-self-end">
                    <button
                      className="flex items-center px-2 py-1 rounded-md transition-all duration-200 bg-[#9B2C62]/10 text-[#9B2C62] hover:bg-[#9B2C62] hover:text-white text-xs"
                      onClick={() => {
                        setExpenseToEdit(expense);
                        setShowCreateExpenseForm(true);
                        setScrollToForm(true);
                      }}
                    >
                      Edit expense
                    </button>
                    <button
                      className="flex items-center px-2 py-1 rounded-md transition-all duration-200 bg-[#BE3455]/10 text-[#BE3455] hover:bg-[#BE3455] hover:text-white text-xs"
                      onClick={() => handleExpenseDelete(expense._id)}
                    >
                      Delete expense
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
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
