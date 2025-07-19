import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app/api";

// --- Async Thunks ---

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const res = await api.get("/api/events");
  return res.data;
});

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId) => {
    const res = await api.get(`/api/events/${eventId}`);
    return res.data;
  }
);

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

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, updatedEvent }) => {
    const res = await api.put(`/api/events/${eventId}`, updatedEvent);
    return res.data;
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId) => {
    await api.delete(`/api/events/${eventId}`);
    return eventId;
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
        state.items.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          action.payload?.message ||
          action.error.message ||
          "Failed to create event.";
      });

    // Update
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
        state.updateError = action.error.message;
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
  },
});

export const { setSelectedEventId, clearEventStatuses } = eventsSlice.actions;
export default eventsSlice.reducer;
