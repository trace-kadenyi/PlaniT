import { Plus, Pencil } from "lucide-react";

import PermissionButton from "./PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";

// create vendor btn
export const CreateVendorBtn = ({ navigate }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.CREATE}
      resource={RESOURCES.VENDOR}
      onClick={() => navigate("/vendors/new")}
      tooltipTitle="Create a new vendor"
      fallbackTooltip="Upgrade to Planner or Admin role to create vendors"
      className="bg-[#9B2C62] hover:bg-[#801f4f] text-white font-semibold px-5 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
    >
      <Plus className="w-5 h-5" /> New Vendor
    </PermissionButton>
  );
};

// delete all vendors btn
export const DeleteAllVendorsBtn = ({ handleDeleteAll, deleteAllStatus }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.DELETE_ALL}
      resource={RESOURCES.VENDOR}
      onClick={handleDeleteAll}
      loading={deleteAllStatus === "loading"}
      disabled={deleteAllStatus === "loading"}
      tooltipTitle="Delete all vendors"
      fallbackTooltip="Admin role required to delete all vendors"
      className={`bg-[#9B2C62] hover:bg-[#801f4f] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap ${
        deleteAllStatus === "loading" ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {deleteAllStatus === "loading" ? "Deleting..." : "Delete All vendors"}
    </PermissionButton>
  );
};

// edit vendor btn
export const EditTBVendorBtn = ({ navigate, vendor }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.EDIT}
      resource={RESOURCES.VENDOR}
      tooltipTitle="Edit vendor"
      fallbackTooltip="Upgrade to Planner or Admin role to edit vendors"
      onClick={() => navigate(`/vendors/${vendor._id}/edit`)}
      className="flex items-center space-x-1 text-sm px-1 py-1 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/30 text-[#BE3455] dark:text-[#F59E0B] hover:bg-[#F59E0B]/20 transition text-xs cursor-pointer"
    >
      <Pencil className="w-3 h-3" />
      <span>edit</span>
    </PermissionButton>
  );
};
