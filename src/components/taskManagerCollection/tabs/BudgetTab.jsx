import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleShowVoided, voidExpense } from "../../../redux/expensesSlice"; // REMOVE deleteExpense

import { getExpensesByCategory, BudgetStatus } from "../utils/budgetHelpers";
import {
  ExpenseListView,
  ExpenseByCategoryView,
} from "../expenses/ExpenseCard";
import EditExpenseForm from "../expenses/forms/EditExpenseForm";
import CreateExpenseForm from "../expenses/forms/CreateExpenseForm";
import ExpenseTab from "./ExpenseTab";
import {
  AddBudgetLink,
  AddExpenseBtn,
  EditDeleteExpenseBtns,
} from "../../buttons/ExpenseButtons";

export default function BudgetTab({
  expenses,
  budgetStatus,
  onVendorAdded,
  onVendorRemoved,
}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [activeView, setActiveView] = useState("list");
  const [scrollToForm, setScrollToForm] = useState(false);
  const [showVoidConfirm, setShowVoidConfirm] = useState(null);

  // form ref
  const formRef = useRef(null);

  // Get state from Redux
  const expensesState = useSelector((state) => state.expenses);
  const { showVoided, totals, permissions } = expensesState;
  const userRole = useSelector((state) => state.auth.user?.role);

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
  }, [scrollToForm, expenseToEdit, showCreateExpenseForm]);

  // Handle both array and Redux-style expense objects
  const expensesArray = Array.isArray(expenses)
    ? expenses
    : expensesState.items || [];
  const expensesByCategory = getExpensesByCategory(expensesArray.filter(exp => !exp.isVoided));
  const isLoading = expensesState?.status === "loading";

  // check if budget is 0 or not set
  const hasNoBudget = !budgetStatus || budgetStatus.totalBudget === 0;

  // Filter expenses based on view
  const displayExpenses = showVoided 
  ? expensesArray // Show all when voided view is on
  : expensesArray.filter(exp => !exp.isVoided); // Filter out voided when view is off

  // Void confirmation handler
  const handleVoidConfirm = (expense) => {
    // Check permissions
    if (!permissions.canVoidExpenses) return;
    
    // For paid expenses, only super admins can void
    if (expense.paymentStatus === "paid" && userRole !== "super_admin") {
      alert("Only Super Admins can void paid expenses");
      return;
    }
    
    setShowVoidConfirm(expense);
  };

  // HANDLE VOID SUBMIT - This is the key function
  const handleVoidSubmit = async (expenseId, reason) => {
    if (!reason.trim()) {
      alert("Please provide a reason for voiding");
      return;
    }
    
    try {
      await dispatch(voidExpense({
        id: expenseId,
        reason: reason.trim()
      })).unwrap();
      
      setShowVoidConfirm(null);
      // Success - Redux will automatically update the UI
    } catch (error) {
      console.error("Failed to void expense:", error);
      alert(`Failed to void expense: ${error.message}`);
    }
  };

  return (
    <>
      {/* HEADER SECTION - Keep as is */}
      <div className="flex sm:justify-between items-center mb-4 flex-col sm:flex-row gap-5 sm:gap-3">
        <h2 className="text-xl font-bold text-[#9B2C62] dark:text-[#D97706]">
          Budget & Expenses
          {totals.voidedCount > 0 && permissions.canViewVoided && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({totals.activeCount} active, {totals.voidedCount} voided)
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {/* Show Voided Toggle for Admins */}
          {permissions.canViewVoided && totals.voidedCount > 0 && (
            <button
              onClick={() => dispatch(toggleShowVoided())}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                showVoided
                  ? "bg-gray-100 text-gray-700 border-gray-300"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {showVoided ? "Hide" : "Show"} Voided ({totals.voidedCount})
            </button>
          )}
          
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
      </div>

      {/* EXPENSE FORM - Keep as is */}
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

      {/* BUDGET STATUS - Keep as is */}
      {budgetStatus && <BudgetStatus budgetStatus={budgetStatus} />}

      {/* LOADING/EMPTY STATES - Keep as is */}
      {isLoading && displayExpenses.length === 0 && <p>Loading expenses...</p>}
      {!hasNoBudget && displayExpenses.length === 0 && !isLoading && !showVoided && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9] dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] border-l-[#F59E0B] dark:border-l-[#F59E0B]">
          <p className="text-gray-600 dark:text-gray-400">
            No expenses added yet.
          </p>
        </div>
      )}
      {!hasNoBudget && displayExpenses.length === 0 && !isLoading && showVoided && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9] dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] border-l-[#F59E0B] dark:border-l-[#F59E0B]">
          <p className="text-gray-600 dark:text-gray-400">
            No voided expenses found.
          </p>
        </div>
      )}
      {hasNoBudget && displayExpenses.length === 0 && !isLoading && (
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

      {/* EXPENSE LIST - SIMPLIFY EditDeleteExpenseBtns props */}
      {displayExpenses.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9] dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 dark:border-gray-900">
          {/* tabs List View & By Category - only show category view for active expenses */}
          {!showVoided && (
            <ExpenseTab
              activeView={activeView}
              setActiveView={setActiveView}
              expenses={displayExpenses}
            />
          )}

          {activeView === "list" || showVoided ? (
            <ul className="space-y-4">
              {displayExpenses.map((expense) => (
                <li
                  key={expense._id}
                  className={`border p-4 rounded-lg hover:shadow-md transition group ${
                    expense.isVoided
                      ? "border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                      : "border-[#F3EDE9] bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]"
                  }`}
                >
                  <ExpenseListView 
                    expense={expense} 
                    showVoided={showVoided}
                  >
                    {/* SIMPLIFIED: Remove handleExpenseDelete prop */}
                    <EditDeleteExpenseBtns
                      setShowCreateExpenseForm={setShowCreateExpenseForm}
                      setExpenseToEdit={setExpenseToEdit}
                      expense={expense}
                      setScrollToForm={setScrollToForm}
                      showVoided={showVoided}
                      onVoidClick={() => handleVoidConfirm(expense)}
                      permissions={permissions}
                      userRole={userRole}
                    />
                  </ExpenseListView>
                </li>
              ))}
            </ul>
          ) : (
            // by category view (only for active expenses)
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

      {/* VOID CONFIRMATION MODAL - FIXED */}
      {showVoidConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Void Expense
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to void this expense? This action cannot be undone without a super admin.
            </p>
            {showVoidConfirm.paymentStatus === "paid" && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⚠️ This is a <strong>paid</strong> expense. Voiding will affect financial records.
                </p>
              </div>
            )}
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reason for voiding (required)
                </span>
                <textarea
                  id="voidReason"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:border-gray-500 dark:focus:ring-[#D97706] dark:bg-gray-700 dark:text-white"
                  rows="3"
                  placeholder="e.g., Duplicate entry, incorrect amount, cancelled service..."
                  required
                />
              </label>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowVoidConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const reason = document.getElementById('voidReason').value;
                    await handleVoidSubmit(showVoidConfirm._id, reason);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Void Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}