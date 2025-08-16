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

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [],
    budgetStatus: null,
    status: "idle",
    error: null,
    createStatus: "idle",
    createError: null,
    updateStatus: "idle",
    updateError: null,
    deleteStatus: "idle",
    deleteError: null,
  },
  reducers: {
    resetExpenseStatuses: (state) => {
      state.createStatus = "idle";
      state.createError = null;
      state.updateStatus = "idle";
      state.updateError = null;
      state.deleteStatus = "idle";
      state.deleteError = null;
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
  },
});

export const { resetExpenseStatuses } = expensesSlice.actions;
export default expensesSlice.reducer;
