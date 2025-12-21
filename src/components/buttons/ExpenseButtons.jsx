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
        fallbackTooltip="Upgrade to Planner or Admin role to create expenses"
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
