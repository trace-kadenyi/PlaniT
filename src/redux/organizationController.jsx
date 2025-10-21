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
 
});

