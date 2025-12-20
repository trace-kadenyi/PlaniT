import { Pencil, Trash2 } from "lucide-react";
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

// edit/delete event btns
export const EditDeleteEventBtns = ({ navigate, eventID, handleDelete }) => {
  return (
    <div className="px-5 pb-3 flex space-x-2 lg:opacity-0 lg:group-hover:opacity-100 transition">
      {/* edit event */}
      <PermissionButton
        permission={PERMISSIONS.EDIT}
        resource={RESOURCES.EVENT}
        tooltipTitle="Edit event"
        fallbackTooltip="Upgrade to Planner or Admin role to edit events"
        onClick={() => navigate(`/events/${eventID}/edit`)}
        className="flex items-center space-x-1 text-sm px-1 py-1 rounded-full bg-[#F59E0B]/10 text-[#BE3455] hover:bg-[#F59E0B]/20 transition text-xs cursor-pointer dark:bg-[#F59E0B]/20 dark:text-[#E879C0] dark:hover:bg-[#F59E0B]/30"
        // title="Edit"
      >
        <Pencil className="w-3 h-3" />
        <span>edit</span>
      </PermissionButton>

      {/* delete event */}
      <PermissionButton
        permission={PERMISSIONS.DELETE}
        resource={RESOURCES.EVENT}
        tooltipTitle="Delete event"
        fallbackTooltip="Upgrade to Planner or Admin role to delete events"
        onClick={() => handleDelete(eventID)}
        className="flex items-center space-x-1 text-sm px-2 py-1 rounded-full bg-red-100/30 text-red-600 hover:bg-red-200 transition text-xs cursor-pointer dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
        // title="Delete"
      >
        <Trash2 className="w-3 h-3" />
        <span>delete</span>
      </PermissionButton>
    </div>
  );
};
