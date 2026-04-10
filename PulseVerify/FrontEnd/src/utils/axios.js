// import axios from "axios";
// import { toast, Bounce } from "react-toastify";

// //this is the axios instance which is used to make the requests to the API
// const instance = axios.create({
//   //this is the base url which is used to make the requests to the API
//   baseURL:
//     import.meta.env.VITE_API_BASE_URL ||
//     "https://jsonplaceholder.typicode.com",

//   timeout: 10000,
//   withCredentials: true,

//   //this is the header which is used to make the requests to the API
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // ==============================
// // REQUEST INTERCEPTOR
// // ==============================
// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ==============================
// // RESPONSE INTERCEPTOR
// // ==============================
// instance.interceptors.response.use(
//   (response) => response, // keep full response
//   (error) => {
//     const status = error.response?.status;

//     //this is the response interceptor which is used to handle the errors
//     if (status === 401) {
//       toast.error("Unauthorized! Please login again.", { transition: Bounce });
//     } else if (status === 403) {
//       toast.error("Access denied.", { transition: Bounce });
//     } else if (status === 404) {
//       toast.error("Not found.", { transition: Bounce });
//     } else {
//       toast.error("Something went wrong!", { transition: Bounce });
//     }

//     return Promise.reject(error);
//   }
// );

// // ✅ EXPORT AS axios
// export default instance;

import axios from "axios";
import { toast, Bounce } from "react-toastify";

// Axios instance for all PulseVerify API calls.
// Set VITE_API_BASE_URL in your .env to point to your Cloud Functions URL.
// e.g. VITE_API_BASE_URL=https://us-central1-pulseverify.cloudfunctions.net
const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://jsonplaceholder.typicode.com",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor ─────────────────────────────────────────────────────
// Attaches the Firebase JWT from localStorage (set this after Firebase login).
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
    toast.error(messages[status] ?? "Something went wrong!", {
      transition: Bounce,
      position: "bottom-right",
      theme: "dark",
    });
    return Promise.reject(error);
  }
);

export default instance;
