import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import api from "../../services/api"

// Async thunk to fetch events
export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const res = await api.get("/api/events");
  return res.data;
});

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    items: [],
    selectedEventId: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setSelectedEventId: (state, action) => {
      state.selectedEventId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setSelectedEventId } = eventsSlice.actions;
export default eventsSlice.reducer;
