import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app/api";

// dedicated endpoint for deleted events only
export const fetchDeletedEventExpenses = createAsyncThunk(
  "deletedEventsAudit/fetchAll",
  async (eventId = null, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (eventId) params.append("eventId", eventId);

      const res = await api.get(
        `/api/expenses/audit-logs/deleted-events?${params.toString()}`,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const deletedEventsAuditSlice = createSlice({
  name: "deletedEventsAudit",
  initialState: {
    groupedByEvent: [],
    logs: [],
    status: "idle",
    error: null,
    expandedEventId: null,
  },
  reducers: {
    setExpandedEventId: (state, action) => {
      state.expandedEventId = action.payload;
    },
    clearDeletedEventExpenses: (state) => {
      state.groupedByEvent = [];
      state.logs = [];
      state.status = "idle";
      state.error = null;
      state.expandedEventId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeletedEventExpenses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDeletedEventExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groupedByEvent = action.payload.groupedByEvent || [];
        state.logs = action.payload.logs || [];
      })
      .addCase(fetchDeletedEventExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { setExpandedEventId, clearDeletedEventExpenses } =
  deletedEventsAuditSlice.actions;
export default deletedEventsAuditSlice.reducer;
