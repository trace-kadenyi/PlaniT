import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import toast from "react-hot-toast";

import {
  fetchClients,
  archiveClient,
  restoreClient,
  resetArchiveStates,
  deleteAllClients,
  resetDeleteAllClientsState,
} from "../redux/clientsSlice";

import ClientsTable from "../components/clients/ClientsTable";
import ClientPagination from "../components/clients/ClientPagination";
import { createAllClientsDeleteHandler } from "../globalHandlers/createAllClientsDeleteHandler";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";
import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
} from "../globalHooks/userPermissions";
import PermissionButton from "../components/ui/PermissionButton";

export default function Clients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterMode, setFilterMode] = useState("all"); // "active" | "archived" | "all"
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  const {
    items: allClients,
    status,
    error,
    deleteAllStatus,
  } = useSelector((state) => state.clients);

  // fetch clients
  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  // reset archive states
  useEffect(() => {
    return () => {
      dispatch(resetArchiveStates());
    };
  }, [dispatch]);

  useEffect(() => {
    return () => dispatch(resetDeleteAllClientsState());
  }, [dispatch]);

  // handle archive toggle
  const handleArchiveToggle = (clientId, isArchived) => {
    const action = isArchived ? restoreClient : archiveClient;
    dispatch(action(clientId));
  };

  // filtered clients
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

  // handle delete all clients
  const handleDeleteAll = createAllClientsDeleteHandler(
    dispatch,
    navigate,
    deleteAllClients,
    toast,
    toastWithProgress,
    DeleteConfirmationToast
  );

  return (
    <main className="min-h-screen bg-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-3 sm:p-10 sm:pb-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62] dark:text-[#D97706] mt-12 text-center sm:text-start sm:mt-2">
            Client Directory
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 border border-[#E3CBC1] rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:border-none dark:bg-gray-700/60 dark:text-white"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <PermissionButton
              permission={PERMISSIONS.CREATE}
              resource={RESOURCES.CLIENT}
              onClick={() => navigate("/clients/new")}
              tooltipTitle="Create a new client"
              fallbackTooltip="Upgrade to Planner or Admin role to create clients"
              className="bg-[#F59E0B] dark:bg-[#D97706] hover:bg-[#D97706] hover:dark:bg-[#F59E0B] text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" /> New Client
            </PermissionButton>
          </div>
        </div>

        <div className="flex justify-between flex-wrap mb-6 gap-2">
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-6">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Filter className="mr-2 w-4 h-4" />
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
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 dark:bg-gray-700/60 dark:text-white dark:border-none dark:hover:bg-gray-600/70"
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
          {/* delete all clients btn */}
          {filteredClients.length > 0 && (
            <div className="w-max mx-auto sm:mx-0">
              <PermissionButton
                permission={PERMISSIONS.DELETE_ALL}
                resource={RESOURCES.CLIENT}
                onClick={handleDeleteAll}
                loading={deleteAllStatus === "loading"}
                disabled={deleteAllStatus === "loading"}
                tooltipTitle="Delete all clients"
                fallbackTooltip="Admin role required to delete all clients"
                className={`bg-[#9B2C62] hover:bg-[#801f4f] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap ${
                  deleteAllStatus === "loading"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {deleteAllStatus === "loading"
                  ? "Deleting..."
                  : "Delete All Clients"}
              </PermissionButton>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {status === "loading" && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B2C62] dark:border-[#F59E0B]"></div>
          </div>
        )}

        {/* error */}
        {error && (
          <div className="error-message bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-200 p-4 mb-6 rounded flex items-start">
            <div className="mr-3 mt-0.5 flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500 dark:text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Clients */}
        {status === "succeeded" && filteredClients.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-md dark:shadow-gray-900/30 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
              No clients found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm
                ? "No clients match your search criteria"
                : filterMode === "active"
                ? "You don't have any active clients"
                : filterMode === "archived"
                ? "Your archive is empty"
                : "You don't have any clients yet"}
            </p>
            <PermissionButton
              permission={PERMISSIONS.CREATE}
              resource={RESOURCES.CLIENT}
              onClick={() => navigate("/clients/new")}
              tooltipTitle="Create a new client"
              fallbackTooltip="Upgrade to Planner or Admin role to create clients"
              className="bg-[#F59E0B] hover:bg-[#D97706] dark:bg-amber-600 dark:hover:bg-[#F59E0B] text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Add Your First Client
            </PermissionButton>
          </div>
        )}

        {/* Client Table */}
        {status === "succeeded" && filteredClients.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <ClientsTable
                currentClients={currentClients}
                navigate={navigate}
                handleArchiveToggle={handleArchiveToggle}
              />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <ClientPagination
                paginate={paginate}
                currentPage={currentPage}
                totalPages={totalPages}
                indexOfFirstClient={indexOfFirstClient}
                indexOfLastClient={indexOfLastClient}
                filteredClients={filteredClients}
                ChevronLeft={ChevronLeft}
                ChevronRight={ChevronRight}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
