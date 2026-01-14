import {
  Plus,
  Archive,
  RefreshCcw,
  Trash2,
  Edit3,
  PlusIcon,
} from "lucide-react";

import PermissionButton from "./PermissionButton";
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
      fallbackTooltip={`${
        client.isArchived
          ? "Upgrade to Planner or Admin role to restore clients"
          : "Upgrade to Planner or Admin role to archive clients"
      }`}
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
      fallbackTooltip={`${
        client.isArchived
          ? "Upgrade to Planner or Admin role to restore clients"
          : "Upgrade to Planner or Admin role to archive clients"
      }`}
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

// delete client btn
export const DeleteClientBtn = ({ handleDelete, id, client }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.DELETE}
      resource={RESOURCES.CLIENT}
      tooltipTitle="Delete client"
      fallbackTooltip="Upgrade to Planner or Admin role to delete clients"
      onClick={() => handleDelete(id)}
      disabled={client?.isDeleting}
      className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 dark:bg-red-900/60 dark:hover:bg-red-900/50 dark:text-white justify-center border border-red-200 dark:border-red-700/50"
    >
      {client?.isDeleting ? (
        <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4 mr-2" />
      )}
      {client?.isDeleting ? "Deleting..." : "Delete"}
    </PermissionButton>
  );
};

// edit client
export const EditClientLink = ({ id }) => {
  return (
    <PermissionButton
      to={`/clients/${id}/edit`}
      permission={PERMISSIONS.EDIT}
      resource={RESOURCES.CLIENT}
      tooltipTitle="Edit client"
      fallbackTooltip="Upgrade to Planner or Admin role to edit clients"
      className="flex items-center bg-[#F59E0B] hover:bg-[#D97706] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
    >
      <Edit3 className="w-4 h-4 mr-2" />
      Edit
    </PermissionButton>
  );
};

// add new event
export const AddNewClientEventLink = ({ client }) => {
  return (
    <PermissionButton
      to={`/events/new?client=${client._id}`}
      permission={PERMISSIONS.CREATE}
      resource={RESOURCES.EVENT}
      tooltipTitle="Add event"
      fallbackTooltip="Upgrade to Planner or Admin role to add events"
      className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-4 py-2 rounded-lg dark:bg-[#D97706] hover:dark:bg-[#F59E0B]"
    >
      + Add New Event
    </PermissionButton>
  );
};

// schedule event link
export const ScheduleEventLink = ({ client }) => {
  return (
    <PermissionButton
      to={`/events/new?client=${client._id}`}
      permission={PERMISSIONS.CREATE}
      resource={RESOURCES.EVENT}
      tooltipTitle="Schedule event"
      fallbackTooltip="Upgrade to Planner or Admin role to schedule events"
      className="inline-flex items-center bg-[#9B2C62] hover:bg-[#7B1D52] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
      Schedule Event
    </PermissionButton>
  );
};

// save client form btn
export const SaveClientFormBtn = ({ formStatus, onCancel }) => {
  return (
    <div className="flex gap-4">
      <PermissionButton
        permission={PERMISSIONS.CREATE}
        resource={RESOURCES.CLIENT}
        tooltipTitle="Add a new client"
        fallbackTooltip="Upgrade to Planner or Admin role to add clients"
        type="submit"
        disabled={formStatus === "loading"}
        className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-6 py-2 rounded-lg dark:bg-[#D97706] dark:hover:bg-[#F59E0B]"
      >
        {formStatus === "loading" ? "Saving..." : "Save Client"}
      </PermissionButton>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={formStatus === "loading"}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      )}
    </div>
  );
};
