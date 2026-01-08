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
      tooltipTitle={`${
        showCreateExpenseForm ? "Cancel" : "Create a new expense"
      }`}
      fallbackTooltip={`${
        showCreateExpenseForm
          ? "Cancel"
          : "Upgrade to Planner or Admin role to create expenses"
      }`}
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
// export const EditDeleteExpenseBtns = ({
//   setExpenseToEdit,
//   setShowCreateExpenseForm,
//   setScrollToForm,
//   handleExpenseDelete,
//   expense,
//   expenses,
// }) => {
//   return (
//     <div className="transform -translate-y-1/2 flex space-x-2 mt-4 flex justify-self-end sm:min-w-[212px]">
//       <PermissionButton
//         permission={PERMISSIONS.EDIT}
//         resource={RESOURCES.EXPENSE}
//         tooltipTitle="Edit expense"
//         fallbackTooltip="Upgrade to Planner or Admin role to edit expenses"
//         className="flex items-center px-2 py-1 rounded-md transition-all duration-200 bg-[#9B2C62]/10 text-[#9B2C62] hover:bg-[#9B2C62] hover:text-white text-xs dark:bg-[#F59E0B]/40 dark:text-gray-300 dark:hover:bg-[#F59E0B]/30"
//         onClick={() => {
//           setExpenseToEdit(expense);
//           setShowCreateExpenseForm(true);
//           setScrollToForm(true);
//         }}
//       >
//         Edit expense
//       </PermissionButton>
//       <PermissionButton
//         permission={PERMISSIONS.DELETE}
//         resource={RESOURCES.EXPENSE}
//         tooltipTitle="Delete expense"
//         fallbackTooltip="Upgrade to Planner or Admin role to delete expenses"
//         className="flex items-center px-2 py-1 rounded-md transition-all duration-200 bg-[#BE3455]/10 text-[#BE3455] hover:bg-[#BE3455] hover:text-white text-xs dark:bg-[#BE3455]/40 dark:hover:bg-[#BE3455]/30 dark:text-white"
//         onClick={() =>
//           handleExpenseDelete(expense._id, expense.vendor?._id, expenses)
//         }
//       >
//         Delete expense
//       </PermissionButton>
//     </div>
//   );
// };

// In ExpenseButtons.jsx, add these components:

// EditDeleteExpenseBtns (updated)
// EditDeleteExpenseBtns (updated)
export function EditDeleteExpenseBtns({
  setShowCreateExpenseForm,
  handleExpenseDelete,
  setExpenseToEdit,
  expense,
  setScrollToForm,
  eventId,
  showVoided = false,
  onVoidClick,
  permissions,
  userRole
}) {
  const canEdit = !expense.isVoided && (permissions?.canVoidExpenses || userRole === 'admin' || userRole === 'super_admin');
  const canVoid = !expense.isVoided && permissions?.canVoidExpenses;
  const canDelete = !expense.isVoided && permissions?.canVoidExpenses; // Can delete pending expenses
  const canUnvoid = expense.isVoided && permissions?.canUnvoidExpenses && userRole === 'super_admin';
  
  return (
    <div className="flex gap-2">
      {canEdit && (
        <button
          onClick={() => {
            setExpenseToEdit(expense);
            setShowCreateExpenseForm(true);
            setScrollToForm(true);
          }}
          className="text-sm font-medium text-[#9B2C62] dark:text-[#F59E0B] hover:text-[#801f4f] dark:hover:text-[#D97706]"
        >
          Edit
        </button>
      )}
      
      {/* DELETE button for pending expenses (regular deletion) */}
      {canDelete && expense.paymentStatus === "pending" && (
        <button
          onClick={() => {
            if (confirm("Delete this pending expense?")) {
              handleExpenseDelete(expense._id, expense.vendor?._id, [], "delete");
            }
          }}
          className="text-sm font-medium text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      )}
      
      {/* VOID button (for paid expenses OR as alternative to delete) */}
      {canVoid && (
        <button
          onClick={onVoidClick}
          className="text-sm font-medium text-red-600 hover:text-red-800"
        >
          Void
        </button>
      )}
      
      {canUnvoid && (
        <button
          onClick={() => {
            if (confirm("Unvoid this expense? This will restore it to active expenses.")) {
              // Call unvoid API
              console.log("Unvoid expense:", expense._id);
            }
          }}
          className="text-sm font-medium text-green-600 hover:text-green-800"
        >
          Unvoid
        </button>
      )}
    </div>
  );
}