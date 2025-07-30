import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  updateEvent,
  clearUpdateError,
} from "../redux/eventsSlice";
import { fetchEventsForDashboard } from "../redux/eventsSlice";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  mapEventToCard,
  getColumnsFromEvents,
  handleEventDragEnd,
  LoadingDashboard,
  UpdateDashboardError,
  FetchDashboardError,
  getInitialEventColumns,
  filterEvents,
} from "../components/taskManagerCollection/utils/eventsDashboardHelpers";
import { dateFilters } from "../components/taskManagerCollection/utils/handlers/dashboardDateHandlers";
import FilterBox from "../components/taskManagerCollection/events/eventsDashboard/FilterBox";
import EventColumn from "../components/taskManagerCollection/events/eventsDashboard/EventColumn";

export default function EventsBoard() {
  const [columnsInitialized, setColumnsInitialized] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    dateRange: "all",
    search: "",
  });
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });

  const dispatch = useDispatch();

  // Corrected selectors - only use dashboard-related state
  const {
    dashboardItems,
    dashboardStatus,
    dashboardError,
    updateStatus,
    updateError,
  } = useSelector((state) => state.events);

  // Fetch data using the new thunk
  useEffect(() => {
    dispatch(fetchEventsForDashboard());
  }, [dispatch]);

  // Extract unique event types for filter dropdown - now using dashboardItems
  const eventTypes = useMemo(
    () => ["all", ...new Set(dashboardItems.map((event) => event.type))],
    [dashboardItems]
  );

  // Memoize event-to-card mapping
  const mapEventToCardMemoized = useCallback(mapEventToCard, []);

  // Date filtering function
  const filterByDateRange = (event, dateRange, customRange = null) => {
    if (dateRange === "all") return true;

    const eventDate = new Date(event.date);
    const now = new Date();

    switch (dateRange) {
      case "today":
        return (
          eventDate.getDate() === now.getDate() &&
          eventDate.getMonth() === now.getMonth() &&
          eventDate.getFullYear() === now.getFullYear()
        );
      case "week":
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return eventDate >= weekStart && eventDate <= weekEnd;
      case "month":
        return (
          eventDate.getMonth() === now.getMonth() &&
          eventDate.getFullYear() === now.getFullYear()
        );
      case "custom":
        if (!customRange) return true;
        const startDate = new Date(customRange.start);
        const endDate = new Date(customRange.end);
        return eventDate >= startDate && eventDate <= endDate;
      default:
        return true;
    }
  };

  // Filter events based on current filters - uses dashboardItems
  const filteredEvents = useMemo(() => {
    return filterEvents(
      dashboardItems,
      filters,
      filterByDateRange,
      customDateRange
    );
  }, [dashboardItems, filters, customDateRange]);

  // Memoize columns generation
  const getColumnsFromEventsMemoized = useCallback(() => {
    return getColumnsFromEvents(filteredEvents, mapEventToCardMemoized);
  }, [filteredEvents, mapEventToCardMemoized]);

  // Initialize columns with empty state
  const [columns, setColumns] = useState(getInitialEventColumns);

  // Update columns when dashboard data loads or search filter changes
  useEffect(() => {
    if (dashboardStatus === "succeeded") {
      if (!columnsInitialized || filters.search) {
        setColumns(getColumnsFromEventsMemoized());
      }
      if (!columnsInitialized) setColumnsInitialized(true);
    }
  }, [dashboardStatus, filteredEvents, columnsInitialized, filters.search]);



  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#9B2C62] my-2">Events Board</h1>
        <p className="text-gray-600 max-w-4xl mx-auto mb-4">
          Track and manage all your events in one place - drag and drop to
          update status!
        </p>

        <FilterBox
          filters={filters}
          setFilters={setFilters}
          eventTypes={eventTypes}
          dateFilters={dateFilters}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
        />
      </div>

      {/* Error messages */}
      {updateError && (
        <UpdateDashboardError
          updateError={updateError}
          dispatch={dispatch}
          clearError={clearUpdateError}
        />
      )}
      {dashboardError && <FetchDashboardError fetchError={dashboardError} />}

      {/* Main content - now using dashboardStatus */}
      {dashboardStatus === "loading" ? (
        <LoadingDashboard />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <EventColumn columns={columns} />
        </DragDropContext>
      )}
    </div>
  );
}
