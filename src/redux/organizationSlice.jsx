import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app/api";

// fetch org details
export const fetchOrganizationDetails = createAsyncThunk(
  "organization/fetchDetails",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/organization");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// update org name
export const updateOrganizationName = createAsyncThunk(
  "organization/updateName",
  async (name, { rejectWithValue }) => {
    try {
      const res = await api.patch("/api/organization", { name });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    organization: null,
    status: "idle",
    error: null,
    updateStatus: "idle",
    updateError: null,
  },
  reducers: {
    resetOrganizationStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.updateStatus = "idle";
      state.updateError = null;
    },
    setOrganization: (state, action) => {
      state.organization = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch org details
      .addCase(fetchOrganizationDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrganizationDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.organization = action.payload;
      })
      .addCase(fetchOrganizationDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // update org name
      .addCase(updateOrganizationName.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateOrganizationName.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.organization = action.payload.organization;
      })
      .addCase(updateOrganizationName.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      });
  },
});

export const { resetOrganizationStatus, setOrganization } =
  organizationSlice.actions;

export default organizationSlice.reducer;
