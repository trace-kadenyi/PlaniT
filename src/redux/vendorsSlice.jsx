import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../app/api";

// Async Thunks
export const fetchVendors = createAsyncThunk(
  "vendors/fetchVendors",
  async ({ service, archived } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (service) params.service = service;
      if (archived !== undefined) params.archived = archived;

      const res = await api.get("/api/vendors", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchVendorById = createAsyncThunk(
  "vendors/fetchVendorById",
  async (vendorId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/vendors/${vendorId}`);
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

const vendorsSlice = createSlice({
  name: "vendors",
  initialState: {
    items: [],
    stats: [],
    vendorDetails: {
      data: null,
      status: "idle",
      error: null,
    },
    status: "idle",
    error: null,
    createStatus: "idle",
    createError: null,
    updateStatus: "idle",
    updateError: null,
    archiveStatus: "idle",
    archiveError: null,
    statsStatus: "idle",
    statsError: null,
  },
  reducers: {
    resetVendorStatuses: (state) => {
      state.createStatus = "idle";
      state.createError = null;
      state.updateStatus = "idle";
      state.updateError = null;
      state.archiveStatus = "idle";
      state.archiveError = null;
      state.vendorDetails.status = "idle";
      state.vendorDetails.error = null;
    },
    clearVendorDetails: (state) => {
      state.vendorDetails.data = null;
      state.vendorDetails.status = "idle";
      state.vendorDetails.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch vendors
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      });

    // Fetch single vendor
    builder
      .addCase(fetchVendorById.pending, (state) => {
        state.vendorDetails.status = "loading";
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.vendorDetails.status = "succeeded";
        state.vendorDetails.data = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.vendorDetails.status = "failed";
        state.vendorDetails.error =
          action.payload?.message || action.error.message;
      });

    // Create vendor
    builder
      .addCase(createVendor.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload?.message || action.error.message;
      });

    // Update vendor
    builder
      .addCase(updateVendor.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.items.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.vendorDetails.data?._id === action.payload._id) {
          state.vendorDetails.data = action.payload;
        }
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload?.message || action.error.message;
      });

    // Archive/unarchive vendor
    builder
      .addCase(toggleArchiveVendor.pending, (state) => {
        state.archiveStatus = "loading";
      })
      .addCase(toggleArchiveVendor.fulfilled, (state, action) => {
        state.archiveStatus = "succeeded";
        const index = state.items.findIndex(
          (v) => v._id === action.payload.vendor._id
        );
        if (index !== -1) {
          state.items[index].isArchived = action.payload.vendor.isArchived;
        }
        if (state.vendorDetails.data?._id === action.payload.vendor._id) {
          state.vendorDetails.data.isArchived =
            action.payload.vendor.isArchived;
        }
      })
      .addCase(toggleArchiveVendor.rejected, (state, action) => {
        state.archiveStatus = "failed";
        state.archiveError = action.payload?.message || action.error.message;
      });

    // Fetch vendor stats
    builder
      .addCase(fetchVendorStats.pending, (state) => {
        state.statsStatus = "loading";
      })
      .addCase(fetchVendorStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchVendorStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError = action.payload?.message || action.error.message;
      });
  },
});

export const { resetVendorStatuses, clearVendorDetails } = vendorsSlice.actions;
export default vendorsSlice.reducer;
