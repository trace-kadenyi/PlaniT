import {
  SquarePen,
  RefreshCcw,
  Archive,
  Mail,
  CircleUserRound,
  MapPinHouse,
  Phone,
  Globe,
  MapPin,
  FileText,
} from "lucide-react";

import { createVendorArchiveHandler } from "../../globalHandlers/vendorArchiveHandler";
import { toastWithProgress } from "../../globalHooks/useToastWithProgress";
import ArchiveConfirmationToast from "../../globalUtils/archiveConfirmationToast";
import ArchiveEditVendor from "../shared/ArchiveEditVendor";

export default function VendorCard({
  dispatch,
  vendor,
  toggleArchiveVendor,
  archiveStatus,
  navigate,
}) {
  const handleArchive = createVendorArchiveHandler(
    dispatch,
    vendor?._id,
    vendor?.isArchived,
    toggleArchiveVendor,
    null, // Don't need to fetch vendors list in details page
    null, // Don't need to fetch stats in details page
    null, // No filter mode needed
    toastWithProgress,
    ArchiveConfirmationToast
  );

  return (
    <div>
      {/* Archive/edit btn */}
      <ArchiveEditVendor
        handleArchive={handleArchive}
        archiveStatus={archiveStatus}
        vendor={vendor}
        RefreshCcw={RefreshCcw}
        Archive={Archive}
        navigate={navigate}
        SquarePen={SquarePen}
      />

      {/* Vendor Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
        {/* Header with accent */}
        <div className="bg-gradient-to-r from-[#9B2C62] to-[#7B1D52] p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">{vendor.name}</h2>
            </div>
            <p className="inline-block text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-[#F8D476] to-[#F59E0B] text-[#6B3B0F] font-medium tracking-wide uppercase font-medium font-semibold">
              {vendor.services} SERVICES{" "}
            </p>
          </div>
        </div>

        {/* Archived notice */}
        {vendor.isArchived && (
          <div className="bg-[#FFF9E6] border-l-4 border-[#F59E0B] p-4">
            <div className="flex items-center">
              <Archive className="h-5 w-5 text-[#E67E00] mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm text-[#CC6D00]">
                  This vendor is archived and won't appear in default listings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-[#9B2C62] mb-4 pb-2 border-b border-[#F2D9E6] flex items-center">
                <CircleUserRound className="mr-2 text-[#9B2C62]" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-[#FF8F00] mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-gray-800">
                      {vendor.contact?.email || (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-[#FF8F00] mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Phone
                    </p>
                    <p className="text-gray-800">
                      {vendor.contact?.phone || (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-[#FF8F00] mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Website
                    </p>
                    <p className="text-gray-800">
                      {vendor.contact?.website ? (
                        <a
                          href={vendor.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF8F00] hover:underline hover:text-[#E67E00]"
                        >
                          {vendor.contact.website}
                        </a>
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-[#9B2C62] mb-4 pb-2 border-b border-[#F2D9E6] flex items-center">
                <MapPinHouse className="mr-2 text-[#9B2C62]" />
                Address
              </h3>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#FF8F00] mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-gray-800">
                    {vendor.address || (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {vendor.notes && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#9B2C62] mb-4 pb-2 border-b border-[#F2D9E6] flex items-center">
                <FileText className="mr-2 text-[#9B2C62]" />
                Notes
              </h3>
              <div className="bg-[#F9F0F5] p-4 rounded-lg border border-[#E6B3CD]">
                <p className="text-gray-700 whitespace-pre-line">
                  {vendor.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
