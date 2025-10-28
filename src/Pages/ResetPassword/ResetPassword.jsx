import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utility/axios";
import Swal from "sweetalert2";
import styles from "./resetPassword.module.css";

export default function ResetPassword() {
  const { token } = useParams(); // get token from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return Swal.fire({
        title: "Error",
        text: "Please fill in all fields.",
        icon: "error",
      });
    }

    if (password !== confirmPassword) {
      return Swal.fire({
        title: "Mismatch",
        text: "Passwords do not match.",
        icon: "warning",
      });
    }

    try {
      setLoading(true);
    const res = await axiosInstance.post(`/user/reset-password/${token}`, {
     
      password,
    });

      if (res.status === 200) {
        Swal.fire({
          title: "✅ Password Reset Successful",
          text: "You can now log in with your new password.",
          icon: "success",
        });
        navigate("/auth");
      } else {
        Swal.fire({
          title: "Error",
          text: res.data.msg || "Something went wrong.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.msg ||
          "Failed to reset password. Please try again later.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Reset Password 🔒</h2>
        <p className={styles.text}>Enter your new password below.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className={styles.backToLogin}>
          <Link to="/auth">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
