import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  ExternalLink,
  Plus,
  Archive,
  Search,
  Filter,
  RefreshCcw,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  fetchVendors,
  fetchVendorStats,
  toggleArchiveVendor,
  resetVendorStatuses,
} from "../redux/vendorsSlice";

import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import { GenErrorState } from "../components/shared/ErrorStates";
import { createVendorArchiveHandler } from "../globalHandlers/vendorArchiveHandler";
import ArchiveConfirmationToast from "../globalUtils/archiveConfirmationToast";

export default function Vendors() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 10;
  const [showConfirm, setShowConfirm] = useState(false);
  const [vendorToArchive, setVendorToArchive] = useState(null);

  const {
    items: vendors,
    stats,
    status,
    error,
    statsStatus,
    archiveStatus,
  } = useSelector((state) => state.vendors);

  useEffect(() => {
    const archived =
      filterMode === "archived"
        ? true
        : filterMode === "active"
        ? false
        : undefined;

    dispatch(
      fetchVendors({
        archived:
          filterMode === "archived"
            ? true
            : filterMode === "active"
            ? false
            : undefined,
      })
    );
  }, [dispatch, filterMode]);

  useEffect(() => {
    dispatch(fetchVendorStats());
  }, [dispatch]);

  // Reset states when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetVendorStatuses());
    };
  }, [dispatch]);

  // Handle archive toggle
  const handleArchiveToggle = (vendorId, isCurrentlyArchived) => {
    dispatch(toggleArchiveVendor(vendorId))
      .unwrap()
      .then(() => {
        toastWithProgress(
          `Vendor ${isCurrentlyArchived ? "restored" : "archived"} successfully`
        );
        dispatch(
          fetchVendors({
            archived:
              filterMode === "archived"
                ? true
                : filterMode === "active"
                ? false
                : undefined,
          })
        );

        // ✅ Refresh stats
        dispatch(fetchVendorStats());
      })

      .catch((error) => {
        toastWithProgress(error.message || "Failed to update vendor status");
      });
  };

  // Filter vendors
  const filteredVendors = vendors
    .filter((vendor) => {
      if (!vendor) return false;
      if (filterMode === "active") return !vendor.isArchived;
      if (filterMode === "archived") return vendor.isArchived;
      return true;
    })
    .filter((vendor) => {
      if (!vendor) return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        vendor.name?.toLowerCase().includes(term) ||
        vendor.contact?.email?.toLowerCase().includes(term) ||
        vendor.contact?.phone?.toLowerCase().includes(term) ||
        vendor.services?.toLowerCase().includes(term)
      );
    });

  // Pagination logic
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterMode, searchTerm]);

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              {vendorToArchive?.isArchived
                ? "Restore Vendor"
                : "Archive Vendor"}
            </h3>
            <p className="mb-6">
              Are you sure you want to{" "}
              {vendorToArchive?.isArchived ? "restore" : "archive"} this vendor?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleArchiveToggle(
                    vendorToArchive.id,
                    vendorToArchive.isArchived
                  );
                  setShowConfirm(false);
                }}
                className={`px-4 py-2 rounded-lg text-white ${
                  vendorToArchive?.isArchived
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={archiveStatus === "loading"}
              >
                {archiveStatus === "loading"
                  ? "Processing..."
                  : vendorToArchive?.isArchived
                  ? "Restore"
                  : "Archive"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62]">
              Vendor Directory
            </h1>
            {/* <p className="text-[#F59E0B] mt-1">
              {filteredVendors.length}{" "}
              {filteredVendors.length === 1 ? "vendor" : "vendors"} found
            </p> */}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#E3CBC1] rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
              />
            </div>
            <button
              onClick={() => navigate("/vendors/new")}
              className="bg-[#9B2C62] hover:bg-[#801f4f] text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 justify-center"
            >
              <Plus className="w-5 h-5" /> New Vendor
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-start gap-3 mb-6">
          <div className="flex items-center text-sm text-[#9B2C62]">
            <Filter className="w-4 h-4 mr-2" />
            <span>Filter by:</span>
          </div>
          {["all", "active", "archived"].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${
                filterMode === mode
                  ? "bg-[#9B2C62] text-white shadow-md"
                  : "bg-white text-gray-700 border border-[#E3CBC1] hover:bg-[#F7F7FA]"
              }`}
            >
              {mode === "active" && (
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              )}
              {mode === "archived" && <Archive className="w-4 h-4" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Messages */}
        {status === "loading" && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62]"></div>
          </div>
        )}
        {error && (
          <GenErrorState
            error={error}
            message="We ran into an issue accessing your vendors. Please try again later..."
          />
        )}

        {/* Stats - Only show when data is loaded */}
        {status === "succeeded" &&
          statsStatus === "succeeded" &&
          stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 mb-6">
              {stats.map((stat) => (
                <div
                  key={stat._id}
                  className="bg-[#F7F7FA] p-3 rounded-lg text-center"
                >
                  <div className="text-2xl font-bold text-[#9B2C62]">
                    {stat.count}
                  </div>
                  <div className="text-sm capitalize text-[#6B3B0F]">
                    {stat._id}
                  </div>
                  <div className="text-xs text-gray-500">
                    ({stat.archived} archived)
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Vendors List */}
        {status === "succeeded" && filteredVendors.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-[#E3CBC1]">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No vendors found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "No vendors match your search criteria"
                : filterMode === "active"
                ? "You don't have any active vendors"
                : filterMode === "archived"
                ? "Your archive is empty"
                : "You don't have any vendors yet"}
            </p>
            <button
              onClick={() => navigate("/vendors/new")}
              className="bg-[#9B2C62] hover:bg-[#801f4f] text-white px-5 py-2 rounded-lg font-medium"
            >
              Add Your First Vendor
            </button>
          </div>
        )}

        {status === "succeeded" && filteredVendors.length > 0 && (
          <>
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
                          <div className="flex items-center">
                            <div>
                              <div
                                onClick={() =>
                                  navigate(`/vendors/${vendor._id}`)
                                }
                                className={`text-sm font-medium hover:underline hover:italic cursor-default ${
                                  vendor.isArchived
                                    ? "text-gray-500"
                                    : "text-[#9B2C62]"
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
                              onClick={() =>
                                navigate(`/vendors/${vendor._id}/edit`)
                              }
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
                                toast,
                                toastWithProgress,
                                ArchiveConfirmationToast
                              )}
                              className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-full transition text-xs 
    ${
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-[#E3CBC1] rounded-lg text-[#9B2C62] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-10 h-10 rounded-lg ${
                          currentPage === number
                            ? "bg-[#9B2C62] text-white"
                            : "border border-[#E3CBC1] text-[#9B2C62]"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-[#E3CBC1] rounded-lg text-[#9B2C62] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
