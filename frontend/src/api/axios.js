/**
 * @file: frontend/src/api/axios.js
 * @description: Centralized Axios HTTP client instance configured 
 *  with base URL, authentication interceptors, and automated global 
 * 401 response handling.
 */
import axios from "axios";

/** Custom Axios instance configured for backend API endpoints. */
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  // TODO: Production environment variable fallback:
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

/**
 * Request Interceptor:
 * Automatically injects teh stored JWT Bearer token into outgoing Authorization headers.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Response Interceptor:
 * Listens for 401 Unauthorized response to clear expired credentials and redirect to login,
 * bypassing public authentication/landing routes to prevent infinite redirect loops.
 */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register" && path !== "/") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;