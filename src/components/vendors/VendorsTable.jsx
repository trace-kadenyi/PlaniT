import {
  ExternalLink,
  Pencil,
  RefreshCcw,
  Archive,
  UserCog,
} from "lucide-react";

import { createVendorArchiveHandler } from "../../globalHandlers/vendorArchiveHandler";
import ArchiveConfirmationToast from "../../globalUtils/archiveConfirmationToast";
import { toastWithProgress } from "../../globalHooks/useToastWithProgress";

export default function VendorsTable({
  currentVendors,
  navigate,
  dispatch,
  toggleArchiveVendor,
  fetchVendors,
  fetchVendorStats,
  filterMode,
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-[#E3CBC1]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E3CBC1]">
          <thead className="bg-[#F7F7FA]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9B2C62] uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9B2C62] uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9B2C62] uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#9B2C62] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#E3CBC1]">
            {currentVendors.map((vendor) => (
              <tr
                key={vendor._id}
                className={`hover:bg-gray-100 ${
                  vendor.isArchived ? "bg-gray-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#9B2C62] flex items-center justify-center text-white">
                      <UserCog className="w-5 h-5" />
                    </div>
                    <div>
                      <div
                        onClick={() => navigate(`/vendors/${vendor._id}`)}
                        className={`text-sm font-medium hover:underline hover:italic cursor-default ${
                          vendor.isArchived ? "text-gray-500" : "text-[#9B2C62]"
                        }`}
                      >
                        {vendor.name}
                        {vendor.isArchived && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                            Archived
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vendor.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-[#6B3B0F] capitalize">
                    {vendor.services}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#6B3B0F]">
                    {vendor.contact?.email || "Not provided"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {vendor.contact?.phone || "Not provided"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/vendors/${vendor._id}`)}
                      className="flex items-center space-x-1 font-semibold px-2 py-1 rounded-full transition text-xs text-[#9B2C62] hover:text-white bg-[#9B2C62]/10 hover:bg-[#9B2C62]"
                      title="View Details"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => navigate(`/vendors/${vendor._id}/edit`)}
                      className="flex items-center space-x-1 text-sm px-1 py-1 rounded-full bg-[#F59E0B]/10 text-[#BE3455] hover:bg-[#F59E0B]/20 transition text-xs cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>edit</span>
                    </button>
                    <button
                      onClick={createVendorArchiveHandler(
                        dispatch,
                        vendor._id,
                        vendor.isArchived,
                        toggleArchiveVendor,
                        fetchVendors,
                        fetchVendorStats,
                        filterMode,
                        toastWithProgress,
                        ArchiveConfirmationToast
                      )}
                      className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-full transition text-xs ${
                        vendor.isArchived
                          ? "text-green-500 hover:text-green-600 bg-green-100/50 text-green-600 hover:bg-green-200"
                          : "text-red-600 hover:text-red-700 bg-red-100/30 hover:bg-red-200"
                      }`}
                      title={vendor.isArchived ? "Restore" : "Archive"}
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
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
