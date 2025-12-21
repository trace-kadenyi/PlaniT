import { XCircle, Plus } from "lucide-react";

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
