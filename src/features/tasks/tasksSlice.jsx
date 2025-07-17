import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch tasks for a specific event
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (eventId) => {
  const res = await axios.get(`/api/tasks?eventId=${eventId}`);
  return res.data;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearTasks: (state) => {
      state.items = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
