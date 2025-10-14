import axios from "axios";

// const serverPort = import.meta.env.PORT || 5000;

// export const axiosInstance = axios.create({
//   //local endpoint reference
//   baseURL: `http://localhost:${serverPort}/api/v1`,

  
// });
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const axiosInstance = axios.create({
  // Use the environment variable for the base URL
  baseURL: `${API_BASE_URL}/api/v1`,
});
