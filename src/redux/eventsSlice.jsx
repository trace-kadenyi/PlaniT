import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../app/api";

// --- Async Thunks ---

// fetch all events
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/events");
      return response.data;
    } catch (err) {
      const errorData = err.response?.data;
      if (err.response?.status === 429) {
        return rejectWithValue(
          errorData?.message ||
            "Too many requests. Please wait 15 minutes before trying again.",
        );
      }
      return rejectWithValue(errorData?.message || err.message);
    }
  },
);

// fetch event by id
export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId, { rejectWithValue }) => {
    // Add rejectWithValue
    try {
      const res = await api.get(`/api/events/${eventId}`);
      return res.data;
    } catch (err) {
      const errorData = err.response?.data;
      if (err.response?.status === 429) {
        return rejectWithValue(
          errorData?.message ||
            "Too many requests. Please wait 15 minutes before trying again.",
        );
      }
      return rejectWithValue(errorData?.message || err.message);
    }
  },
);

// create event
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (newEvent, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/events", newEvent);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data); // capture the backend's error message
    }
  },
);

// update event
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, updatedEvent }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/events/${eventId}`, updatedEvent);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data); // ← return proper backend error
    }
  },
);

// archive event
export const archiveEvent = createAsyncThunk(
  "events/archiveEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/events/${eventId}/archive`);
      return res.data.event; // ← Return the event object, not the full response
    } catch (err) {
      const errorData = err.response?.data;
      return rejectWithValue(errorData?.message || err.message);
    }
  },
);

// restore event
export const restoreEvent = createAsyncThunk(
  "events/restoreEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/events/${eventId}/restore`);
      return res.data.event; // ← Return the event object, not the full response
    } catch (err) {
      const errorData = err.response?.data;
      return rejectWithValue(errorData?.message || err.message);
    }
  },
);

// delete event
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    // Add rejectWithValue
    try {
      await api.delete(`/api/events/${eventId}`);
      return eventId;
    } catch (err) {
      const errorData = err.response?.data;
      if (err.response?.status === 429) {
        return rejectWithValue(
          errorData?.message ||
            "Too many requests. Please wait 15 minutes before trying again.",
        );
      }
      return rejectWithValue(errorData?.message || err.message);
    }
  },
);

