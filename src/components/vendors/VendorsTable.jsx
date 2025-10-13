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
    <div className="minimal-scrollbar overflow-x-auto bg-white rounded-lg shadow overflow-hidden border border-[#E3CBC1] dark:border-gray-900 dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black">
      <table className="min-w-full divide-y divide-[#E3CBC1] dark:divide-gray-600">
        <thead className="bg-[#F7F7FA] dark:bg-[#9B2C62]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#9B2C62] dark:text-gray-200 uppercase tracking-wider">
              Vendor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#9B2C62] dark:text-gray-200 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#9B2C62] dark:text-gray-200 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#9B2C62] dark:text-gray-200 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#E3CBC1] dark:divide-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-r dark:border-gray-900/10 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
          {currentVendors.map((vendor) => (
            <tr
              key={vendor._id}
              className={`hover:bg-gray-100 dark:hover:bg-gray-800 ${
                vendor.isArchived
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "hover:bg-[#FFF7ED] dark:hover:bg-gray-900"
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
                        vendor.isArchived
                          ? "text-gray-500"
                          : "text-[#9B2C62] dark:text-[#D97706]"
                      }`}
                    >
                      {vendor.name}
                      {vendor.isArchived && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-500 text-gray-800 dark:text-gray-900">
                          Archived
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-sm text-gray-500  ${
                        vendor.isArchived ? "" : "dark:text-gray-400"
                      }`}
                    >
                      {vendor.address}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-[#6B3B0F] dark:text-[#D97706] capitalize">
                  {vendor.services}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[#6B3B0F] dark:text-gray-300">
                  {vendor.contact?.email || "Not provided"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {vendor.contact?.phone || "Not provided"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => navigate(`/vendors/${vendor._id}`)}
                    className="flex items-center space-x-1 font-semibold px-2 py-1 rounded-full transition text-xs text-[#9B2C62] dark:text-[#D97706] hover:text-white hover:dark:text-black bg-[#9B2C62]/10 hover:bg-[#9B2C62] hover:dark:bg-[#D97706]"
                    title="View Details"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => navigate(`/vendors/${vendor._id}/edit`)}
                    className="flex items-center space-x-1 text-sm px-1 py-1 rounded-full bg-[#F59E0B]/10 dark:bg-[#F59E0B]/30 text-[#BE3455] dark:text-[#F59E0B] hover:bg-[#F59E0B]/20 transition text-xs cursor-pointer"
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
  );
}
