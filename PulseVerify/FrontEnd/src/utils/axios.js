import axios from "axios";
import { toast, Bounce } from "react-toastify";

// Axios instance for all PulseVerify API calls.
// VITE_API_BASE_URL should point to the Express server (e.g., http://localhost:5000)
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor ─────────────────────────────────────────────────────
// Attaches the Firebase JWT stored in localStorage after login.
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ────────────────────────────────────────────────────
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const messages = {
      401: "Session expired — please log in again.",
      403: "Access denied.",
      404: "Resource not found.",
    };

    // Only show toast for non-network errors
    if (status) {
      toast.error(messages[status] ?? "Something went wrong!", {
        transition: Bounce,
        position: "bottom-right",
        theme: "dark",
        toastId: `api-error-${status}`, // prevent duplicate toasts
      });
    } else if (error.code === 'ECONNABORTED') {
      toast.error("Request timed out. Is the backend running?", {
        transition: Bounce,
        position: "bottom-right",
        theme: "dark",
        toastId: "timeout-error",
      });
    } else if (!error.response) {
      toast.error("Cannot connect to the server. Please start the backend.", {
        transition: Bounce,
        position: "bottom-right",
        theme: "dark",
        toastId: "network-error",
      });
    }

    return Promise.reject(error);
  }
);

export default instance;
