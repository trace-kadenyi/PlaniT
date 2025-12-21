import PermissionButton from "./PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";

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
