import { Plus } from "lucide-react";

import PermissionButton from "../ui/PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";

export const CreateVendorBtn = ({ navigate }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.CREATE}
      resource={RESOURCES.VENDOR}
      onClick={() => navigate("/vendors/new")}
      tooltipTitle="Create a new vendor"
      fallbackTooltip="Upgrade to Planner or Admin role to create vendors"
      className="bg-[#9B2C62] hover:bg-[#801f4f] text-white font-semibold px-5 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
    >
      <Plus className="w-5 h-5" /> New Vendor
    </PermissionButton>
  );
};


