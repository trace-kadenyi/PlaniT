export default function ArchiveEditVendor({
  handleArchive,
  archiveStatus,
  vendor,
  RefreshCcw,
  Archive,
  navigate,
  SquarePen,
}) {
  return (
    <div className="flex sm:justify-end mb-8">
      <div className="flex gap-4">
        <button
          onClick={handleArchive}
          disabled={archiveStatus === "loading"}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
            vendor.isArchived
              ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
              : "bg-[#FFF3E6] text-[#CC6D00] hover:bg-[#FFE0B3] border border-[#FFB84D]"
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
        <button
          onClick={() => navigate(`/vendors/${vendor._id}/edit`)}
          className="flex items-center bg-[#9B2C62] hover:bg-[#7B1D52] text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
        >
          <SquarePen className="mr-2 w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
}
