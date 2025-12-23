import { Plus } from "lucide-react";

import PermissionButton from "./PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";

// add new members
export const AddNewMembersBtn = ({ onAddUser }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.MANAGE_USERS}
      resource={RESOURCES.USER}
      tooltipTitle="Add a new team member"
      fallbackTooltip="Upgrade to Admin role to add team members"
      onClick={onAddUser}
      className="bg-[#9B2C62] hover:bg-[#801f4f] text-white font-semibold px-5 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
    >
      <Plus className="w-5 h-5" />
      Add Team Member
    </PermissionButton>
  );
};
