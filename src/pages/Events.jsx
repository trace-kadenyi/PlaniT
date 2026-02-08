import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronDown, ChevronRight } from "lucide-react";

import {
  fetchEvents,
  deleteEvent,
  restoreEvent,
  archiveEvent,
} from "../redux/eventsSlice";

import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";
import { LoadingPage } from "../components/shared/LoadingStates";
import EventCard from "../components/taskManagerCollection/events/EventCard";
import { NoFilteredEvents } from "../components/shared/NoEvent";
import { CreateEventBtn } from "../components/buttons/EventButtons";
import { createLockedDeleteHandler } from "../components/taskManagerCollection/utils/handlers/eventHandlers";
import EventsFilter from "../components/taskManagerCollection/events/EventsFilter";
import {
  usePermissions,
  PERMISSIONS,
  RESOURCES,
} from "../globalHooks/userPermissions";
import { useEventFilters } from "../components/taskManagerCollection/hooks/useEventFilters";

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deleteToastRef = useRef(null);
  const { can } = usePermissions();

  const [expandedMonths, setExpandedMonths] = useState({});
  const [archiveFilter, setArchiveFilter] = useState("active");

  const {
    items: events,
    status,
    error,
    archivingEvents,
    restoringEvents,
  } = useSelector((state) => state.events);

  // Check if user can view archived events
  const canViewArchivedEvents = can(PERMISSIONS.ARCHIVE, RESOURCES.EVENT);

  // fetch events
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Get filtered events and counts using the hook
  const { filteredEvents, activeCount, archivedCount } = useEventFilters(
    events,
    archiveFilter,
    canViewArchivedEvents,
  );

  // Sort events by date in ascending order (earliest first)
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  // handle delete event
  const handleDelete = useMemo(
    () =>
      createLockedDeleteHandler(
        dispatch,
        deleteEvent,
        toast,
        toastWithProgress,
        DeleteConfirmationToast,
        deleteToastRef,
      ),
    [dispatch],
  );

  // handle archive toggle
  const handleArchiveToggle = (eventId, isArchived) => {
    const action = isArchived ? restoreEvent : archiveEvent;
    dispatch(action(eventId));
  };

  // Group events by month
  const eventsByMonth = sortedEvents.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const monthYear = eventDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }

    acc[monthYear].push(event);
    return acc;
  }, {});

  // Initialize expanded months - open first month by default
  useEffect(() => {
    if (sortedEvents.length > 0 && Object.keys(expandedMonths).length === 0) {
      const firstMonth = Object.keys(eventsByMonth)[0];
      setExpandedMonths({ [firstMonth]: true });
    }
  }, [sortedEvents, eventsByMonth]);

  const toggleMonth = (monthYear) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthYear]: !prev[monthYear],
    }));
  };

  const currentMonthYear = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-3 sm:p-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Decorative Elements */}
        <div className="relative mb-10">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F59E0B]/10 rounded-full blur-lg dark:bg-[#F59E0B]/20"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#9B2C62]/10 rounded-full blur-lg dark:bg-[#9B2C62]/20"></div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62] dark:text-[#D97706] text-start mt-4 sm:mt-0">
                Events Manager
                <span className="text-xs whitespace-nowrap">
                  (
                  {archiveFilter === "all"
                    ? events.length
                    : archiveFilter === "active"
                      ? activeCount
                      : archivedCount}
                  {archiveFilter === "active"
                    ? " active"
                    : archiveFilter === "archived"
                      ? " archived"
                      : ""}{" "}
                  events)
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-lg">
                Organize and track all your upcoming events in one place
              </p>
            </div>
            <CreateEventBtn navigate={navigate} />
          </div>
        </div>

        {/* Archive Filter - Only show if user can view archived events */}
        {canViewArchivedEvents && (
          <EventsFilter
            setArchiveFilter={setArchiveFilter}
            archiveFilter={archiveFilter}
            events={events}
            activeCount={activeCount}
            archivedCount={archivedCount}
          />
        )}

        {/* Status Messages */}
        {status === "loading" && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-[#F3EDE9] dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
            <LoadingPage message="Loading events..." />
          </div>
        )}

        {status === "failed" && (
          <div className="bg-red-50/80 backdrop-blur-sm p-6 rounded-xl border border-red-100 shadow-sm dark:bg-red-800/30 dark:border-red-900/50">
            <p className="text-red-600 font-medium">Error loading events:</p>
            <p className="text-red-500 mt-1">
              {" "}
              {error?.message ||
                error ||
                "Too many requests, please try again later."}
            </p>
          </div>
        )}

        {status === "succeeded" && sortedEvents.length === 0 && (
          <NoFilteredEvents
            archiveFilter={archiveFilter}
            totalEvents={events.length}
          />
        )}
        {/* Events List */}
        {status === "succeeded" && sortedEvents.length > 0 && (
          <div className="space-y-6">
            {Object.entries(eventsByMonth).map(([monthYear, monthEvents]) => (
              <section
                key={monthYear}
                className="bg-gradient-to-br from-[#FFF8F2]/30 to-white/70 rounded-xl shadow-sm border border-[#F3EDE9]/50 overflow-hidden dark:bg-gradient-to-br dark:from-gray-800/70 dark:to-gray-900/70 dark:border-gray-700/50"
              >
                {/* Month Header */}
                <button
                  onClick={() => toggleMonth(monthYear)}
                  className={`flex items-center w-full p-4 hover:bg-[#FFF8F2] transition border-l-4 dark:hover:bg-gray-700/50 ${
                    expandedMonths[monthYear]
                      ? "border-l-[#F59E0B] bg-gradient-to-br from-[#FFF8F2] to-[#FFF0E5] dark:border-l-[#F59E0B] dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700"
                      : "border-l-[#9B2C62]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {expandedMonths[monthYear] ? (
                      <ChevronDown className="w-5 h-5 text-[#9B2C62]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#9B2C62]" />
                    )}
                    <h2
                      className={`text-xs font-semibold ${
                        monthYear === currentMonthYear
                          ? "text-[#F59E0B]"
                          : "text-[#9B2C62] dark:text-[#D97706]"
                      }`}
                    >
                      {monthYear}
                    </h2>
                  </div>
                  <span className="ml-auto bg-gray-100 text-[#9B2C62] px-2.5 py-0.5 rounded-full text-xs font-semibold dark:font-normal dark:bg-gray-800 dark:text-[#F59E0B]">
                    {monthEvents.length} event
                    {monthEvents.length !== 1 ? "s" : ""}
                  </span>
                </button>

                {/* Events Grid */}
                {expandedMonths[monthYear] && (
                  <div className="p-4 pt-2">
                    <ul className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
                      {monthEvents.map((event, index) => (
                        <EventCard
                          key={index}
                          event={event}
                          navigate={navigate}
                          handleDelete={handleDelete}
                          isArchiving={archivingEvents[event._id] || false}
                          isRestoring={restoringEvents[event._id] || false}
                          handleArchiveToggle={handleArchiveToggle}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
