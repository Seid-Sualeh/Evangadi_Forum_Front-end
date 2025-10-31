import { useContext, useEffect, useState } from "react";
import styles from "./home.module.css";
import Questions from "../Question/Questions.jsx";
import Layout from "../../Layout/Layout.jsx";
import { Link } from "react-router-dom";
import { UserState } from "../../App.jsx";
import { io } from "socket.io-client";

function Home() {
  const { user } = useContext(UserState);
  const userName = String(user?.username || "Guest");
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    // ✅ Connect to backend socket
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to socket server ✅");
    });

    socket.on("onlineUsers", (count) => {
      setOnlineCount(count);
    });

    // cleanup
    return () => socket.disconnect();
  }, []);

  return (
    <Layout>
      <div className={styles.home_container}>
        <div className={styles.welcome_top}>
          Welcome back, <strong>{userName}</strong> 👋
          <p className={styles.online_info}>
            🟢 {onlineCount} user{onlineCount !== 1 ? "s" : ""} online 
          </p>
        </div>

        <div className={styles.ask_welcome_holder}>
          <div className={styles.ask_question}>
            <Link to="/ask" style={{ textDecoration: "none" }}>
              <button className={styles.ask_btn}>
                <span>ASK QUESTIONS</span>
              </button>
            </Link>
          </div>
        </div>

        <hr />

        <div className={styles.questions_list}>
          <Questions />
        </div>
      </div>
    </Layout>
  );
}

export default Home;
