import {
  ArchiveVendorBtn,
  DeleteVendorBtn,
  EditVendorBtn,
} from "../buttons/VendorButtons";

export default function ArchiveEditDeleteVendor({
  handleArchive,
  archiveStatus,
  vendor,
  navigate,
  handleDelete,
}) {
  return (
    <div className="flex sm:justify-end mb-4">
      <div className="flex gap-4 flex-wrap">
        {/* edit vendor */}
        <EditVendorBtn vendor={vendor} navigate={navigate} />

        {/* toggle archive vendor */}
        <ArchiveVendorBtn
          vendor={vendor}
          handleArchive={handleArchive}
          archiveStatus={archiveStatus}
        />

        {/* delete vendor */}
        <DeleteVendorBtn handleDelete={handleDelete} vendor={vendor} />
      </div>
    </div>
  );
}
