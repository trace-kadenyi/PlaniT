import { Plus } from "lucide-react";

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
