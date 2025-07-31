import { dateFilters } from "../utils/handlers/dashboardDateHandlers";

export const eventsFilterConfig = {
  searchPlaceholder: "Search events by name, type or location...",
  dateLabel: "Event Date",
  dateFilters: dateFilters,
  defaultFilters: {
    type: "all",
    dateRange: "all",
    search: "",
  },
  filters: [
    {
      id: "type",
      label: "Event Type",
      options: (data) => [
        ...data.eventTypes.map((type) => ({
          value: type,
          label: type.charAt(0).toUpperCase() + type.slice(1),
        })),
      ],
    },
  ],
};
