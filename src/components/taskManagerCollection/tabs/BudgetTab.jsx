import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { getExpensesByCategory, BudgetStatus } from "../utils/budgetHelpers";
import {
  ExpenseListView,
  ExpenseByCategoryView,
} from "../expenses/ExpenseCard";
import EditExpenseForm from "../expenses/forms/EditExpenseForm";
import CreateExpenseForm from "../expenses/forms/CreateExpenseForm";
import EditDeleteExpense from "../../shared/EditDeleteExpense";
import ExpenseTab from "./ExpenseTab";
import {
  AddBudgetLink,
  AddExpenseBtn,
  EditDeleteExpenseBtns,
} from "../../buttons/ExpenseButtons";

export default function BudgetTab({
  expenses,
  budgetStatus,
  handleExpenseDelete,
  onVendorAdded,
  onVendorRemoved,
  Link,
}) {
  const { id } = useParams();
  const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [activeView, setActiveView] = useState("list");
  const [scrollToForm, setScrollToForm] = useState(false);

  // form ref
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

  // check if budget is 0 or not set
  const hasNoBudget = !budgetStatus || budgetStatus.totalBudget === 0;

  return (
    <>
      <div className="flex sm:justify-between items-center mb-4 flex-col sm:flex-row gap-5 sm:gap-3">
        <h2 className="text-xl font-bold text-[#9B2C62] dark:text-[#D97706]">
          Budget & Expenses
        </h2>
        {hasNoBudget ? (
          <AddBudgetLink id={id} />
        ) : (
          <AddExpenseBtn
            showCreateExpenseForm={showCreateExpenseForm}
            setExpenseToEdit={setExpenseToEdit}
            setScrollToForm={setScrollToForm}
            setShowCreateExpenseForm={setShowCreateExpenseForm}
          />
        )}
      </div>

      {/* Expense Form */}
      {!hasNoBudget && showCreateExpenseForm && (
        <div ref={formRef} className="mb-6 scroll-mt-4">
          {expenseToEdit ? (
            <EditExpenseForm
              expense={expenseToEdit}
              onClose={() => {
                setExpenseToEdit(null);
                setShowCreateExpenseForm(false);
              }}
              budgetStatus={budgetStatus}
              onVendorAdded={onVendorAdded}
              onVendorRemoved={onVendorRemoved}
              expenses={expensesArray}
            />
          ) : (
            <CreateExpenseForm
              onClose={() => {
                setShowCreateExpenseForm(false);
              }}
              budgetStatus={budgetStatus}
              onVendorAdded={onVendorAdded}
            />
          )}
        </div>
      )}

      {/* Budget Status Summary */}
      {budgetStatus && <BudgetStatus budgetStatus={budgetStatus} />}

      {/* Loading/Empty States */}
      {isLoading && expensesArray.length === 0 && <p>Loading expenses...</p>}

      {/* with budget/no expenses added  */}
      {!hasNoBudget && expensesArray.length === 0 && !isLoading && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9] dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] border-l-[#F59E0B] dark:border-l-[#F59E0B]">
          <p className="text-gray-600 dark:text-gray-400">
            No expenses added yet.
          </p>
        </div>
      )}

      {/* without budget/no expenses added  */}
      {hasNoBudget && expensesArray.length === 0 && !isLoading && (
        <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 dark:border-gray-900 p-6 rounded-xl shadow-sm border border-[#F3EDE9] flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#6B3B0F] dark:text-[#F59E0B] mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <div>
            <p className="text-[#6B3B0F] dark:text-[#F59E0B] font-medium">
              Budget required for expense tracking
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Add a budget to enable expense management for this event
            </p>
          </div>
        </div>
      )}
      {/* Expense List */}
      {expensesArray.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9] dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 dark:border-gray-900">
          {/* tabs List View & By Category */}
          <ExpenseTab
            activeView={activeView}
            setActiveView={setActiveView}
            expenses={expensesArray}
          />

          {activeView === "list" ? (
            <ul className="space-y-4">
              {expensesArray.map((expense) => (
                <li
                  key={expense._id}
                  className="border border-[#F3EDE9] bg-white p-4 rounded-lg hover:shadow-md transition group dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]"
                >
                  <ExpenseListView expense={expense}>
                    <EditDeleteExpenseBtns
                      setShowCreateExpenseForm={setShowCreateExpenseForm}
                      handleExpenseDelete={(expenseId) =>
                        handleExpenseDelete(
                          expenseId,
                          expense.vendor?._id,
                          expensesArray
                        )
                      }
                      setExpenseToEdit={setExpenseToEdit}
                      expense={expense}
                      setScrollToForm={setScrollToForm}
                      eventId={id}
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
