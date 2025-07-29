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

 
 
 


  return (
    
  );
}

