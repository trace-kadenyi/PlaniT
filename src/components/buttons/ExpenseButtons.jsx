import { XCircle, Plus } from "lucide-react";

import PermissionButton from "./PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";

// add expense btn
export const AddExpenseBtn = ({
  showCreateExpenseForm,
  setExpenseToEdit,
  setScrollToForm,
  setShowCreateExpenseForm,
}) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.CREATE}
      resource={RESOURCES.EXPENSE}
      tooltipTitle="Create a new expense"
      fallbackTooltip="Upgrade to Planner or Admin role to create expenses"
      onClick={() => {
        if (showCreateExpenseForm) {
          setExpenseToEdit(null);
        } else {
          setScrollToForm(true);
        }
        setShowCreateExpenseForm(!showCreateExpenseForm);
      }}
      className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-full bg-[#BE3455]/10 text-[#BE3455] hover:bg-[#BE3455]/20 transition text-xs cursor-pointer dark:bg-[#D97706]/90 dark:text-white dark:hover:bg-[#D97706]/50"
    >
      {showCreateExpenseForm ? (
        <XCircle className="w-3 h-3" />
      ) : (
        <Plus className="w-3 h-3" />
      )}
      <span>{showCreateExpenseForm ? "Cancel" : "Add Expense"}</span>
    </PermissionButton>
  );
};

// add expense form field
export const AddExpenseFormBtn = ({ onClose, expenseStatus, mode }) => {
  return (
    <div className="flex justify-end gap-3 pt-4">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600 transition"
        >
          Cancel
        </button>
      )}
      <PermissionButton
        permission={PERMISSIONS.CREATE}
        resource={RESOURCES.EXPENSE}
        tooltipTitle="Create a new expense"
        fallbackTooltip="Upgrade to Planner or Admin role to save expense"
        type="submit"
        disabled={expenseStatus === "loading"}
        className="px-4 py-2 rounded-md bg-[#9B2C62] text-white hover:bg-[#801f4f] dark:bg-[#D97706] dark:hover:bg-[#F59E0B] transition"
      >
        {expenseStatus === "loading"
          ? mode === "create"
            ? "Adding..."
            : "Saving..."
          : mode === "create"
          ? "Add Expense"
          : "Save Changes"}
      </PermissionButton>
    </div>
  );
};

// add budget link
export const AddBudgetLink = ({ id }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.EDIT}
      resource={RESOURCES.EVENT}
      tooltipTitle="Add event budget"
      fallbackTooltip="Upgrade to Planner or Admin role to add event budgets"
      to={`/events/${id}/edit/#budget`}
      className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-full bg-[#9B2C62] text-white hover:bg-[#7A2350] transition text-xs cursor-default dark:bg-[#D97706]/90 dark:text-white dark:hover:bg-[#D97706]/50"
    >
      <Plus className="w-3 h-3" />
      <span>Add Budget</span>
    </PermissionButton>
  );
};

// add budget link in event sect
export const EventAddBudgetLink = ({ eventID }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.EDIT}
      resource={RESOURCES.EVENT}
      tooltipTitle="Add event budget"
      fallbackTooltip="Upgrade to Planner or Admin role to add event budgets"
      to={`/events/${eventID}/edit/#budget`}
      className="text-[#9B2C62] hover:text-[#7A2350] text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 self-start mt-1 cursor-default ml-5 dark:text-[#F59E0B] dark:hover:text-[#F59E0B]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      <span className="border-b px-1 border-dashed border-[#9B2C62] hover:border-[#7A2350] hover:text-[#7A2350] hover:rounded-lg hover:bg-[#BE3455]/10 dark:hover:text-[#F59E0B] dark:border-[#F59E0B] dark:hover:border-[#F59E0B] dark:hover:bg-[#F59E0B]/10">
        Add budget
      </span>
    </PermissionButton>
  );
};

// edit expense btn
