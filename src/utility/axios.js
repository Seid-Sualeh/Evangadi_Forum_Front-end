// import axios from "axios";

// // Use environment variable for backend URL (with fallback for local dev)
// const baseURL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// // Create axios instance
// export const axiosInstance = axios.create({
//   baseURL,
//   withCredentials: true, // 🔹 Important for CORS + cookies if used
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add a request interceptor to include the token in headers
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("Evangadi_Forum");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosInstance;











import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL
  // || "http://localhost:5000";

export const axiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("Evangadi_Forum");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
