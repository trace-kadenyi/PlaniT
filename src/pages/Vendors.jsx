import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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

import {
  toggleArchiveVendor,
  resetVendorStatuses,
  fetchVendors,
  fetchVendorStats,
} from "../redux/vendorsSlice";

import { GenErrorState } from "../components/shared/ErrorStates";
import { useFilteredVendors } from "../globalHooks/useFilteredVendors";
import VendorPagination from "../components/vendors/VendorPagination";
import VendorsTable from "../components/vendors/VendorsTable";

export default function Vendors() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState("all");

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    filteredVendors,
    currentVendors,
    totalPages,
    paginate,
    stats,
    status,
    error,
    statsStatus,
    archiveStatus,
    indexOfFirstVendor,
    indexOfLastVendor,
  } = useFilteredVendors({
    fetchVendors,
    fetchVendorStats,
    filterMode,
    setFilterMode,
  });

  // Reset states when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetVendorStatuses());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62]">
              Vendor Directory
            </h1>
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

        {/* vendor list */}
        {status === "succeeded" && filteredVendors.length > 0 && (
          <>
            <VendorsTable
              currentVendors={currentVendors}
              navigate={navigate}
              dispatch={dispatch}
              toggleArchiveVendor={toggleArchiveVendor}
              fetchVendors={fetchVendors}
              fetchVendorStats={fetchVendorStats}
              filterMode={filterMode}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <VendorPagination
                paginate={paginate}
                currentPage={currentPage}
                totalPages={totalPages}
                indexOfFirstVendor={indexOfFirstVendor}
                indexOfLastVendor={indexOfLastVendor}
                filteredVendors={filteredVendors}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
