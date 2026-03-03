import {
  Pencil,
  Trash2,
  Plus,
  Archive,
  RotateCcw,
  RefreshCcw,
} from "lucide-react";

import PermissionButton from "./PermissionButton";
import { PERMISSIONS, RESOURCES } from "../../globalHooks/userPermissions";
import PermissionLink from "./PermissionLink";

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
export const EditArchiveDeleteEventBtns = ({
  navigate,
  eventID,
  eventName,
  isArchived,
  handleDelete,
  isArchiving,
  isRestoring,
  handleArchiveToggle,
}) => {
  return (
    <div className="px-5 pb-3 flex flex-wrap gap-2 space-x-2 lg:opacity-0 lg:group-hover:opacity-100 transition">
      {/* edit event */}
      {!isArchived && (
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
      )}

      {/* archive / restore */}
      <PermissionButton
        permission={PERMISSIONS.ARCHIVE}
        resource={RESOURCES.EVENT}
        tooltipTitle={`${isArchived ? "Restore event" : "Archive event"}`}
        fallbackTooltip={`${
          isArchived
            ? "Upgrade to Planner or Admin role to restore events"
            : "Upgrade to Planner or Admin role to archive events"
        }`}
        onClick={() => handleArchiveToggle(eventID, isArchived)}
        disabled={isArchiving || isRestoring}
        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition ${
          isArchived
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
            : "bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 dark:bg-[#D97706]/20 dark:text-[#D97706] dark:hover:bg-[#D97706]/30"
        } ${isArchiving || isRestoring ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isArchiving ? (
          <>
            <RefreshCcw className="animate-spin w-3 h-3" />
            <span>Archiving...</span>
          </>
        ) : isRestoring ? (
          <>
            <RefreshCcw className="animate-spin w-3 h-3" />
            <span>Restoring...</span>
          </>
        ) : isArchived ? (
          <>
            <RotateCcw className="w-3 h-3" />
            <span>restore</span>
          </>
        ) : (
          <>
            <Archive className="w-3 h-3" />
            <span>archive</span>
          </>
        )}
      </PermissionButton>

      {/* delete event */}
      <PermissionButton
        permission={PERMISSIONS.DELETE}
        resource={RESOURCES.EVENT}
        tooltipTitle="Delete event"
        fallbackTooltip="Upgrade to Admin role to delete events"
        onClick={() =>
          handleDelete(eventID, {
            type: "event",
            entityName: eventName, // optional
            onSuccess: () => navigate("/events"),
          })
        }
        className="flex items-center space-x-1 text-sm px-2 py-1 rounded-full bg-red-100/80 text-red-600 hover:bg-red-200 transition text-xs cursor-pointer dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
        // title="Delete"
      >
        <Trash2 className="w-3 h-3" />
        <span>delete</span>
      </PermissionButton>
    </div>
  );
};

