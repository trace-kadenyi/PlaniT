import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../app/api";

// --- Async Thunks ---

// Fetch all clients
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async () => {
    const res = await api.get("/api/clients");
    return res.data;
  }
);

// Create new client
export const createClient = createAsyncThunk(
  "clients/createClient",
  async (newClient, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/clients", newClient);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to create client" }
      );
    }
  }
);

// Update client
export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async ({ clientId, updatedClient }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/clients/${clientId}`, updatedClient);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to update client" }
      );
    }
  }
);

// Delete client
export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (clientId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/clients/${clientId}`);
      return clientId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to delete client" }
      );
    }
  }
);

// --- Slice ---

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    items: [],
    status: "idle",
    error: null,

    createStatus: "idle",
    createError: null,

    updateStatus: "idle",
    updateError: null,

    deleteStatus: "idle",
    deleteError: null,
  },

  reducers: {
    resetClientCreateState: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
    clearClientError: (state) => {
      state.error = null;
      state.status = "idle";
    },
 
  },

  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchClients.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Create client
      .addCase(createClient.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createClient.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          action.payload?.message ||
          action.error.message ||
          "Failed to create client.";
      })

    

   
  },
});

export const {
  resetClientCreateState,
  clearClientError,

} = clientsSlice.actions;
export default clientsSlice.reducer;
