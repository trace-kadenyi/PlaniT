import { useNavigate } from "react-router-dom";
import { NoEventBtn } from "../buttons/EventButtons";

export default function NoEvent() {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-[#F3EDE9] text-center dark:bg-gray-800/80 dark:border-gray-700">
      <div className="mx-auto max-w-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-[#9B2C62] dark:text-[#D97706]">
          No events found
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Get started by creating your first event
        </p>
        <div className="mt-6">
          <NoEventBtn navigate={navigate} />
        </div>
      </div>
    </div>
  );
}

// permission denied to view archived events
export function NoPermissionEvent({ eventsState, navigate }) {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black">
      <div className="backdrop-blur-sm p-8 shadow-lg border border-red-200 max-w-md mx-4 dark:border-red-900 rounded-lg bg-gradient-to-br from-[#FFF8F2] to-[#FFF0E5] shadow-[0_2px_10px_rgba(0,0,0,0.03)]  dark:bg-gradient-to-br dark:from-gray-900 dark:to-black">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900/30">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {eventsState.fetchOneError ||
              "You don't have permission to view this event"}
          </p>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-[#9B2C62] text-white rounded-lg font-medium hover:bg-[#7A1F4D] transition-colors dark:bg-[#D97706] dark:hover:bg-[#B45309]"
          >
            Back to Events
          </button>
        </div>
      </div>
    </div>
  );
}

// Nonexistent event
export function GenNoEvent({ navigate }) {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black">
      <div className="text-center px-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Event Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The event you're looking for doesn't exist or has been deleted.
        </p>
        <button
          onClick={() => navigate("/events")}
          className="px-6 py-3 bg-[#9B2C62] text-white rounded-lg font-medium hover:bg-[#7A1F4D] transition-colors dark:bg-[#D97706] dark:hover:bg-[#B45309]"
        >
          Back to Events
        </button>
      </div>
    </div>
  );
}

// NoFilteredEvents - archived/active
export function NoFilteredEvents({ archiveFilter, totalEvents }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-[#F3EDE9] text-center dark:bg-gray-800/80 dark:border-gray-700">
      <div className="mx-auto max-w-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-[#9B2C62] dark:text-[#D97706]">
          {totalEvents === 0
            ? "No events found"
            : archiveFilter === "archived"
              ? "No archived events found"
              : "No active events found"}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {totalEvents === 0
            ? "Get started by creating your first event"
            : archiveFilter === "archived"
              ? "Archive events to see them here"
              : "Create your first event to get started"}
        </p>
        <div className="mt-6">
          <NoEventBtn navigate={navigate} />
        </div>
      </div>
    </div>
  );
}
