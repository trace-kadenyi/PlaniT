import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app/api";

// Async Thunks
export const fetchVendors = createAsyncThunk(
  "vendors/fetchVendors",
  async ({ service, archived }, { rejectWithValue }) => {
    try {
      const params = {};
      if (service) params.service = service;
      if (archived !== undefined) params.archived = archived;
      
      const res = await api.get("/api/vendors", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createVendor = createAsyncThunk(
  "vendors/createVendor",
  async (vendorData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/vendors", vendorData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateVendor = createAsyncThunk(
  "vendors/updateVendor",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/vendors/${id}`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleArchiveVendor = createAsyncThunk(
  "vendors/toggleArchive",
  async (vendorId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/vendors/${vendorId}/archive`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchVendorStats = createAsyncThunk(
  "vendors/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/vendors/stats");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



