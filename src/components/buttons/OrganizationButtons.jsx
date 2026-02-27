import {
  Pencil,
  Check,
  X,
  XCircle,
  FileCheck,
  Save,
  CheckCircle2,
} from "lucide-react";
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
      className="inline-flex items-center justify-center rounded-md p-2 
bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Check className="w-4 h-4" />
    </PermissionButton>
  );
};

export const CancelOrgNameBtn = ({ onCancel }) => {
  return (
    <button
      onClick={onCancel}
      className="inline-flex items-center justify-center rounded-md p-2 
bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
      title="Cancel"
    >
      <X className="w-4 h-4" />
    </button>
  );
};
