// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // backend base URL
});

// Store reference - import it dynamically to avoid circular dependencies
let store;

// Function to set the store reference (call this in the store setup)
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
  (error) => Promise.reject(error)
);

// Response interceptor - handles token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 error and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry && store) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await store.dispatch(refreshToken());
        const newToken = store.getState()?.auth?.accessToken;
        
        if (newToken) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        if (store.dispatch && store.dispatch.logout) {
          store.dispatch(logout());
        }
        // Redirect to login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;