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

// Use environment variable for backend URL
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const axiosInstance = axios.create({
  baseURL,
});
// Add a request interceptor to include the token in headers

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("Evangadi_Forum");
 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

