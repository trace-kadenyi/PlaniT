import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app/api";

// Fetch all users in organization
export const fetchOrganizationUsers = createAsyncThunk(
  "organization/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/organization/users");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add user to organization
export const addOrganizationUser = createAsyncThunk(
  "organization/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/organization/users", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Remove user from organization
export const removeOrganizationUser = createAsyncThunk(
  "organization/removeUser",
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/organization/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk(
  "organization/updateUserRole",
  async ({ userId, organizationRole }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/organization/users/${userId}/role`, {
        organizationRole,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    users: [],
    status: "idle",
    error: null,
    addUserStatus: "idle",
    addUserError: null,
    removeUserStatus: "idle",
    removeUserError: null,
    updateRoleStatus: "idle",
    updateRoleError: null,
  },
  reducers: {
    resetOrganizationStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.addUserStatus = "idle";
      state.addUserError = null;
      state.removeUserStatus = "idle";
      state.removeUserError = null;
      state.updateRoleStatus = "idle";
      state.updateRoleError = null;
    },
    clearOrganizationUsers: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchOrganizationUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrganizationUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchOrganizationUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Add user
      .addCase(addOrganizationUser.pending, (state) => {
        state.addUserStatus = "loading";
        state.addUserError = null;
      })
      .addCase(addOrganizationUser.fulfilled, (state, action) => {
        state.addUserStatus = "succeeded";
        state.users.push(action.payload.user);
      })
      .addCase(addOrganizationUser.rejected, (state, action) => {
        state.addUserStatus = "failed";
        state.addUserError = action.payload;
      })
      // Remove user
      .addCase(removeOrganizationUser.pending, (state) => {
        state.removeUserStatus = "loading";
        state.removeUserError = null;
      })
      .addCase(removeOrganizationUser.fulfilled, (state, action) => {
        state.removeUserStatus = "succeeded";
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(removeOrganizationUser.rejected, (state, action) => {
        state.removeUserStatus = "failed";
        state.removeUserError = action.payload;
      })
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.updateRoleStatus = "loading";
        state.updateRoleError = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.updateRoleStatus = "succeeded";
        const index = state.users.findIndex(
          (user) => user._id === action.payload.user.id
        );
        if (index !== -1) {
          state.users[index].organizationRole = action.payload.user.organizationRole;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.updateRoleStatus = "failed";
        state.updateRoleError = action.payload;
      });
  },
});

