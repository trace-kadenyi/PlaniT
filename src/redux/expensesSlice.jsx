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
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/expenses/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
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

 
  },
});

