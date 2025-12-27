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
 
});

