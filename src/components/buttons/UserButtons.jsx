import { Plus, Edit2, Trash2, Save } from "lucide-react";

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
        disabled={addUserStatus === "loading"}
        onClick={() => {
          setShowAddForm(false);
        }}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-3 py-1 rounded-lg transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <PermissionButton
        permission={PERMISSIONS.MANAGE_USERS}
        resource={RESOURCES.USER}
        tooltipTitle={`${
          addUserStatus === "loading" ? "Adding..." : "Add a new member"
        }`}
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

// edit user btn
export const EditUserBtn = ({ userId, userData, authUser }) => {
  return (
    <PermissionButton
      to={`/users/${userId}/edit`}
      permission={PERMISSIONS.EDIT}
      resource={RESOURCES.USER}
      target={userData}
      tooltipTitle="Edit user details"
      fallbackTooltip={`${
        authUser.firstName === userData.firstName &&
        authUser.lastName === userData.lastName &&
        (authUser.role === "super_admin" || authUser.role === "admin")
          ? "You cannot edit your own profile"
          : "You do not have permission to edit this user"
      }`}
      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#9B2C62] to-[#801f4f] hover:opacity-90 text-white px-5 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <Edit2 className="w-5 h-5" />
      Edit Profile
    </PermissionButton>
  );
};

// delete user btn
export const DeleteUserBtn = ({
  userData,
  handleRemoveUser,
  userId,
  deleteStatus,
  authUser,
}) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.DELETE}
      resource={RESOURCES.USER}
      target={userData}
      onClick={() => handleRemoveUser(userId)}
      loading={deleteStatus === "loading"}
      disabled={deleteStatus === "loading"}
      tooltipTitle="Remove user from organization"
      fallbackTooltip={`${
        authUser.firstName === userData.firstName &&
        authUser.lastName === userData.lastName &&
        (authUser.role === "super_admin" || authUser.role === "admin")
          ? "You cannot remove your own profile"
          : "You do not have permission to remove this user"
      }`}
      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-white/80 to-rose-50/80 dark:from-gray-900/30 dark:to-[#9B2C62]/10 hover:from-rose-50 hover:to-rose-100/80 dark:hover:from-gray-800/40 dark:hover:to-[#9B2C62]/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-[#9B2C62]/30 px-5 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-[#9B2C62]/50 group"
    >
      <Trash2 className="w-5 h-5" />
      {deleteStatus === "loading" ? "Deactivating..." : "Deactivate Account"}
    </PermissionButton>
  );
};

// edit user form btn
export const EditUserFormBtn = ({
  userDetails,
  updateRoleStatus,
  updateStatus,
  canEditUser,
  isSelf,
  authUser,
  isEditConfirmActive,
}) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.EDIT}
      resource={RESOURCES.USER}
      target={userDetails}
      type="submit"
      loading={updateRoleStatus === "loading" || updateStatus === "loading"}
      disabled={
        !canEditUser ||
        updateRoleStatus === "loading" ||
        updateStatus === "loading" ||
        isEditConfirmActive
      }
      tooltipTitle={
        isSelf
          ? "You cannot edit your own profile"
          : updateStatus === "loading" || updateRoleStatus === "loading"
            ? "Saving..."
            : isEditConfirmActive
              ? "Confirming..."
              : canEditUser
                ? "Save changes"
                : "You don't have permission to edit this user"
      }
      fallbackTooltip={`${
        isSelf && (authUser.role === "super_admin" || authUser.role === "admin")
          ? "You cannot edit your own profile"
          : "You don't have permission to edit this user"
      }`}
      className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Save className="w-4 h-4" />
      {updateRoleStatus === "loading" || updateStatus === "loading"
        ? "Saving..."
        : "Save Changes"}
    </PermissionButton>
  );
};

// deactivate user from team list btn
export const DeactivateUserBtn = ({ onRemoveUser, user, currentUser }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.DELETE}
      resource={RESOURCES.USER}
      target={user}
      onClick={() => onRemoveUser(user._id)}
      tooltipTitle="Remove user from organization"
      fallbackTooltip={`${
        currentUser._id === user._id &&
        (currentUser.role === "super_admin" || currentUser.role === "admin")
          ? "Cannot remove yourself from the system"
          : "You do not have permission to remove this user"
      }`}
      className="text-red-600 hover:text-red-800 px-3 py-1 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200 text-xs font-semibold dark:border-red-400 dark:hover:border-red-500 dark:hover:text-red-700"
    >
      Deactivate
    </PermissionButton>
  );
};

// reactivate user btn
export const ReactivateUserBtn = ({ onReactivateUser, user, currentUser }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.MANAGE_USERS}
      resource={RESOURCES.USER}
      target={user}
      onClick={() => onReactivateUser(user._id)}
      tooltipTitle="Reactivate user"
      fallbackTooltip={
        currentUser._id === user._id
          ? "You cannot reactivate your own account"
          : user.role === "super_admin" &&
            currentUser.role !== "super_admin"
          ? "Only super admins can reactivate super admins"
          : "You do not have permission to reactivate this user"
      }
      className="text-green-600 hover:text-green-800 px-3 py-1 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200 text-xs font-semibold dark:border-green-400 dark:hover:border-green-500 dark:hover:text-green-700"
    >
      Reactivate
    </PermissionButton>
  );
};
