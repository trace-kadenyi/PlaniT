import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app/api";

// --- Async Thunks ---

// fetch all events
export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const res = await api.get("/api/events");
  return res.data;
});

// fetch event by id
export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId) => {
    const res = await api.get(`/api/events/${eventId}`);
    return res.data;
  }
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
  }
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
  }
);

// delete event
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId) => {
    await api.delete(`/api/events/${eventId}`);
    return eventId;
  }
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
  }
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
    resetDeleteState: (state) => {
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
    resetBudgetUpdateState: (state) => {
      state.updateBudgetStatus = "idle";
      state.updateBudgetError = null;
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
        state.error = action.error.message;
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
        state.fetchOneError = action.error.message;
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
          (e) => e._id === action.payload._id
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

    // Delete
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter(
          (event) => event._id !== action.payload
        );
        if (state.selectedEventId === action.payload) {
          state.selectedEventId = null;
          state.selectedEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.error.message;
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
} = eventsSlice.actions;
export default eventsSlice.reducer;
