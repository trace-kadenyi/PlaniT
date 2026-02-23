import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../app/api";

// Fetch all users (already filtered by organization in backend)
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/users");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Fetch single user details
export const fetchUserDetails = createAsyncThunk(
  "users/fetchUserDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/users/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Add new user
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/users", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Update user details
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/users/${userId}`, userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Update user role
export const updateUserRole = createAsyncThunk(
  "users/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/users/${userId}/role`, { role });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Delete user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Reactivate user
export const reactivateUser = createAsyncThunk(
  "users/reactivateUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/users/${userId}/reactivate`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Fetch user update history
export const fetchUserUpdateHistory = createAsyncThunk(
  "users/fetchUserUpdateHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/users/${userId}/history`);
      return { userId, history: res.data };
    } catch (err) {
      // Preserve the status code
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [], // All users
    updateHistory: {}, // Store history by userId
    currentUser: null, // User being viewed/edited
    status: "idle", // For fetchUsers
    fetchDetailsStatus: "idle", // For fetchUserDetails
    fetchHistoryStatus: "idle",
    addStatus: "idle",
    updateStatus: "idle",
    updateRoleStatus: "idle",
    updatingUserId: null,
    deleteStatus: "idle",
    reactivateStatus: "idle",
    deletingUserId: null,
    reactivatingUserId: null,
    error: null,
    fetchDetailsError: null,
    fetchHistoryError: null,
    addError: null,
    updateError: null,
    updateRoleError: null,
    deleteError: null,
    reactivateError: null,
    isHistoryPermitted: false,
  },
  reducers: {
    resetUsersStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.addStatus = "idle";
      state.addError = null;
      state.updateStatus = "idle";
      state.updateError = null;
      state.deleteStatus = "idle";
      state.deleteError = null;
      state.fetchHistoryStatus = "idle";
      state.fetchHistoryError = null;
      state.reactivateStatus = "idle";
      state.reactivateError = null;
      state.isHistoryForbidden = false;
    },
    clearUsers: (state) => {
      state.items = [];
      state.currentUser = null;
      state.updateHistory = {};
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearUserHistory: (state, action) => {
      const userId = action.payload;
      if (state.updateHistory[userId]) {
        delete state.updateHistory[userId];
      }
    },
    setHistoryPermitted: (state, action) => {
      state.isHistoryPermitted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch single user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.fetchDetailsStatus = "loading";
        state.fetchDetailsError = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.fetchDetailsStatus = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.fetchDetailsStatus = "failed";
        state.fetchDetailsError = action.payload;
      })

      // Add user
      .addCase(addUser.pending, (state) => {
        state.addStatus = "loading";
        state.addError = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        state.items.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.addStatus = "failed";
        state.addError = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedUser = action.payload.user;
        const userId = updatedUser._id || updatedUser.id;

        const index = state.items.findIndex((u) => u._id === userId);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...updatedUser,
          };
        }

        if (state.currentUser && state.currentUser._id === userId) {
          state.currentUser = { ...state.currentUser, ...updatedUser };
        }
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      // Update user role
      .addCase(updateUserRole.pending, (state, action) => {
        state.updateRoleStatus = "loading";
        state.updateRoleError = null;
        state.updatingUserId = action.meta.arg.userId;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.updateRoleStatus = "succeeded";
        state.updatingUserId = null;

        const updatedUser = action.payload.user;
        const userId = updatedUser._id || updatedUser.id;

        const index = state.items.findIndex((u) => u._id === userId);
        if (index !== -1) {
          state.items[index].role = updatedUser.role;
        }

        if (state.currentUser && state.currentUser._id === userId) {
          state.currentUser.role = updatedUser.role;
        }
      })

      .addCase(updateUserRole.rejected, (state, action) => {
        state.updateRoleStatus = "failed";
        state.updateRoleError = action.payload;
        state.updatingUserId = null;
      })

      // Deactivate user
      .addCase(deleteUser.pending, (state, action) => {
        state.deleteStatus = "loading";
        state.deletingUserId = action.meta.arg;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.deletingUserId = null;

        const userId = action.payload;
        const user = state.items.find((u) => u._id === userId);

        if (user) {
          user.isDeactivated = true;
          user.isActive = false;
        }

        if (state.currentUser && state.currentUser._id === userId) {
          state.currentUser.isDeactivated = true;
          state.currentUser.isActive = false;
        }
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deletingUserId = null;
        state.deleteError = action.payload;
      })

      // Reactivate user
      .addCase(reactivateUser.pending, (state, action) => {
        state.reactivateStatus = "loading";
        state.reactivatingUserId = action.meta.arg;
        state.reactivateError = null;
      })
      .addCase(reactivateUser.fulfilled, (state, action) => {
        state.reactivateStatus = "succeeded";
        state.reactivatingUserId = null;

        const updatedUser = action.payload.user;

        // Update in items list
        const index = state.items.findIndex(
          (user) => user._id === updatedUser._id,
        );

        if (index !== -1) {
          state.items[index] = updatedUser;
        }

        // Update current user if open
        if (state.currentUser && state.currentUser._id === updatedUser._id) {
          state.currentUser = updatedUser;
        }
      })
      .addCase(reactivateUser.rejected, (state, action) => {
        state.reactivateStatus = "failed";
        state.reactivatingUserId = null;
        state.reactivateError = action.payload;
      })

      // Fetch user update history
      .addCase(fetchUserUpdateHistory.pending, (state) => {
        state.fetchHistoryStatus = "loading";
        state.fetchHistoryError = null;
      })
      .addCase(fetchUserUpdateHistory.fulfilled, (state, action) => {
        state.fetchHistoryStatus = "succeeded";
        // Store history by userId
        state.updateHistory[action.payload.userId] = action.payload.history;
      })
      .addCase(fetchUserUpdateHistory.rejected, (state, action) => {
        state.fetchHistoryStatus = "failed";
        // Don't throw error if it's just a 403 permission issue
        if (action.error?.status !== 403) {
          state.error = action.error.message;
          state.isHistoryForbidden = true;
        }
      });
  },
});

export const {
  resetUsersStatus,
  clearUsers,
  setCurrentUser,
  clearUserHistory,
  setHistoryPermitted,
} = usersSlice.actions;
export const selectUserUpdateHistory = (state, userId) => {
  return state.users.updateHistory[userId] || [];
};
export default usersSlice.reducer;