// budget updates
export const updateBudget = createAsyncThunk(
  "events/updateBudget",
  async ({ eventId, updatedBudget }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/budget/${eventId}`, updatedBudget);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// fetch events with budget for dashboard
export const fetchEventsForDashboard = createAsyncThunk(
  "events/fetchEventsForDashboard",
  async (_, { rejectWithValue }) => {
    // Add rejectWithValue
    try {
      const [eventsRes, budgetStatusRes] = await Promise.all([
        api.get("/api/events"),
        api.get("/api/expenses/budget-status"),
      ]);

      const budgetMap = {};
      budgetStatusRes.data.forEach((item) => {
        budgetMap[item.eventId] = item.budgetStatus;
      });

      return eventsRes.data.map((event) => ({
        ...event,
        budgetStatus: budgetMap[event._id] || {
          totalBudget: 0,
          totalExpenses: 0,
          remainingBudget: 0,
        },
      }));
    } catch (err) {
      const errorData = err.response?.data;
      if (err.response?.status === 429) {
        return rejectWithValue(
          errorData?.message ||
            "Too many requests. Please wait 15 minutes before trying again.",
        );
      }
      return rejectWithValue(errorData?.message || err.message);
    }
  },
);

// --- Slice ---

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    items: [],
    selectedEventId: null,

    status: "idle",
    error: null,

    createStatus: "idle",
    createError: null,

    updateStatus: "idle",
    updateError: null,

    deleteStatus: "idle",
    deleteError: null,

    fetchOneStatus: "idle",
    fetchOneError: null,

    selectedEvent: null,

    updateBudgetStatus: "idle",
    updateBudgetError: null,

    dashboardItems: [],
    dashboardStatus: "idle",
    dashboardError: null,

    archiveStatus: "idle",
    archiveError: null,

    restoreStatus: "idle",
    restoreError: null,

    archivingEvents: {},
    restoringEvents: {},
  },

  reducers: {
    setSelectedEventId: (state, action) => {
      state.selectedEventId = action.payload;
    },
    clearEventStatuses: (state) => {
      state.createStatus = "idle";
      state.createError = null;
      state.updateStatus = "idle";
      state.updateError = null;
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
    resetCreateState: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
    resetUpdateState: (state) => {
      state.updateStatus = "idle";
      state.updateError = null;
    },
    clearSelectedEvent: (state) => {
      state.fetchOneStatus = "idle";
      state.fetchOneError = null;
      state.selectedEvent = null;
      state.selectedEventId = null;
    },
    resetArchiveState: (state) => {
      state.archiveStatus = "idle";
      state.archiveError = null;
    },
    resetRestoreState: (state) => {
      state.restoreStatus = "idle";
      state.restoreError = null;
    },

    resetDeleteState: (state) => {
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
    resetBudgetUpdateState: (state) => {
      state.updateBudgetStatus = "idle";
      state.updateBudgetError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
      state.updateStatus = "idle";
    },
    resetDashboard: (state) => {
      state.dashboardItems = [];
      state.dashboardStatus = "idle";
    },
    updateDashboardItemStatus: (state, action) => {
      const updatedEvent = action.payload;
      const index = state.dashboardItems.findIndex(
        (e) => e._id === updatedEvent._id,
      );
      if (index !== -1) {
        state.dashboardItems[index].status = updatedEvent.status;
      }
    },
  },

  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // Fetch one
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.fetchOneStatus = "loading";
        state.fetchOneError = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.fetchOneStatus = "succeeded";
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.fetchOneStatus = "failed";
        state.fetchOneError = action.payload || action.error.message;
      });

    // Create
    builder
      .addCase(createEvent.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        const newEvent = {
          ...action.payload.event, // event data
          budget: {
            _id: action.payload.budgetId,
            totalBudget: action.payload.event.initialBudget || 0,
            notes: action.payload.event.budgetNotes || "",
          },
        };
        state.items.unshift(newEvent);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          action.payload?.message ||
          action.error.message ||
          "Failed to create event.";
      });

    // Update event
    builder
      .addCase(updateEvent.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.items.findIndex(
          (e) => e._id === action.payload._id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedEventId === action.payload._id) {
          state.selectedEvent = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          action.payload?.message ||
          action.error.message ||
          "Failed to update event.";
      });

    // archiveEvent cases:
    builder
      .addCase(archiveEvent.pending, (state, action) => {
        state.archiveStatus = "loading";
        state.archiveError = null;
        const eventId = action.meta.arg;
        state.archivingEvents[eventId] = true;
      })
      .addCase(archiveEvent.fulfilled, (state, action) => {
        state.archiveStatus = "succeeded";
        const eventId = action.payload._id;
        delete state.archivingEvents[eventId];

        // Update the event in items array
        const index = state.items.findIndex((e) => e._id === eventId);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], isArchived: true };
        }

        // Update selectedEvent if it's the current one
        if (state.selectedEventId === eventId) {
          state.selectedEvent = { ...state.selectedEvent, isArchived: true };
        }
      })
      .addCase(archiveEvent.rejected, (state, action) => {
        state.archiveStatus = "failed";
        state.archiveError = action.payload || action.error.message;
        const eventId = action.meta.arg;
        delete state.archivingEvents[eventId];
      });

    // restoreEvent cases:
    builder
      .addCase(restoreEvent.pending, (state, action) => {
        state.restoreStatus = "loading";
        state.restoreError = null;
        const eventId = action.meta.arg;
        state.restoringEvents[eventId] = true;
      })
      .addCase(restoreEvent.fulfilled, (state, action) => {
        state.restoreStatus = "succeeded";
        const eventId = action.payload._id;
        delete state.restoringEvents[eventId];

        // Update the event in items array
        const index = state.items.findIndex((e) => e._id === eventId);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], isArchived: false };
        }

        // Update selectedEvent if it's the current one
        if (state.selectedEventId === eventId) {
          state.selectedEvent = { ...state.selectedEvent, isArchived: false };
        }
      })
      .addCase(restoreEvent.rejected, (state, action) => {
        state.restoreStatus = "failed";
        state.restoreError = action.payload || action.error.message;
        const eventId = action.meta.arg;
        delete state.restoringEvents[eventId];
      });
    // Delete
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter(
          (event) => event._id !== action.payload,
        );
        if (state.selectedEventId === action.payload) {
          state.selectedEventId = null;
          state.selectedEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || action.error.message;
      });

    // update budget
    builder
      .addCase(updateBudget.pending, (state) => {
        state.updateBudgetStatus = "loading";
        state.updateBudgetError = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.updateBudgetStatus = "succeeded";
        const { eventId } = action.meta.arg;

        // Update in items array
        const eventIndex = state.items.findIndex((e) => e._id === eventId);
        if (eventIndex !== -1) {
          state.items[eventIndex].budget = {
            ...state.items[eventIndex].budget,
            ...action.payload,
          };
        }

        // Update in selectedEvent
        if (state.selectedEventId === eventId && state.selectedEvent) {
          state.selectedEvent.budget = {
            ...state.selectedEvent.budget,
            ...action.payload,
          };
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.updateBudgetStatus = "failed";
        state.updateBudgetError =
          action.payload?.message ||
          action.error.message ||
          "Failed to update budget";
      });

    // fetch events for dashboard
    builder
      .addCase(fetchEventsForDashboard.pending, (state) => {
        state.dashboardStatus = "loading";
        state.dashboardError = null;
      })
      .addCase(fetchEventsForDashboard.fulfilled, (state, action) => {
        state.dashboardStatus = "succeeded";
        state.dashboardItems = action.payload;
      })
      .addCase(fetchEventsForDashboard.rejected, (state, action) => {
        state.dashboardStatus = "failed";
        state.dashboardError = action.payload || action.error.message;
      });
  },
});

export const {
  setSelectedEventId,
  clearEventStatuses,
  resetCreateState,
  resetUpdateState,
  clearSelectedEvent,
  resetDeleteState,
  resetBudgetUpdateState,
  clearUpdateError,
  resetDashboard,
  updateDashboardItemStatus,
} = eventsSlice.actions;
export default eventsSlice.reducer;