// event details btn
export const EventDetailsBtns = ({
  navigate,
  eventID,
  eventName,
  handleDelete,
  isArchived,
  isArchiving,
  isRestoring,
  handleArchiveToggle,
}) => {
  return (
    <div className="absolute top-5 right-4 flex space-x-2">
      {/* edit event */}
      {!isArchived && (
        <PermissionButton
          permission={PERMISSIONS.EDIT}
          resource={RESOURCES.EVENT}
          tooltipTitle="Edit event"
          fallbackTooltip="Upgrade to Planner or Admin role to edit events"
          onClick={() => navigate(`/events/${eventID}/edit`)}
          className="flex items-center space-x-1 text-sm px-2 py-1 rounded-full bg-[#F59E0B]/10 text-[#BE3455] hover:bg-[#F59E0B]/20 transition text-xs cursor-pointer dark:bg-[#F59E0B]/30 dark:text-gray-300 dark:hover:bg-[#F59E0B]/40"
        >
          <Pencil className="w-3 h-3" />
          <span>Edit</span>
        </PermissionButton>
      )}

      {/* archive / restore button */}
      <PermissionButton
        permission={PERMISSIONS.ARCHIVE}
        resource={RESOURCES.EVENT}
        tooltipTitle={`${isArchived ? "Restore event" : "Archive event"}`}
        fallbackTooltip={`${
          isArchived
            ? "Upgrade to Planner or Admin role to restore events"
            : "Upgrade to Planner or Admin role to archive events"
        }`}
        onClick={() => handleArchiveToggle(eventID, isArchived)}
        disabled={isArchiving || isRestoring}
        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition ${
          isArchived
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
            : "bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 dark:bg-[#D97706]/20 dark:text-[#D97706] dark:hover:bg-[#D97706]/30"
        } ${isArchiving || isRestoring ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isArchiving ? (
          <>
            <RefreshCcw className="animate-spin w-3 h-3" />
            <span>Archiving...</span>
          </>
        ) : isRestoring ? (
          <>
            <RefreshCcw className="animate-spin w-3 h-3" />
            <span>Restoring...</span>
          </>
        ) : isArchived ? (
          <>
            <RotateCcw className="w-3 h-3" />
            <span>Restore</span>
          </>
        ) : (
          <>
            <Archive className="w-3 h-3" />
            <span>Archive</span>
          </>
        )}
      </PermissionButton>

      {/* delete event */}
      <PermissionButton
        permission={PERMISSIONS.DELETE}
        resource={RESOURCES.EVENT}
        tooltipTitle="Delete event"
        fallbackTooltip="Upgrade to Admin role to delete events"
        onClick={() =>
          handleDelete(eventID, {
            type: "event",
            entityName: eventName, // optional
            onSuccess: () => navigate("/events"),
          })
        }
        className="flex items-center space-x-1 text-sm px-2 py-1 rounded-full bg-red-100/30 text-red-600 hover:bg-red-200 transition text-xs cursor-pointer dark:bg-red-600/30 dark:text-white dark:hover:bg-red-600/70"
      >
        <Trash2 className="w-3 h-3" />
        <span>Delete</span>
      </PermissionButton>
    </div>
  );
};

// add event form btn
export const AddEventFormBtn = ({ formStatus, shouldDisable, mode, Lock }) => {
  return (
    <PermissionButton
      permission={PERMISSIONS.CREATE}
      resource={RESOURCES.EVENT}
      tooltipTitle={`${formStatus === "loading" ? "Saving..." : "Save event"}`}
      fallbackTooltip="Upgrade to Planner or Admin role to create events"
      type="submit"
      disabled={formStatus === "loading" || shouldDisable}
      className={`bg-[#F59E0B] dark:bg-[#d97706] text-white font-semibold px-6 py-2 rounded-lg transition-all dark:hover:bg-[#F59E0B] ${
        shouldDisable ? "bg-gray-300 cursor-not-allowed" : "hover:bg-[#d97706]"
      } ${formStatus === "loading" ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {shouldDisable ? (
        <span className="flex items-center justify-center gap-1">
          <Lock className="w-4 h-4" />
          Form Disabled
        </span>
      ) : formStatus === "loading" ? (
        "Saving..."
      ) : mode === "create" ? (
        "Add Event"
      ) : (
        "Save Changes"
      )}
    </PermissionButton>
  );
};

// sidebar create event link
export const SidebarCreateEventLink = ({ collapsed }) => {
  return (
    <PermissionLink
      to="/events/new"
      permission={PERMISSIONS.CREATE}
      resource={RESOURCES.EVENT}
      tooltipTitle="Create a new event"
      fallbackTooltip="Upgrade to Planner or Admin role to create events"
      className={`
                  flex items-center p-3 rounded-lg transition-colors 
                  bg-[#FF9933] dark:bg-[#E07C24] text-white
                  hover:bg-[#E07C24] dark:hover:bg-[#FF9933] ${
                    collapsed ? "justify-center" : "gap-3 justify-center"
                  }
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB866]
                `}
      title={collapsed ? "Create Event" : undefined}
    >
      <Plus size={20} aria-hidden="true" />
      {!collapsed && <span>Create Event</span>}
    </PermissionLink>
  );
};
