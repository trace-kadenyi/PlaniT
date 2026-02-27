import { Pencil, Check, X, XCircle, FileCheck, Save } from "lucide-react";
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
      className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg p-2.5 transition-colors disabled:opacity-50"
    >
      <Check className="w-4 h-4" />
    </PermissionButton>
  );
};

export const CancelOrgNameBtn = ({ onCancel }) => {
  return (
    <button
      onClick={onCancel}
      className="text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2.5 transition-colors"
      title="Cancel"
    >
      <X className="w-4 h-4" />
    </button>
  );
};
