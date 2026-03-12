import axios from "axios";
import { refreshToken, logout } from "../redux/authSlice";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

let store;

export const setStore = (storeInstance) => {
  store = storeInstance;
};

// Request interceptor - automatically adds auth token to requests
api.interceptors.request.use(
  (config) => {
    if (store) {
      const token = store.getState()?.auth?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handles token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error.response?.data?.message || "";

    // Skip token refresh for specific 401 errors that are NOT token-related
    const skipRefreshErrors = [
      "Current password is incorrect",
      "Invalid credentials",
      "Password is incorrect",
    ];

    // If 401 error and haven't retried yet AND it's NOT a password error
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store &&
      !skipRefreshErrors.some((msg) => errorMessage.includes(msg))
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const result = await store.dispatch(refreshToken()).unwrap();
        const newToken =
          result?.accessToken || store.getState()?.auth?.accessToken;

        if (newToken) {
          // Silently retry the original request — no redirect needed
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh genuinely failed — log out and preserve current path for redirect after login
        store.dispatch(logout());
        const currentPath = window.location.pathname + window.location.search;
        if (window.location.pathname !== "/login") {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
