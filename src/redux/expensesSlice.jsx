import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../app/api";

// Async Thunks
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (eventId) => {
    const res = await api.get(`/api/expenses/event/${eventId}`);
    return res.data;
  }
);

// create expense
export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (newExpense, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/expenses", newExpense);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// update expense
export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ id, updatedExpense }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/expenses/${id}`, updatedExpense);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// delete expense
export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (expenseId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/expenses/${expenseId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// get expense audit logs with event filtering
export const fetchExpenseAuditLogs = createAsyncThunk(
  "expenses/fetchExpenseAuditLogs",
  async ({ eventId, filters = {} } = {}, { rejectWithValue }) => {
    try {
      // Build query params
      const params = new URLSearchParams();

      // Add eventId if provided
      if (eventId) {
        params.append("eventId", eventId);
      }

      // Add other filters if provided
      if (filters.actionType) {
        params.append("actionType", filters.actionType);
      }
      if (filters.startDate) {
        params.append("startDate", filters.startDate);
      }
      if (filters.endDate) {
        params.append("endDate", filters.endDate);
      }
      if (filters.limit) {
        params.append("limit", filters.limit);
      }

      // Use the new endpoint
      const url = `/api/expenses/audit-logs${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const res = await api.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// get deleted paid expenses log
export const fetchDeletedPaidExpensesLog = createAsyncThunk(
  "expenses/fetchDeletedPaidExpensesLog",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/expenses/deleted-paid-expenses/log");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [],
    budgetStatus: null,
    auditLogs: [],
    status: "idle",
    auditLogStatus: "idle",
    auditLogError: null,
    error: null,
    createStatus: "idle",
    createError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null,
    auditLogFilters: {
      eventId: null,
      actionType: null,
      startDate: null,
      endDate: null,
      limit: 100,
    },
    auditLogCount: 0,
    paidExpensesCount: 0,
  },
  reducers: {
    resetExpenseStatuses: (state) => {
      state.createStatus = "idle";
      state.createError = null;
      state.updateStatus = "idle";
      state.updateError = null;
      state.deleteStatus = "idle";
      state.deleteError = null;
      state.auditLogStatus = "idle";
      state.auditLogError = null;
    },
    setAuditLogFilters: (state, action) => {
      state.auditLogFilters = { ...state.auditLogFilters, ...action.payload };
    },
    clearAuditLogFilters: (state) => {
      state.auditLogFilters = {
        eventId: null,
        actionType: null,
        startDate: null,
        endDate: null,
        limit: 100,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch expenses
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.expenses;
        state.budgetStatus = action.payload.budgetStatus;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // Create expense
    builder
      .addCase(createExpense.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items.unshift(action.payload.expense);
        state.budgetStatus = action.payload.budgetStatus;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload?.message || action.error.message;
      });

    // Update expense
    builder
      .addCase(updateExpense.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.items.findIndex(
          (e) => e._id === action.payload.expense._id
        );
        if (index !== -1) {
          state.items[index] = action.payload.expense;
        }
        state.budgetStatus = action.payload.budgetStatus;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload?.message || action.error.message;
      });

    // Delete expense
    builder
      .addCase(deleteExpense.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        // Remove the deleted expense
        state.items = state.items.filter(
          (expense) => expense._id !== action.payload.deletedExpense._id
        );

        // Update budget status with the fresh data from backend
        state.budgetStatus = action.payload.budgetStatus;
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          action.payload?.message ||
          action.payload?.systemMessage ||
          action.error.message;
      });

    // Get expense audit logs (NEW)
    builder
      .addCase(fetchExpenseAuditLogs.pending, (state) => {
        state.auditLogStatus = "loading";
      })
      .addCase(fetchExpenseAuditLogs.fulfilled, (state, action) => {
        state.auditLogStatus = "succeeded";

        // Store both sets of logs
        state.auditLogs = action.payload.auditLogs || [];
        state.deletedPaidExpenses = action.payload.deletedPaidExpenses || [];

        // Store counts
        state.auditLogCount = action.payload.count || 0;
        state.paidExpensesCount = action.payload.paidExpensesCount || 0;

        // Store filters used
        if (action.payload.filters) {
          state.auditLogFilters = {
            ...state.auditLogFilters,
            ...action.payload.filters,
          };
        }
      })
      .addCase(fetchExpenseAuditLogs.rejected, (state, action) => {
        state.auditLogStatus = "failed";
        state.auditLogError = action.payload?.message || action.error.message;
      });

    // get deleted paid expenses log
    builder
      .addCase(fetchDeletedPaidExpensesLog.pending, (state) => {
        state.auditLogStatus = "loading";
      })
      .addCase(fetchDeletedPaidExpensesLog.fulfilled, (state, action) => {
        state.auditLogStatus = "succeeded";
        state.auditLogs = action.payload.deletedPaidExpenses;
      })
      .addCase(fetchDeletedPaidExpensesLog.rejected, (state, action) => {
        state.auditLogStatus = "failed";
        state.auditLogError = action.payload?.message || action.error.message;
      });
  },
});

export const {
  resetExpenseStatuses,
  setAuditLogFilters,
  clearAuditLogFilters,
} = expensesSlice.actions;
export default expensesSlice.reducer;
