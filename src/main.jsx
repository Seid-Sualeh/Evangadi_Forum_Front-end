import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
 import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
    <Router>
      <App />
    </Router>
  </GoogleOAuthProvider>
);
