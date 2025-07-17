import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

// Fetch tasks for a specific event
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/tasks?eventId=${eventId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add a new task
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async ({ eventId, taskData }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/tasks", { eventId, ...taskData });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update a task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updatedData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/tasks/${taskId}`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      return taskId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    eventId: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearTasks: (state) => {
      state.items = [];
      state.eventId = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.eventId = action.meta.arg; // eventId from fetchTasks(eventId)
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch tasks";
      })

      // Add task
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload || "Failed to add task";
      })

      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload || "Failed to update task";
      })

      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete task";
      });
  },
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
