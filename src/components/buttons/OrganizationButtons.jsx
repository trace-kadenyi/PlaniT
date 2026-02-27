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
      className="inline-flex items-center justify-center rounded-lg p-2 
text-emerald-500 hover:bg-emerald-100/60 
dark:text-emerald-400 dark:hover:bg-emerald-900/40
transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Check className="w-5 h-5" />
    </PermissionButton>
  );
};

export const CancelOrgNameBtn = ({ onCancel }) => {
  return (
    <button
      onClick={onCancel}
      className="inline-flex items-center justify-center rounded-lg p-2 
text-gray-500 hover:bg-gray-100 
dark:text-gray-400 dark:hover:bg-gray-800
transition-colors"
      title="Cancel"
    >
      <X className="w-5 h-5" />
    </button>
  );
};
