// authSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app/api";

// --- Async Thunks ---

// Login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/login", credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Signup user
export const signupUser = createAsyncThunk(
  "auth/signup", 
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/signup", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);





