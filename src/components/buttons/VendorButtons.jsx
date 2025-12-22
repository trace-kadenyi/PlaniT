import { Plus, Pencil, RefreshCcw, Archive } from "lucide-react";

import PermissionButton from "./PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";
import { createVendorArchiveHandler } from "../../globalHandlers/vendorArchiveHandler";

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

// edit vendor table btn
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

// archive vendor table btn
export const ArchiveTBVendorBtn = ({
  dispatch,
  vendor,
  toggleArchiveVendor,
  fetchVendors,
  fetchVendorStats,
  filterMode,
  toastWithProgress,
  ArchiveConfirmationToast,
}) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.ARCHIVE}
      resource={RESOURCES.VENDOR}
      tooltipTitle="Archive vendor"
      fallbackTooltip={`${
        vendor.isArchived
          ? "Upgrade to Planner or Admin role to restore vendors"
          : "Upgrade to Planner or Admin role to archive vendors"
      }`}
      onClick={createVendorArchiveHandler(
        dispatch,
        vendor._id,
        vendor.isArchived,
        vendor,
        toggleArchiveVendor,
        fetchVendors,
        fetchVendorStats,
        filterMode,
        toastWithProgress,
        ArchiveConfirmationToast
      )}
      className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-full transition text-xs ${
        vendor.isArchived
          ? "text-green-500 dark:text-green-900 hover:text-green-600 bg-green-100/50 dark:bg-green-900 text-green-600 dark:text-white hover:bg-green-200 dark:hover:bg-green-200 dark:hover:text-gray-900"
          : "text-red-600 hover:text-red-700 bg-red-100/30 hover:bg-red-200 dark:bg-red-100/30 dark:hover:bg-red-200 dark:text-white dark:hover:text-black"
      }`}
    >
      {vendor.isArchived ? (
        <>
          <RefreshCcw className="w-3 h-3" />
          <span>Restore</span>
        </>
      ) : (
        <>
          <Archive className="w-3 h-3" />
          <span>Archive</span>
        </>
      )}
    </PermissionButton>
  );
};
