// import axios from "axios";

// const serverPort = import.meta.env.PORT || 5000;

// export const axiosInstance = axios.create({
//   //local endpoint reference
//   baseURL: `http://localhost:${serverPort}/api/v1`,

  
// });



// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// export const axiosInstance = axios.create({
//   // Use the environment variable for the base URL
//   baseURL: `${API_BASE_URL}/api/v1`,
// });






import axios from "axios";

// // Use environment variable for backend URL
// const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// export const axiosInstance = axios.create({
//   baseURL,
// });
// Add a request interceptor to include the token in headers

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("Evangadi_Forum");
 
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("Evangadi_Forum");
//   console.log("Sending token:", token); // <-- debug
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });





const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Evangadi_Forum");
    console.log("🔑 Token from localStorage:", token);
    console.log("📤 Making request to:", config.url);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Authorization header set");
    } else {
      console.warn("⚠️ No token found in localStorage");
    }

    console.log("📋 Final headers:", config.headers);
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status);
    return response;
  },
  (error) => {
    console.error(
      "❌ Response error:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      console.log("🔄 Token invalid, redirecting to login...");
      localStorage.removeItem("Evangadi_Forum");
      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);