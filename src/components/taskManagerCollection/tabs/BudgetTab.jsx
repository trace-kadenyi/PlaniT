import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchDeletedPaidExpensesLog } from "../../../redux/expensesSlice";

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
import ExpenseAuditLogPanel from "../expenses/ExpenseAuditLogPanel";
import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
} from "../../../globalHooks/userPermissions";

export default function BudgetTab({
  expenses,
  budgetStatus,
  handleExpenseDelete,
  onVendorAdded,
  onVendorRemoved,
  Link,
}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { can } = usePermissions();

  const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [activeView, setActiveView] = useState("list");
  const [scrollToForm, setScrollToForm] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  // form ref
  const formRef = useRef(null);
  const auditLogRef = useRef(null);

  // Check if user can view audit logs
  const canViewAuditLogs = can(
    PERMISSIONS.VIEW_AUDIT_LOGS,
    RESOURCES.AUDIT_LOG
  );

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

  // scroll to audit log when it's shown
  useEffect(() => {
    if (showAuditLogs && auditLogRef.current) {
      setTimeout(() => {
        auditLogRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showAuditLogs]);

  // Handle both array and Redux-style expense objects
  const expensesArray = Array.isArray(expenses)
    ? expenses
    : expenses?.items || [];
  const expensesByCategory = getExpensesByCategory(expensesArray);
  const isLoading = expenses?.status === "loading";

  // check if budget is 0 or not set
  const hasNoBudget = !budgetStatus || budgetStatus.totalBudget === 0;

  const handleToggleAuditLogs = () => {
    setShowAuditLogs(!showAuditLogs);
  };

  return (
    <>
      <div className="flex sm:justify-between items-center mb-4 flex-col sm:flex-row gap-5 sm:gap-3">
        <h2 className="text-xl font-bold text-[#9B2C62] dark:text-[#D97706]">
          Budget & Expenses
        </h2>
        <div className="flex items-center gap-2">
          {/* Show Audit Logs toggle button for super admins */}
          {canViewAuditLogs && (
            <button
              onClick={handleToggleAuditLogs}
              className={`flex items-center space-x-1 text-sm px-3 py-1.5 rounded-full transition text-xs cursor-pointer ${
                showAuditLogs
                  ? "bg-[#9B2C62] text-white hover:bg-[#801f4f] dark:bg-[#D97706] dark:hover:bg-[#F59E0B]"
                  : "bg-[#6B3B0F]/10 text-[#6B3B0F] hover:bg-[#6B3B0F]/20 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>{showAuditLogs ? "Hide Audit Log" : "View Audit Log"}</span>
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

      {/* Audit Logs Section (only for super admins) */}
      {canViewAuditLogs && showAuditLogs && (
        <div ref={auditLogRef} className="mt-8 scroll-mt-4">
          {" "}
          <ExpenseAuditLogPanel />
        </div>
      )}
    </>
  );
}
