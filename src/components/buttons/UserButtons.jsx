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

// add member form btn
export const AddMemberFormBtn = ({ setShowAddForm, addUserStatus }) => {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        onClick={() => {
          setShowAddForm(false);
        }}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-3 py-1 rounded-lg transition-all text-xs"
      >
        Cancel
      </button>
      <PermissionButton
        permission={PERMISSIONS.MANAGE_USERS}
        resource={RESOURCES.USER}
        tooltipTitle="Add new member"
        fallbackTooltip="Upgrade to Admin role to add team members"
        type="submit"
        disabled={addUserStatus === "loading"}
        className="bg-[#9B2C62] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#7A2250] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#d97706] dark:hover:bg-[#d97706]/80"
      >
        {addUserStatus === "loading" ? "Adding..." : "Add Member"}
      </PermissionButton>
    </div>
  );
};
