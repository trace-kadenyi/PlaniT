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

// Refresh token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { refreshToken } = getState().auth;
      const res = await api.post("/api/auth/refresh-token", { refreshToken });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/auth/reset-password/${token}`, { password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Slice ---

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null, // Stored in memory only
    refreshToken: null, // Stored in memory only
    tokenTimestamp: null, // Track when token was received
    
    // Status for each operation
    loginStatus: "idle",
    loginError: null,
    
    signupStatus: "idle", 
    signupError: null,
    
    refreshTokenStatus: "idle",
    refreshTokenError: null,
    
    forgotPasswordStatus: "idle",
    forgotPasswordError: null,
    
    resetPasswordStatus: "idle",
    resetPasswordError: null,
    
    isAuthenticated: false,
  },

  reducers: {
    // Clear auth errors
    clearAuthErrors: (state) => {
      state.loginError = null;
      state.signupError = null;
      state.refreshTokenError = null;
      state.forgotPasswordError = null;
      state.resetPasswordError = null;
    },
    
    // Reset specific statuses
    resetLoginState: (state) => {
      state.loginStatus = "idle";
      state.loginError = null;
    },
    
    resetSignupState: (state) => {
      state.signupStatus = "idle";
      state.signupError = null;
    },
    
    resetForgotPasswordState: (state) => {
      state.forgotPasswordStatus = "idle";
      state.forgotPasswordError = null;
    },
    
    resetResetPasswordState: (state) => {
      state.resetPasswordStatus = "idle";
      state.resetPasswordError = null;
    },
    
    // Logout user - clear everything from memory
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenTimestamp = null;
      state.isAuthenticated = false;
    },
    
    // Initialize auth state (call this on app load)
    initializeAuth: (state) => {
      // With in-memory storage, we start fresh each time
      // You could implement a session persistence strategy here if needed
      state.isAuthenticated = !!state.accessToken;
    },
    
    // Set tokens manually
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.tokenTimestamp = Date.now();
      state.isAuthenticated = !!accessToken;
    },
  },

  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "loading";
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.user = action.payload.data.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenTimestamp = Date.now();
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.loginError = action.payload?.message || action.error.message;
        state.isAuthenticated = false;
      });

    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.signupStatus = "loading";
        state.signupError = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.signupStatus = "succeeded";
        state.user = action.payload.data.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenTimestamp = Date.now();
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.signupStatus = "failed";
        state.signupError = action.payload?.message || action.error.message;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.refreshTokenStatus = "loading";
        state.refreshTokenError = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.refreshTokenStatus = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.tokenTimestamp = Date.now();
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.refreshTokenStatus = "failed";
        state.refreshTokenError = action.payload?.message || action.error.message;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenTimestamp = null;
      });

   

  
  },
});

