// import { useState } from "react";
// import { axiosInstance } from "../../utility/axios.js";
// import classes from "./login.module.css";
// import { Link, Navigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";

// function Login({ onSwitch }) {
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     usernameOrEmail: "",
//     password: "",
//   });

//   // ✅ Google Client ID from your Google Cloud Console
//   const clientId = import.meta.env.VITE_CLIENT_ID;

//   // ✅ Check token before rendering
//   const token = localStorage.getItem("Evangadi_Forum");
//   if (token) {
//     return <Navigate to="/" replace />;
//   }

//   // ✅ Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // ✅ Toggle password visibility
//   const handleTogglePassword = () => {
//     setShowPassword((prev) => !prev);
//   };

//   // ✅ Normal email/username login
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axiosInstance.post("/user/Login", {
//         usernameOrEmail: formData.usernameOrEmail,
//         password: formData.password,
//       });

//       if (response.status === 200) {
//         localStorage.setItem("Evangadi_Forum", response.data.token);
//         setSuccess("Login successful! Redirecting...");
//         setError(null);

//         await Swal.fire({
//           title: "Success!",
//           text: "User logged in successfully!",
//           icon: "success",
//           confirmButtonText: "OK",
//         });

//         window.location.href = "/";
//       } else {
//         throw new Error(response.data.msg || "Login failed");
//       }
//     } catch (err) {
//       setError(err.response?.data?.msg || "Error logging in.");
//       setSuccess(null);
//       await Swal.fire({
//         title: "Error",
//         text: err.response?.data?.msg || "Please try again.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   // ✅ Handle Google login success
//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const decoded = jwtDecode(credentialResponse.credential);
//       console.log("✅ Google User:", decoded);

//       // Send Google user data to backend
//       const response = await axiosInstance.post("/user/google-login", {
//         email: decoded.email,
//         username: decoded.name,
//         googleId: decoded.sub,
//       });

//       localStorage.setItem("Evangadi_Forum", response.data.token);

//       await Swal.fire({
//         title: "Success!",
//         text: "Logged in with Google successfully!",
//         icon: "success",
//         confirmButtonText: "OK",
//       });

//       window.location.href = "/";
//     } catch (error) {
//       console.error("❌ Google login error:", error);
//       await Swal.fire({
//         title: "Error",
//         text: "Google login failed. Try again.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   const handleGoogleError = () => {
//     Swal.fire({
//       title: "Error",
//       text: "Google sign-in failed. Please try again.",
//       icon: "error",
//       confirmButtonText: "OK",
//     });
//   };

//   return (
//     <GoogleOAuthProvider clientId={clientId}>
//       <div className={classes.formcontainer}>
//         <div className={classes.innerContainer}>
//           <div className={classes.heading}>
//             <h2 className={classes.title}>Login to your account</h2>
//             <p className={classes.signuptext}>
//               Don't have an account?{" "}
//               <a
//                 onClick={onSwitch}
//                 style={{ cursor: "pointer", color: "var(--primary-color)" }}
//               >
//                 create a new account
//               </a>
//             </p>
//             {error && (
//               <p className={classes.error} style={{ marginBottom: "10px" }}>
//                 {error}
//               </p>
//             )}
//             {success && <p className={classes.success}>{success}</p>}
//           </div>

//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               name="usernameOrEmail"
//               placeholder="User name or Email"
//               value={formData.usernameOrEmail}
//               onChange={handleChange}
//               required
//             />

//             <div className={classes.passwordinput}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={handleTogglePassword}
//                 style={{
//                   background: "transparent",
//                   border: "none",
//                   cursor: "pointer",
//                 }}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>

//             <p className={classes.forgotpasswordtext}>
//               <Link to="/forgetPass">Forgot password?</Link>
//             </p>

//             <button type="submit" className={classes.submitbtn}>
//               Login
//             </button>
//           </form>

//           {/* ✅ Google Login Section */}
//           <div style={{ textAlign: "center", marginTop: "10px" }}>
//             <p style={{ color: "#666" }}>or</p>
//             <GoogleLogin
//               onSuccess={handleGoogleSuccess}
//               onError={handleGoogleError}
//               useOneTap
//             />
//           </div>
//         </div>
//       </div>
//     </GoogleOAuthProvider>
//   );
// }

// export default Login;










import { useState } from "react";
import { axiosInstance } from "../../utility/axios.js";
import classes from "./login.module.css";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login({ onSwitch }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  // Google Client ID
  const clientId = import.meta.env.VITE_CLIENT_ID;

  // ✅ Check token before rendering
  const token = localStorage.getItem("Evangadi_Forum");
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggle password visibility
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  // Normal login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Login data:", formData);
    
const payload = formData.usernameOrEmail.includes("@")
  ? { email: formData.usernameOrEmail, password: formData.password }
  : { username: formData.usernameOrEmail, password: formData.password };

const response = await axiosInstance.post("/user/login", payload);

console.log("Token from backend:", response.data.token);

      localStorage.setItem("Evangadi_Forum", response.data.token);
      setSuccess("Login successful! Redirecting...");
      setError(null);

      await Swal.fire({
        title: "Success!",
        text: "User logged in successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.msg || "Error logging in.");
      setSuccess(null);

      await Swal.fire({
        title: "Error",
        text: err.response?.data?.msg || "Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google user:", decoded);

      const response = await axiosInstance.post("/user/google-login", {
        email: decoded.email,
        username: decoded.name,
        googleId: decoded.sub,
      });

      localStorage.setItem("Evangadi_Forum", response.data.token);

      await Swal.fire({
        title: "Success!",
        text: "Logged in with Google successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      window.location.href = "/";
    } catch (err) {
      console.error("Google login error:", err);
      await Swal.fire({
        title: "Error",
        text: "Google login failed. Try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleGoogleError = () => {
    Swal.fire({
      title: "Error",
      text: "Google sign-in failed. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className={classes.formcontainer}>
        <div className={classes.innerContainer}>
          <div className={classes.heading}>
            <h2 className={classes.title}>Login to your account</h2>
            <p className={classes.signuptext}>
              Don't have an account?{" "}
              <span
                onClick={onSwitch}
                style={{ cursor: "pointer", color: "var(--primary-color)" }}
              >
                Create a new account
              </span>
            </p>
            {error && <p className={classes.error}>{error}</p>}
            {success && <p className={classes.success}>{success}</p>}
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              required
            />

            <div className={classes.passwordinput}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p className={classes.forgotpasswordtext}>
              <Link to="/forgetPass">Forgot password?</Link>
            </p>

            <button type="submit" className={classes.submitbtn}>
              Login
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <p style={{ color: "#666" }}>or</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;


