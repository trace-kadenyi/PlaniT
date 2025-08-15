import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from "@hello-pangea/dnd";

import {
  updateEvent,
  clearUpdateError,
  resetDashboard,
} from "../redux/eventsSlice";
import { fetchEventsForDashboard } from "../redux/eventsSlice";

import {
  mapEventToCard,
  getColumnsFromEvents,
  handleEventDragEnd,
  getInitialEventColumns,
  filterEvents,
} from "../components/taskManagerCollection/events/eventsDashboard/eventsDashboardHelpers";
import {
  LoadingDashboard,
  FetchDashboardError,
  UpdateDashboardError,
} from "../components/taskManagerCollection/utils/genDashboardHelpers";
import { filterByDateRange } from "../components/taskManagerCollection/utils/handlers/dashboardDateHandlers";
import FilterBox from "../components/shared/FilterBox";
import EventColumn from "../components/taskManagerCollection/events/eventsDashboard/EventColumn";
import { eventsFilterConfig } from "../components/taskManagerCollection/config/eventsFilterConfig";

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
  const { dashboardItems, dashboardStatus, dashboardError, updateError } =
    useSelector((state) => state.events);

  // 1. Reset and fetch when component mounts
  useEffect(() => {
    dispatch(resetDashboard()); // Clear existing data
    dispatch(fetchEventsForDashboard()); // Fetch fresh data
  }, [dispatch]);

  // 2. Add cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetDashboard()); // Cleanup when leaving
    };
  }, [dispatch]);

  // Extract unique event types for filter dropdown - now using dashboardItems
  const eventTypes = useMemo(
    () => ["all", ...new Set(dashboardItems.map((event) => event.type))],
    [dashboardItems]
  );

  // Memoize event-to-card mapping
  const mapEventToCardMemoized = useCallback(mapEventToCard, []);

  // Filter events based on current filters - uses dashboardItems
  const filteredEvents = useMemo(() => {
    return filterEvents(
      dashboardItems,
      filters,
      (event, range, custom) =>
        filterByDateRange(
          event,
          range,
          custom,
          (e) => e.date,
          (t) => e.status
        ),
      filters.dateRange === "custom" ? customDateRange : null
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

  // Recalculate columns when type/date filters change
  useEffect(() => {
    if (columnsInitialized && dashboardStatus === "succeeded") {
      setColumns(getColumnsFromEventsMemoized());
    }
  }, [filters.type, filters.dateRange, customDateRange]);

  // Handle drag-and-drop reordering
  const onDragEnd = useCallback(
    (result) => {
      handleEventDragEnd(result, {
        events: dashboardItems,
        columns,
        setColumns,
        dispatch,
        updateEvent,
      });
    },
    [dashboardItems, columns, setColumns, dispatch]
  );

  return (
    <div className="p-4 sm:px-10 sm:pt-10 pb-15 bg-white min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#9B2C62] mt-10 mb-2 sm:my-2">
          Events Board
        </h1>
        <p className="text-gray-600 max-w-4xl mx-auto mb-4">
          Track and manage all your events in one place - drag and drop to
          update status!
        </p>

        {/* filter box */}
        <FilterBox
          filters={filters}
          setFilters={setFilters}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
          filterConfig={{
            ...eventsFilterConfig,
            dynamicData: { eventTypes: eventTypes },
          }}
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
      {dashboardError && (
        <FetchDashboardError
          message={"Failed to load events"}
          fetchError={dashboardError}
        />
      )}

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
