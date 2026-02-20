import {
  Plus,
  Pencil,
  RefreshCcw,
  Archive,
  SquarePen,
  Trash2,
} from "lucide-react";

import PermissionButton from "./PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";
import { createVendorArchiveHandler } from "../../globalHandlers/vendorArchiveHandler";
import { useToastLock } from "../../globalUtils/useToastLock";

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

// Add first vendor
export const AddFirstVendorBtn = ({ navigate }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.CREATE}
      resource={RESOURCES.VENDOR}
      onClick={() => navigate("/vendors/new")}
      tooltipTitle="Create a new vendor"
      fallbackTooltip="Upgrade to Planner or Admin role to create vendors"
      className="bg-[#9B2C62] hover:bg-[#801f4f] text-white px-5 py-2 rounded-lg font-medium"
    >
      Add Your First Vendor
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
      tooltipTitle={`${vendor.isArchived ? "Cannot edit archived vendors" : "Edit vendor"}`}
      fallbackTooltip="Upgrade to Planner or Admin role to edit vendors"
      disabled={vendor.isArchived}
      onClick={() => navigate(`/vendors/${vendor._id}/edit`)}
      className={`flex items-center space-x-1 text-sm px-1 py-1 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/30 text-[#BE3455] dark:text-[#F59E0B] hover:bg-[#F59E0B]/20 transition text-xs cursor-pointer`}
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
  archiveStatus,
}) => {
  const toastLock = useToastLock();

  return (
    <PermissionButton
      permission={PERMISSIONS.ARCHIVE}
      resource={RESOURCES.VENDOR}
      tooltipTitle={`${
        archiveStatus === "loading"
          ? "please wait..."
          : vendor.isArchived
            ? "Restore vendor"
            : "Archive vendor"
      }`}
      fallbackTooltip={`${
        vendor.isArchived
          ? "Upgrade to Planner or Admin role to restore vendors"
          : "Upgrade to Planner or Admin role to archive vendors"
      }`}
      disabled={archiveStatus === "loading"}
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
        ArchiveConfirmationToast,
        toastLock,
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

// edit vendor btn
export const EditVendorBtn = ({ vendor, navigate }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.EDIT}
      resource={RESOURCES.VENDOR}
      tooltipTitle="Edit vendor"
      fallbackTooltip="Upgrade to Planner or Admin role to edit vendors"
      onClick={() => navigate(`/vendors/${vendor._id}/edit`)}
      className="flex items-center bg-[#9B2C62] hover:bg-[#7B1D52] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 dark:bg-[#D97706] dark:hover:bg-[#F59E0B] flex-1 sm:flex-none justify-center"
    >
      <SquarePen className="mr-2 w-4 h-4" />
      <span>Edit</span>
    </PermissionButton>
  );
};

// archive vendor btn
export const ArchiveVendorBtn = ({ vendor, handleArchive, archiveStatus }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.ARCHIVE}
      resource={RESOURCES.VENDOR}
      tooltipTitle={`${
        archiveStatus === "loading"
          ? "please wait..."
          : vendor.isArchived
            ? "Restore vendor"
            : "Archive vendor"
      }`}
      fallbackTooltip={`${
        vendor.isArchived
          ? "Upgrade to Planner or Admin role to restore vendors"
          : "Upgrade to Planner or Admin role to archive vendors"
      }`}
      onClick={handleArchive}
      disabled={archiveStatus === "loading"}
      className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex-1 sm:flex-none justify-center ${
        vendor.isArchived
          ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300 dark:bg-green-200/80 dark:text-black dark:hover:bg-green-200/60 dark:border-green-300/20"
          : "bg-[#FFF3E6] text-[#CC6D00] hover:bg-[#FFE0B3] border border-[#FFB84D] dark:bg-[#FFE0B3]/70 dark:text-black dark:hover:bg-[#FFE0B3]/60 dark:border-[#FFB84D]/60"
      } ${archiveStatus === "loading" ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {archiveStatus === "loading" ? (
        <RefreshCcw className="animate-spin mr-2 w-4 h-4" />
      ) : vendor.isArchived ? (
        <RefreshCcw className="mr-2 w-4 h-4" />
      ) : (
        <Archive className="mr-2 w-4 h-4" />
      )}
      <span>{vendor.isArchived ? "Restore" : "Archive"}</span>
    </PermissionButton>
  );
};

// delete vendor
export const DeleteVendorBtn = ({ handleDelete, vendor }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.DELETE}
      resource={RESOURCES.VENDOR}
      tooltipTitle="Delete vendor"
      fallbackTooltip="Upgrade to Planner or Admin role to delete vendors"
      onClick={() => handleDelete(vendor._id)}
      disabled={vendor?.isDeleting}
      className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 dark:bg-red-900/60 dark:hover:bg-red-900/50 dark:text-white justify-center border border-red-200 dark:border-red-700/50"
    >
      {vendor?.isDeleting ? (
        <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4 mr-2" />
      )}
      {vendor?.isDeleting ? "Deleting..." : "Delete"}
    </PermissionButton>
  );
};

// save vendor form btn
export const SaveVendorFormBtn = ({ formStatus, onCancel }) => {
  return (
    <div className="flex gap-4">
      <PermissionButton
        permission={PERMISSIONS.CREATE}
        resource={RESOURCES.VENDOR}
        tooltipTitle={`${
          formStatus === "loading" ? "Saving..." : "Save vendor"
        }`}
        fallbackTooltip="Upgrade to Planner or Admin role to add vendors"
        type="submit"
        disabled={formStatus === "loading"}
        className="bg-[#F59E0B] hover:bg-[#D97706] dark:bg-[#D97706] dark:hover:bg-[#F59E0B]  text-white font-semibold px-6 py-2 rounded-lg"
      >
        {formStatus === "loading" ? "Saving..." : "Save Vendor"}
      </PermissionButton>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={formStatus === "loading"}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      )}
    </div>
  );
};
