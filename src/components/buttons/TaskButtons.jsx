import { XCircle, Plus, Pencil, Trash2 } from "lucide-react";

import PermissionButton from "./PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";

// create task btn
export const CreateTaskBtn = ({
  showCreateTaskForm,
  setTaskToEdit,
  setScrollToForm,
  setShowCreateTaskForm,
}) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.CREATE}
      resource={RESOURCES.TASK}
      tooltipTitle="Create a new task"
      fallbackTooltip="Upgrade to Planner or Admin role to create tasks"
      onClick={() => {
        if (showCreateTaskForm) {
          setTaskToEdit(null);
        } else {
          setScrollToForm(true);
        }
        setShowCreateTaskForm(!showCreateTaskForm);
      }}
      className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-full bg-[#BE3455]/10 text-[#BE3455] hover:bg-[#BE3455]/20 transition text-xs cursor-pointer dark:bg-[#D97706]/90 dark:text-white dark:hover:bg-[#D97706]/50"
    >
      {showCreateTaskForm ? (
        <XCircle className="w-3 h-3" />
      ) : (
        <Plus className="w-3 h-3" />
      )}
      <span>{showCreateTaskForm ? "Cancel" : "Create Task"}</span>
    </PermissionButton>
  );
};

// create task in form btn
export const CreateTaskFormBtn = ({ mode, onClose, taskStatus }) => {
  return (
    <div className="flex justify-end gap-3 pt-4">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600 transition"
        >
          Cancel
        </button>
      )}
      <PermissionButton
        permission={PERMISSIONS.CREATE}
        resource={RESOURCES.TASK}
        tooltipTitle="Create a new task"
        fallbackTooltip="Upgrade to Planner or Admin role to create tasks"
        type="submit"
        disabled={taskStatus === "loading"}
        className="px-4 py-2 rounded-md bg-[#9B2C62] text-white hover:bg-[#801f4f] transition dark:bg-[#D97706] dark:hover:bg-[#F59E0B]"
      >
        {taskStatus === "loading"
          ? mode === "create"
            ? "Creating..."
            : "Saving..."
          : mode === "create"
          ? "Create Task"
          : "Save Changes"}
      </PermissionButton>
    </div>
  );
};

// edit task
export const EditTaskBtn = ({
  setTaskToEdit,
  setShowCreateTaskForm,
  setScrollToForm,
}) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.EDIT}
      resource={RESOURCES.TASK}
      tooltipTitle="Edit task"
      fallbackTooltip="Upgrade to Planner or Admin role to edit tasks"
      className="p-1.5 rounded-md transition-all duration-200 
              text-[#9B2C62] hover:text-white hover:bg-[#9B2C62]
              group relative dark:text-[#D97706] dark:hover:bg-[#D97706]"
      //   title="Edit Task"
      onClick={() => {
        setTaskToEdit(task);
        setShowCreateTaskForm(true);
        if (typeof setScrollToForm === "function") {
          setScrollToForm(true);
        }
      }}
    >
      <Pencil className="w-4 h-4" />
      {/* Optional tooltip */}
      <span
        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
      >
        Edit Task
      </span>
    </PermissionButton>
  );
};


