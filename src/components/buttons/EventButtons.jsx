import PermissionButton from "./PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";

// create event btn
export const CreateEventBtn = ({ navigate }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.CREATE}
      resource={RESOURCES.EVENT}
      tooltipTitle="Create a new event"
      fallbackTooltip="Upgrade to Planner or Admin role to create events"
      onClick={() => navigate("/events/new")}
      className="flex items-center gap-2 bg-[#9B2C62] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#801f4f] transition-all transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
    >
      <span className="text-lg">+</span> Create New Event
    </PermissionButton>
  );
};

// no event/create event btn
export const NoEventBtn = ({ navigate }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.CREATE}
      resource={RESOURCES.EVENT}
      tooltipTitle="Create a new event"
      fallbackTooltip="Upgrade to Planner or Admin role to create events"
      onClick={() => navigate("/events/new")}
      className="inline-flex items-center px-4 py-2 bg-[#9B2C62] text-white rounded-lg shadow hover:bg-[#801f4f] transition"
    >
      + New Event
    </PermissionButton>
  );
};
