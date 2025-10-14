import { useState } from "react";
import { axiosInstance } from "../../utility/axios";
import Swal from "sweetalert2";
import styles from "./forgetPassword.module.css";
import { Link } from "react-router-dom";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return Swal.fire({
        title: "Error",
        text: "Please enter your registered email address.",
        icon: "error",
      });
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/user/forgot-password", {
        email,
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Check Your Email 📩",
          text: "We’ve sent a password reset link to your email address.",
          icon: "success",
        });
        setEmail("");
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.msg || "Something went wrong.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.msg ||
          "Failed to send password reset email. Please try again later.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Forgot Password?</h2>
        <p className={styles.text}>
          Enter your registered email address, and we’ll send you a link to
          reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className={styles.backToLogin}>
          <Link to="/auth">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
