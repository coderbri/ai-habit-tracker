/**
 * @file: frontend/src/api/axios.js
 * @description: ...
 */
import axios from "axios";

// create an axios instance with the base url from the VITE_API_URL
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  // TODO: to test later:
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

// set up two intercepters
// the request intercepter runs before every outgoing request by 
// pulling the JWT token from local storage and catches it as an 
// authorization header (as been simulated with Postman). Meaning 
// we don't need to manually add the request token for every API call. 
// Axios does it automatically for every request the app makes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// the resonse intercepter runs on every incoming response.
// getting a 401 (when the token expires or is invalid) clears 
// local storage and redirects to login page. make sure to NOT 
// do this on the landing or auth pages to avoid redirect loops
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

// export the reconfigured client
export default api;