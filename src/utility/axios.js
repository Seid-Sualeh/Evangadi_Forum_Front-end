





import axios from "axios";

function withApiPrefix(url) {
  if (!url) return "http://localhost:5000/api/v1";
  const trimmed = url.replace(/\/$/, "");
  if (/\/api\/v1$/.test(trimmed)) return trimmed;
  return `${trimmed}/api/v1`;
}

// ✅ Make sure your .env has this:
// VITE_API_BASE_URL=https://evangadi-forum-backend-gules.vercel.app
const baseURL = withApiPrefix(import.meta.env.VITE_API_BASE_URL);

console.log("🌍 Backend baseURL:", baseURL);

export const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ======================== REQUEST INTERCEPTOR ========================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Evangadi_Forum");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Authorization set:", token);
    } else {
      console.warn("⚠️ No token found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ======================== RESPONSE INTERCEPTOR ========================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Response error:", error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      console.warn("🔄 Token invalid or expired. Logging out...");
      localStorage.removeItem("Evangadi_Forum");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
