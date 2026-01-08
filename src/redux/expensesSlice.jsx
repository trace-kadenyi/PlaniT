import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../app/api";

// Async Thunks
// export const fetchExpenses = createAsyncThunk(
//   "expenses/fetchExpenses",
//   async (eventId) => {
//     const res = await api.get(`/api/expenses/event/${eventId}`);
//     return res.data;
//   }
// );

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (eventId, { getState }) => {
    const state = getState();
    const userRole = state.auth.user?.role;
    const showVoided = state.expenses.showVoided || false;

    const params = {};
    if ((userRole === "admin" || userRole === "super_admin") && showVoided) {
      params.showVoided = "true";
    }

    console.log("Fetching expenses with params:", params); // ← Debug
    
    const res = await api.get(`/api/expenses/event/${eventId}`, { params });
    
    console.log("Backend response:", res.data); // ← Debug
    
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

// VOID expense
export const voidExpense = createAsyncThunk(
  "expenses/voidExpense",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/expenses/${id}/void`, { reason });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// UNVOID expense (super admin only)
export const unvoidExpense = createAsyncThunk(
  "expenses/unvoidExpense",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/expenses/${id}/unvoid`, { reason });
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
    voidStatus: "idle",
    voidError: null,
    unvoidStatus: "idle",
    unvoidError: null,
    showVoided: false,
    totals: {
      totalAmount: 0,
      paidAmount: 0,
      activeCount: 0,
      voidedCount: 0,
    },
    permissions: {
      canViewVoided: false,
      canVoidExpenses: false,
      canUnvoidExpenses: false,
    },
  },
  reducers: {
    resetExpenseStatuses: (state) => {
      state.createStatus = "idle";
      state.createError = null;
      state.updateStatus = "idle";
      state.updateError = null;
      state.deleteStatus = "idle";
      state.deleteError = null;
      state.voidStatus = "idle";
      state.voidError = null;
      state.unvoidStatus = "idle";
      state.unvoidError = null;
    },
    toggleShowVoided: (state, action) => {
      if (state.permissions.canViewVoided) {
        state.showVoided = !state.showVoided;
      }
    },
    setShowVoided: (state, action) => {
      if (state.permissions.canViewVoided) {
        state.showVoided = action.payload;
      }
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
  state.items = action.payload.expenses; // ← This includes voided expenses
  state.budgetStatus = action.payload.budgetStatus;
  state.totals = action.payload.totals || {
    totalAmount: 0,
    paidAmount: 0,
    activeCount: 0,
    voidedCount: 0,
  };
  state.permissions = action.payload.permissions || {
    canViewVoided: false,
    canVoidExpenses: false,
    canUnvoidExpenses: false,
  };
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
        // Only add to items if not voided (should never be voided on creation)
        if (!action.payload.expense.isVoided) {
          state.items.unshift(action.payload.expense);
          // Update totals
          state.totals.activeCount += 1;
          state.totals.totalAmount += action.payload.expense.amount;
          if (action.payload.expense.paymentStatus === "paid") {
            state.totals.paidAmount += action.payload.expense.amount;
          }
        }
        state.budgetStatus = action.payload.budgetStatus;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload?.message || action.error.message;
      });
    // Update expense
    // builder
    //   .addCase(updateExpense.pending, (state) => {
    //     state.updateStatus = "loading";
    //   })
    //   .addCase(updateExpense.fulfilled, (state, action) => {
    //     state.updateStatus = "succeeded";
    //     const index = state.items.findIndex(
    //       (e) => e._id === action.payload.expense._id
    //     );
    //     if (index !== -1) {
    //       state.items[index] = action.payload.expense;
    //     }
    //     state.budgetStatus = action.payload.budgetStatus;
    //   })
    //   .addCase(updateExpense.rejected, (state, action) => {
    //     state.updateStatus = "failed";
    //     state.updateError = action.payload?.message || action.error.message;
    //   });

    // Delete expense
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
          // Update the item
          const oldExpense = state.items[index];
          const newExpense = action.payload.expense;
          state.items[index] = newExpense;

          // Update totals if amount changed
          if (oldExpense.amount !== newExpense.amount) {
            state.totals.totalAmount += newExpense.amount - oldExpense.amount;
            if (
              oldExpense.paymentStatus === "paid" &&
              newExpense.paymentStatus === "paid"
            ) {
              state.totals.paidAmount += newExpense.amount - oldExpense.amount;
            }
          }

          // Update paid amount if status changed
          if (oldExpense.paymentStatus !== newExpense.paymentStatus) {
            if (
              oldExpense.paymentStatus === "paid" &&
              newExpense.paymentStatus === "pending"
            ) {
              state.totals.paidAmount -= oldExpense.amount;
            } else if (
              oldExpense.paymentStatus === "pending" &&
              newExpense.paymentStatus === "paid"
            ) {
              state.totals.paidAmount += newExpense.amount;
            }
          }
        }
        state.budgetStatus = action.payload.budgetStatus;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload?.message || action.error.message;
      });
    // Void expense
    builder
      .addCase(voidExpense.pending, (state, action) => {
        state.voidStatus = "loading";
      })
     .addCase(voidExpense.fulfilled, (state, action) => {
  state.voidStatus = "succeeded";

  const voidedExpense = action.payload.expense;
  const index = state.items.findIndex((e) => e._id === voidedExpense._id);

  if (index !== -1) {
    // ALWAYS update the expense in place - don't remove it
    state.items[index] = voidedExpense; // ← Always update, never remove
    
    // Update totals
    state.totals.activeCount -= 1;
    state.totals.totalAmount -= voidedExpense.amount;
    state.totals.voidedCount += 1;
    if (voidedExpense.paymentStatus === "paid") {
      state.totals.paidAmount -= voidedExpense.amount;
    }
  }

  state.budgetStatus = action.payload.budgetStatus;
})
      .addCase(voidExpense.rejected, (state, action) => {
        state.voidStatus = "failed";
        state.voidError = action.payload?.message || action.error.message;
      });

    // Unvoid expense
    builder
      .addCase(unvoidExpense.pending, (state) => {
        state.unvoidStatus = "loading";
      })
      .addCase(unvoidExpense.fulfilled, (state, action) => {
        state.unvoidStatus = "succeeded";

        const unvoidedExpense = action.payload.expense;
        const index = state.items.findIndex(
          (e) => e._id === unvoidedExpense._id
        );

        if (index !== -1 && state.showVoided) {
          // Update in place if showing voided
          state.items[index] = unvoidedExpense;
        } else if (!state.showVoided) {
          // Add to items if not showing voided
          state.items.unshift(unvoidedExpense);
        }

        // Update totals
        state.totals.activeCount += 1;
        state.totals.totalAmount += unvoidedExpense.amount;
        state.totals.voidedCount -= 1;
        if (unvoidedExpense.paymentStatus === "paid") {
          state.totals.paidAmount += unvoidedExpense.amount;
        }

        state.budgetStatus = action.payload.budgetStatus;
      })
      .addCase(unvoidExpense.rejected, (state, action) => {
        state.unvoidStatus = "failed";
        state.unvoidError = action.payload?.message || action.error.message;
      });
  },
});

export const { resetExpenseStatuses, toggleShowVoided, setShowVoided } =
  expensesSlice.actions;
export default expensesSlice.reducer;
