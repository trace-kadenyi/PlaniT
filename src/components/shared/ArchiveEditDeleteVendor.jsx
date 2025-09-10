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
        <button
          onClick={() => navigate(`/vendors/${vendor._id}/edit`)}
          className="flex items-center bg-[#9B2C62] hover:bg-[#7B1D52] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 dark:bg-[#D97706] dark:hover:bg-[#F59E0B] flex-1 sm:flex-none justify-center"
        >
          <SquarePen className="mr-2 w-4 h-4" />
          <span>Edit</span>
        </button>

        {/* toggle archive vendor */}
        <button
          onClick={handleArchive}
          disabled={archiveStatus === "loading"}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
            vendor.isArchived
              ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300 dark:bg-green-200/80 dark:text-black dark:hover:bg-green-200/60 dark:border-green-300/20"
              : "bg-[#FFF3E6] text-[#CC6D00] hover:bg-[#FFE0B3] border border-[#FFB84D] dark:bg-[#FFE0B3]/70 dark:text-black dark:hover:bg-[#FFE0B3]/60 dark:border-[#FFB84D]/60"
          } ${
            archiveStatus === "loading" ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {archiveStatus === "loading" ? (
            <RefreshCcw className="animate-spin mr-2" />
          ) : vendor.isArchived ? (
            <RefreshCcw className="mr-2 w-5 h-5" />
          ) : (
            <Archive className="mr-2 w-4 h-4" />
          )}
          <span>{vendor.isArchived ? "Restore" : "Archive"}</span>
        </button>

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
