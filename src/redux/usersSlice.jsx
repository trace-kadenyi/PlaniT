// redux/usersSlice.js
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
  }
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
  }
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
  }
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
  }
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
  }
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
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [], // All users
    currentUser: null, // User being viewed/edited
    status: "idle", // For fetchUsers
    fetchDetailsStatus: "idle", // For fetchUserDetails
    addStatus: "idle",
    updateStatus: "idle",
    updateRoleStatus: "idle",
    deleteStatus: "idle",
    error: null,
    fetchDetailsError: null,
    addError: null,
    updateError: null,
    updateRoleError: null,
    deleteError: null,
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
    },
    clearUsers: (state) => {
      state.items = [];
      state.currentUser = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
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
        // Update in items list
        const index = state.items.findIndex(
          (user) => user._id === action.payload.user.id
        );
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload.user,
          };
        }
        // Update current user if it's the same
        if (
          state.currentUser &&
          state.currentUser._id === action.payload.user.id
        ) {
          state.currentUser = { ...state.currentUser, ...action.payload.user };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.updateRoleStatus = "loading";
        state.updateRoleError = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.updateRoleStatus = "succeeded";
        const index = state.items.findIndex(
          (user) => user._id === action.payload.user.id
        );
        if (index !== -1) {
          state.items[index].role = action.payload.user.role;
        }
        if (
          state.currentUser &&
          state.currentUser._id === action.payload.user.id
        ) {
          state.currentUser.role = action.payload.user.role;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.updateRoleStatus = "failed";
        state.updateRoleError = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter((user) => user._id !== action.payload);
        if (state.currentUser && state.currentUser._id === action.payload) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      });
  },
});

export const { resetUsersStatus, clearUsers, setCurrentUser } =
  usersSlice.actions;
export default usersSlice.reducer;
