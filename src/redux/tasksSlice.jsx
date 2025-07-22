import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app/api";

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

// Fetch all tasks
export const fetchAllTasks = createAsyncThunk(
  "events/fetchAllTasks",
  async () => {
    const res = await api.get("/api/tasks");
    return res.data;
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
      return rejectWithValue(
        err.response?.data?.message || err.message || "Update failed"
      );
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
    status: "idle", // For fetch operations
    error: null,
    // Add separate statuses for different operations like eventsSlice
    createStatus: "idle",
    createError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null,
  },
  reducers: {
    clearTasks: (state) => {
      state.items = [];
      state.eventId = null;
      state.status = "idle";
      state.error = null;
    },
    resetTaskStatus: (state) => {
      // Reset all statuses
      state.status = "idle";
      state.createStatus = "idle";
      state.updateStatus = "idle";
      state.deleteStatus = "idle";
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    resetCreateState: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
      state.updateStatus = "idle";
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
        state.eventId = action.meta.arg;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch tasks";
      })

      // Fetch all tasks
      .addCase(fetchAllTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.eventId = action.meta.arg;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch all tasks";
      })

      // Add task - Modified to match eventsSlice pattern
      .addCase(addTask.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // This now contains the proper error message
      })

      // Update task - Modified to match eventsSlice pattern
      .addCase(updateTask.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.items.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Make sure this is set
      })

      // Delete task - Modified to match eventsSlice pattern
      .addCase(deleteTask.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Failed to delete task";
      });
  },
});

export const {
  clearTasks,
  resetTaskStatus,
  resetCreateState,
  clearUpdateError,
} = tasksSlice.actions;
export default tasksSlice.reducer;
