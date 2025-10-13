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
      const errorData = err.response?.data;
      if (err.response?.status === 429) {
        return rejectWithValue(
          errorData?.message ||
            "Too many login attempts. Please wait 15 minutes before trying again."
        );
      }
      return rejectWithValue(errorData?.message || err.message);
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
      const errorData = err.response?.data;
      if (err.response?.status === 429) {
        return rejectWithValue(
          errorData?.message ||
            "Too many signup attempts. Please wait 15 minutes before trying again."
        );
      }
      return rejectWithValue(errorData?.message || err.message);
    }
  }
);

// Refresh token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/refresh-token"); // No body needed
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
      const res = await api.patch(`/api/auth/reset-password/${token}`, {
        password,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/logout");
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
    trustedDevice: localStorage.getItem("trustedDevice") === "true",
    isInitializing: true,

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
      // Clear Redux state
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenTimestamp = null;
      state.isAuthenticated = false;
      state.trustedDevice = false;
      localStorage.removeItem("trustedDevice");
    },
    // Initialize auth state (call this on app load)
    initializeAuth: (state) => {
      state.isInitializing = true;

      // Immediate check: if no trusted device, we're done
      if (!state.trustedDevice) {
        state.isInitializing = false;
      }
      // If trusted device but no refresh token in memory, AuthInitializer will handle it
    },
    // Set tokens manually
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.tokenTimestamp = Date.now();
      state.isAuthenticated = !!accessToken;
    },
    // set trusted device
    setTrustedDevice: (state, action) => {
      state.trustedDevice = action.payload;
      localStorage.setItem("trustedDevice", action.payload.toString());
    },
    initializationComplete: (state) => {
      state.isInitializing = false;
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
        state.tokenTimestamp = Date.now();
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.loginError = action.payload || action.error.message;
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
        state.tokenTimestamp = Date.now();
        state.isAuthenticated = true;
      })
     .addCase(signupUser.rejected, (state, action) => {
  state.signupStatus = "failed";
  state.signupError = action.payload || action.error.message;
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
        state.user = action.payload.data.user;
        state.tokenTimestamp = Date.now();
        state.isAuthenticated = true;
        state.isInitializing = false;
      })
    .addCase(refreshToken.rejected, (state, action) => {
  state.refreshTokenStatus = "failed";
  state.refreshTokenError = action.payload || action.error.message;
  state.isAuthenticated = false;
  state.accessToken = null;
  state.refreshToken = null;
  state.tokenTimestamp = null;
  state.isInitializing = false;
});

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordStatus = "loading";
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordStatus = "succeeded";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordStatus = "failed";
        state.forgotPasswordError =
          action.payload?.message || action.error.message;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordStatus = "loading";
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordStatus = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordStatus = "failed";
        state.resetPasswordError =
          action.payload?.message || action.error.message;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        // Optional: to show loading state during logout
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // Clear all state on successful logout
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenTimestamp = null;
        state.isAuthenticated = false;
        state.trustedDevice = false;
        state.isInitializing = false;

        // Clear localStorage
        localStorage.removeItem("trustedDevice");

        // Reset all statuses
        state.loginStatus = "idle";
        state.signupStatus = "idle";
        state.refreshTokenStatus = "idle";
        state.forgotPasswordStatus = "idle";
        state.resetPasswordStatus = "idle";

        // Clear all errors
        state.loginError = null;
        state.signupError = null;
        state.refreshTokenError = null;
        state.forgotPasswordError = null;
        state.resetPasswordError = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Even if the API call fails, clear local state
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenTimestamp = null;
        state.isAuthenticated = false;
        state.trustedDevice = false;
        localStorage.removeItem("trustedDevice");
      });
  },
});

// exports
export const {
  clearAuthErrors,
  resetLoginState,
  resetSignupState,
  resetForgotPasswordState,
  resetResetPasswordState,
  logout,
  setTokens,
  initializeAuth,
  setTrustedDevice,
  initializationComplete,
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) =>
  state.auth.loginStatus === "loading";
export const selectIsInitializing = (state) => state.auth.isInitializing;

export default authSlice.reducer;
