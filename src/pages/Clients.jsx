import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiSearch,
} from "react-icons/fi";

import {
  fetchClients,
  archiveClient,
  restoreClient,
  resetArchiveStates,
} from "../redux/clientsSlice";
import ClientTable from "../components/clients/ClientTable";

export default function Clients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterMode, setFilterMode] = useState("all"); // "active" | "archived" | "all"
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 4;

  const {
    items: allClients,
    status,
    error,
  } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetArchiveStates());
    };
  }, [dispatch]);

  const handleArchiveToggle = (clientId, isArchived) => {
    const action = isArchived ? restoreClient : archiveClient;
    dispatch(action(clientId)).then(() => {
      dispatch(fetchClients());
      setCurrentPage(1); // Reset to first page after status change
    });
  };

  const filteredClients = allClients
    .filter((client) => {
      if (filterMode === "active") return !client.isArchived;
      if (filterMode === "archived") return client.isArchived;
      return true;
    })
    .filter((client) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        client.name.toLowerCase().includes(term) ||
        client.contact?.email?.toLowerCase().includes(term) ||
        false ||
        client.contact?.phone?.toLowerCase().includes(term) ||
        false
      );
    });
  // .sort((a, b) => {
  //   if (filterMode === "all") {
  //     return a.isArchived === b.isArchived ? 0 : a.isArchived ? 1 : -1;
  //   }
  //   return 0;
  // });

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <main className="min-h-screen bg-[#FFF7ED] px-4 py-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#9B2C62]">
              Client Directory
            </h1>
            <p className="text-[#F59E0B] mt-1">
              {filteredClients.length}{" "}
              {filteredClients.length === 1 ? "client" : "clients"} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9B2C62] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              onClick={() => navigate("/clients/new")}
              className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap max-w-[150px]"
            >
              <FiPlus /> Add Client
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <FiFilter className="mr-2" />
            <span>Filter by:</span>
          </div>
          {["all", "active", "archived"].map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setFilterMode(mode);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                filterMode === mode
                  ? "bg-[#9B2C62] text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {mode === "active" && (
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              )}
              {mode === "archived" && <span>🗃️</span>}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Messages */}
        {status === "loading" && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62]"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Clients */}
        {status === "succeeded" && filteredClients.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No clients found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "No clients match your search criteria"
                : filterMode === "active"
                ? "You don't have any active clients"
                : filterMode === "archived"
                ? "Your archive is empty"
                : "You don't have any clients yet"}
            </p>
            <button
              onClick={() => navigate("/clients/new")}
              className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-5 py-2 rounded-lg font-medium"
            >
              Add Your First Client
            </button>
          </div>
        )}

        {/* Client Table */}
        {status === "succeeded" && filteredClients.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <ClientTable
                currentClients={currentClients}
                navigate={navigate}
                handleArchiveToggle={handleArchiveToggle}
              />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      paginate(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstClient + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastClient, filteredClients.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredClients.length}
                      </span>{" "}
                      clients
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? "text-gray-300"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <FiChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === number
                                ? "z-10 bg-[#9B2C62] border-[#9B2C62] text-white"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            {number}
                          </button>
                        )
                      )}

                      <button
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? "text-gray-300"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
