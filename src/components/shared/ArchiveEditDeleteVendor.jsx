import { ArchiveVendorBtn, EditVendorBtn } from "../buttons/VendorButtons";

export default function ArchiveEditDeleteVendor({
  handleArchive,
  archiveStatus,
  vendor,
  RefreshCcw,
  Archive,
  navigate,
  SquarePen,
  Trash2,
  handleDelete,
}) {
  return (
    <div className="flex sm:justify-end mb-4">
      <div className="flex gap-4 flex-wrap">
        {/* edit vendor */}
        <EditVendorBtn vendor={vendor} />

        {/* toggle archive vendor */}
        <ArchiveVendorBtn
          vendor={vendor}
          handleArchive={handleArchive}
          archiveStatus={archiveStatus}
        />

        {/* delete vendor */}
        <button
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
        </button>
      </div>
    </div>
  );
}
