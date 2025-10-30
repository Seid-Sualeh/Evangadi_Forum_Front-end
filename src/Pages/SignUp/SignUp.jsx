import { useState } from "react";
import classes from "./signUp.module.css";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../utility/axios";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // ✅ new import

function Signup({ onSwitch }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  function validateUserData(fname, lname, username) {
    const isValidFname = /^[A-Za-z]{2,}$/.test(fname.trim());
    const isValidLname = /^[A-Za-z]{2,}$/.test(lname.trim());
    const isValidUserName = /^[A-Za-z0-9]+$/.test(username.trim());
    const isValidUsernameLength = username.trim().length > 1;
    return (
      isValidFname && isValidLname && isValidUserName && isValidUsernameLength
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateUserData(
        formData.firstName,
        formData.lastName,
        formData.username
      )
    ) {
      return await Swal.fire({
        title: "Error",
        text: "Please enter a valid first, last and username.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    try {
      const response = await axiosInstance.post("user/register", {
        username: formData.username,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        await Swal.fire({
          title: "Success!",
          text: "User registered successfully! Logging in...",
          icon: "success",
          confirmButtonText: "OK",
        });

        const loginResponse = await axiosInstance.post("user/login", {
          usernameOrEmail: formData.email,
          password: formData.password,
        });

        if (loginResponse.status === 200) {
          localStorage.setItem("Evangadi_Forum", loginResponse.data.token);
          window.location.href = "/";
        } else {
          setError(loginResponse.data.msg || "Login failed.");
        }
      }
    } catch (err) {
      setError(err.response?.data?.Msg || "Error submitting the form.");
      await Swal.fire({
        title: "Error",
        text: err.response?.data?.Msg || "Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // ✅ Google Signup handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email, sub } = decoded;

      // Send to backend for registration/login
      const res = await axiosInstance.post("user/google-login", {
        email,
        username: name.replace(/\s/g, "").toLowerCase(),
        googleId: sub,
      });

      if (res.status === 200) {
        localStorage.setItem("Evangadi_Forum", res.data.token);
        await Swal.fire({
          title: "Welcome!",
          text: "Google login successful!",
          icon: "success",
          confirmButtonText: "OK",
        });
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Google login failed", error);
      Swal.fire({
        title: "Error",
        text: "Google login failed. Please try again.",
        icon: "error",
      });
    }
  };

  const handleGoogleError = () => {
    Swal.fire({
      title: "Error",
      text: "Google login was unsuccessful.",
      icon: "error",
    });
  };

  return (
    <div className={classes.formcontainer}>
      <h2>Join the network</h2>
      <p className="signin-text">
        Already have an account?{" "}
        <a
          onClick={onSwitch}
          style={{ cursor: "pointer", color: "var(--primary-color)" }}
        >
          Sign in
        </a>
      </p>

      {error && <p className={classes.error}>{error}</p>}
      {success && <p className={classes.success}>{success}</p>}

      <form method="POST" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <div className={classes.nameinputs}>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
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

        <div style={{ padding: "5px", fontSize: "14px" }}>
          I agree to the <Link to="/privacyPolicy">privacy policy</Link> and{" "}
          <Link to="/terms">terms of service</Link>.
        </div>

        <button type="submit" className={classes.submitbtn}>
          Agree and Join
        </button>
      </form>

      {/* ✅ Google Login Section */}
      <div style={{ marginTop: "0px", textAlign: "center" }}>
        <p>or</p>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>

      <p className={classes.signintext}>
        <a
          onClick={onSwitch}
          style={{ cursor: "pointer", color: "var(--primary-color)" }}
        >
          Already have an account?
        </a>
      </p>
    </div>
  );
}

export default Signup;
