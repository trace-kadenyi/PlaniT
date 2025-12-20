import { Plus, Archive, RefreshCcw } from "lucide-react";

import PermissionButton from "../ui/PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";

// create new client
export const CreateClientBtn = ({ navigate }) => {
  return (
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
  );
};

// add first client btn
export const AddFirstClientBtn = ({ navigate }) => {
  return (
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
  );
};

// delete all clients btn
export const DeleteAllClientsBtn = ({ handleDeleteAll, deleteAllStatus }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.DELETE_ALL}
      resource={RESOURCES.CLIENT}
      onClick={handleDeleteAll}
      loading={deleteAllStatus === "loading"}
      disabled={deleteAllStatus === "loading"}
      tooltipTitle="Delete all clients"
      fallbackTooltip="Admin role required to delete all clients"
      className={`bg-[#9B2C62] hover:bg-[#801f4f] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap ${
        deleteAllStatus === "loading" ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {deleteAllStatus === "loading" ? "Deleting..." : "Delete All Clients"}
    </PermissionButton>
  );
};

// archive client btn on table
export const ArchiveTableClientBtn = ({ handleArchiveToggle, client }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.ARCHIVE}
      resource={RESOURCES.CLIENT}
      tooltipTitle="Archive client"
      fallbackTooltip="Upgrade to Planner or Admin role to archive clients"
      onClick={() => handleArchiveToggle(client._id, client.isArchived)}
      disabled={client.isArchiving || client.isRestoring}
      className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
        client.isArchived
          ? "bg-[#FFBF00] hover:bg-[#E6AC00] text-[#571838]"
          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      } ${
        client.isArchiving || client.isRestoring
          ? "opacity-70 cursor-not-allowed"
          : ""
      }`}
    >
      {client.isArchiving ? (
        <>
          <RefreshCcw className="animate-spin w-4 h-4" /> Archiving...
        </>
      ) : client.isRestoring ? (
        <>
          <RefreshCcw className="animate-spin w-4 h-4" /> Restoring...
        </>
      ) : client.isArchived ? (
        <>
          <RefreshCcw className="w-4 h-4" /> Restore
        </>
      ) : (
        <>
          <Archive className="w-4 h-4" /> Archive
        </>
      )}
    </PermissionButton>
  );
};

// archive client btn on client page
export const ArchiveClientBtn = ({
  handleArchiveToggle,
  id,
  localIsArchived,
  client,
}) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.ARCHIVE}
      resource={RESOURCES.CLIENT}
      tooltipTitle="Archive client"
      fallbackTooltip="Upgrade to Planner or Admin role to archive clients"
      onClick={() => handleArchiveToggle(id, localIsArchived)}
      disabled={client?.isArchiving || client?.isRestoring}
      className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex-1 sm:flex-none justify-center ${
        localIsArchived
          ? "bg-[#FFBF00] hover:bg-[#E6AC00] text-[#571838] dark:bg-[#E6AC00]/90 dark:text-black dark:hover:bg-[#FFBF00]/60"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
      }`}
    >
      {client?.isArchiving ? (
        <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
      ) : client?.isRestoring ? (
        <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
      ) : localIsArchived ? (
        <RefreshCcw className="w-4 h-4 mr-2" />
      ) : (
        <Archive className="w-4 h-4 mr-2" />
      )}
      {client?.isArchiving
        ? "Archiving..."
        : client?.isRestoring
        ? "Restoring..."
        : localIsArchived
        ? "Restore"
        : "Archive"}
    </PermissionButton>
  );
};
