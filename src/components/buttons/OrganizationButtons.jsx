import { Pencil, Check, X } from "lucide-react";
import PermissionButton from "./PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";

export const EditOrgNameBtn = ({ onEdit }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.EDIT}
      resource={RESOURCES.ORGANIZATION}
      onClick={onEdit}
      tooltipTitle="Edit organization name"
      fallbackTooltip="Only Super Admins can edit the organization name"
      className="text-[#9B2C62] dark:text-[#D97706] hover:opacity-70 transition-opacity"
    >
      <Pencil className="w-4 h-4" />
    </PermissionButton>
  );
};

export const SaveOrgNameBtn = ({ onSave, updateStatus }) => {
  const isLoading = updateStatus === "loading";
  return (
    <PermissionButton
      permission={PERMISSIONS.EDIT}
      resource={RESOURCES.ORGANIZATION}
      onClick={onSave}
      loading={isLoading}
      disabled={isLoading}
      tooltipTitle={isLoading ? "Saving..." : "Save organization name"}
      fallbackTooltip="Only Super Admins can edit the organization name"
      className="text-green-600 dark:text-green-500 hover:opacity-70 transition-opacity disabled:opacity-50"
    >
      <Check className="w-5 h-5" />
    </PermissionButton>
  );
};

export const CancelOrgNameBtn = ({ onCancel }) => {
  return (
    <button
      onClick={onCancel}
      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      title="Cancel"
    >
      <X className="w-5 h-5" />
    </button>
  );
};
