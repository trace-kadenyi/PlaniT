import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
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
import {
  fetchVendorById,
  toggleArchiveVendor,
  clearVendorDetails,
} from "../redux/vendorsSlice";
import { LoadingPage } from "../components/shared/LoadingStates";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";

export default function Vendor() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    vendorDetails: { data: vendor, status, error },
    archiveStatus,
  } = useSelector((state) => state.vendors);

  useEffect(() => {
    dispatch(fetchVendorById(id));

    return () => {
      dispatch(clearVendorDetails());
    };
  }, [dispatch, id]);

  const handleArchiveToggle = async () => {
    try {
      await dispatch(toggleArchiveVendor(vendor._id)).unwrap();
      toastWithProgress(
        `Vendor ${vendor.isArchived ? "restored" : "archived"} successfully`
      );
    } catch (err) {
      toastWithProgress("Failed to update vendor status");
    }
  };

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-4">
          <Link
            to="/vendors"
            className="inline-flex items-center text-[#9B2C62] hover:text-[#7B1D52] font-medium transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Vendors
          </Link>
        </div>

        {/* loading */}
        {status === "loading" && (
          <LoadingPage message="Loading vendor details..." />
        )}

        {/* failed */}
        {status === "failed" && (
          <div className="mb-6">
            <ErrorState
              message={error || "Failed to load vendor details."}
              action={
                <button
                  onClick={() => dispatch(fetchVendorById(id))}
                  className="text-sm text-red-600 hover:underline font-medium"
                >
                  Retry
                </button>
              }
            />
          </div>
        )}

        {/* Vendor details */}
        {status === "succeeded" && vendor && (
          <div>
            {/* Archive/edit btn */}
            <div className="flex sm:justify-end mb-8">
              <div className="flex gap-4">
                <button
                  onClick={handleArchiveToggle}
                  disabled={archiveStatus === "loading"}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    vendor.isArchived
                      ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
                      : "bg-[#FFF3E6] text-[#CC6D00] hover:bg-[#FFE0B3] border border-[#FFB84D]"
                  } ${
                    archiveStatus === "loading"
                      ? "opacity-70 cursor-not-allowed"
                      : ""
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

            {/* Vendor Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
              {/* Header with accent */}
              <div className="bg-gradient-to-r from-[#9B2C62] to-[#7B1D52] p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {vendor.name}
                    </h2>
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
                        This vendor is archived and won't appear in default
                        listings.
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
                              <span className="text-gray-400">
                                Not provided
                              </span>
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
                              <span className="text-gray-400">
                                Not provided
                              </span>
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
                              <span className="text-gray-400">
                                Not provided
                              </span>
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
        )}
      </div>
    </main>
  );
}
