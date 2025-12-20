import PermissionButton from "../ui/PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";

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
