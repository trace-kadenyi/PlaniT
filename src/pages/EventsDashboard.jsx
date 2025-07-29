import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents, updateEventStatus } from "../redux/eventsSlice";
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
import EventColumn from "../components/taskManagerCollection/events/eventsDashboard/Column";

export default function EventsDashboard() {
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
  const {
    items: events,
    status: fetchStatus,
    error: fetchError,
    updateError,
  } = useSelector((state) => state.events);

  // Extract unique event types for filter dropdown
  const eventTypes = ["all", ...new Set(events.map(event => event.type))];

  // Memoize event-to-card mapping
  const mapEventToCardMemoized = useCallback(mapEventToCard, []);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return filterEvents(events, filters, filterByDateRange, customDateRange);
  }, [events, filters, customDateRange]);

  // Memoize columns generation
  const getColumnsFromEventsMemoized = useCallback(() => {
    return getColumnsFromEvents(filteredEvents, mapEventToCardMemoized);
  }, [filteredEvents, mapEventToCardMemoized]);

  // Initialize columns with empty state
  const [columns, setColumns] = useState(getInitialEventColumns);

  // Fetch events on initial render
  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  // Update columns when events load or search filter changes
  useEffect(() => {
    if (fetchStatus === "succeeded") {
      if (!columnsInitialized || filters.search) {
        setColumns(getColumnsFromEventsMemoized());
      }
      if (!columnsInitialized) setColumnsInitialized(true);
    }
  }, [fetchStatus, filteredEvents, columnsInitialized, filters.search]);

  // Recalculate columns when type/date filters change
  useEffect(() => {
    if (columnsInitialized && fetchStatus === "succeeded") {
      setColumns(getColumnsFromEventsMemoized());
    }
  }, [filters.type, filters.dateRange, customDateRange]);

  // Handle drag-and-drop reordering
  const onDragEnd = useCallback(
    (result) => {
      handleEventDragEnd(result, { 
        events, 
        columns, 
        setColumns, 
        dispatch,
        updateStatus: updateEventStatus 
      });
    },
    [events, columns, setColumns, dispatch]
  );

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

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#9B2C62] my-2">Events Dashboard</h1>
        <p className="text-gray-600 max-w-4xl mx-auto mb-4">
          Track and manage all your events in one place - drag and drop to update status!
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
        <div className="p-3 bg-red-50 text-red-600 rounded mb-4 flex justify-between">
          <span>Update failed: {updateError}</span>
          <button
            onClick={() => dispatch(clearUpdateError())}
            className="text-[#9B2C62] font-medium"
          >
            Retry
          </button>
        </div>
      )}
      {fetchError && (
        <div className="p-3 bg-red-50 text-red-600 rounded mb-4">
          Failed to load events: {fetchError}
        </div>
      )}

      {/* Main content */}
      {fetchStatus === "loading" ? (
        <div className="flex space-x-4 animate-pulse justify-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 w-80 h-64"></div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <EventColumn columns={columns} />
        </DragDropContext>
      )}
    </div>
  );
}

