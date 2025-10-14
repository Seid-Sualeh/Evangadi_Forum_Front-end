import { useContext } from "react";
import styles from "./home.module.css";
import Questions from "../Question/Questions.jsx";
import Layout from "../../Layout/Layout.jsx";
import { Link } from "react-router-dom";
import { UserState } from "../../App.jsx";

function Home() {
  const { user } = useContext(UserState);
  const userName = String(user?.username || "Guest");

  return (
    <Layout>
      <div className={styles.home_container}>
   
        <div className={styles.welcome_top}>
          Welcome back, <strong>{userName}</strong> 👋
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
