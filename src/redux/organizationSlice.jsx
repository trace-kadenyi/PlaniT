import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app/api";

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

const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    organization: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetOrganizationStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    setOrganization: (state, action) => {
      state.organization = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { resetOrganizationStatus, setOrganization } =
  organizationSlice.actions;

export default organizationSlice.reducer;
