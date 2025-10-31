


import { createContext, useEffect, useState } from "react";
import "./App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "./utility/axios";
import AppRouter from "./routes/AppRouter.jsx";

export const UserState = createContext(); // Context for user data

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Fetch user data from backend using stored token
  const getUserData = async () => {
    const token = localStorage.getItem("Evangadi_Forum");

    if (!token) {
      // No token means not logged in → go to /auth
      if (location.pathname !== "/auth") {
        navigate("/auth");
      }
      return;
    }

    try {
      const response = await axiosInstance.get("/user/check", {
        headers: { Authorization: "Bearer " + token },
      });

      // Log response to confirm its structure
      console.log("✅ User data:", response.data);

      // If backend returns { user: {...} }
      const userData = response.data.user || response.data;
      setUser(userData);
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      localStorage.removeItem("Evangadi_Forum");
      navigate("/auth");
    }
  };

  useEffect(() => {
    getUserData();
  }, []); // Run once on mount

  return (
    <UserState.Provider value={{ user, setUser, getUserData }}>
      <AppRouter />
    </UserState.Provider>
  );
}

export default App;
