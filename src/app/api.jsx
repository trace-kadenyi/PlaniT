import axios from "axios";
import { refreshToken, logout } from "../redux/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let store;

export const setStore = (storeInstance) => {
  store = storeInstance;
};

// Blocks interceptor until AuthInitializer finishes its startup refresh
let resolveAppReady;
export const appReady = new Promise((resolve) => {
  resolveAppReady = resolve;
});
export const markAppReady = () => resolveAppReady();

// Refresh lock — prevents multiple simultaneous refresh calls
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

// Request interceptor — attach token if present
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

// Response interceptor — handle 401s with a single refresh + queue
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Wait for startup refresh to settle before handling any 401s
    await appReady;

    const originalRequest = error.config;
    const errorMessage = error.response?.data?.message || "";
    const status = error.response?.status;

    const isAuthRoute =
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/refresh-token") ||
      originalRequest.url.includes("/auth/forgot-password") ||
      originalRequest.url.includes("/auth/reset-password") ||
      originalRequest.url.includes("/auth/logout");

    const isCredentialError = [
      "Current password is incorrect",
      "Invalid credentials",
      "Password is incorrect",
    ].some((msg) => errorMessage.includes(msg));

    if (status !== 401 || isAuthRoute || isCredentialError || !store) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const result = await store.dispatch(refreshToken()).unwrap();
      const newToken =
        result?.accessToken || store.getState()?.auth?.accessToken;

      if (newToken) {
        onRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    } catch (refreshError) {
      refreshSubscribers = [];
      store.dispatch(logout());
      const currentPath = window.location.pathname + window.location.search;
      if (window.location.pathname !== "/login") {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    } finally {
      isRefreshing = false;
    }

    return Promise.reject(error);
  },
);

export default api;
