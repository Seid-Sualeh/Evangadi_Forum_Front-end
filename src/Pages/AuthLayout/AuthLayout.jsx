import { useState } from "react";
import styles from "./authLayout.module.css"; 
import Login from "../Login/Login.jsx";
import SignUp from "../SignUp/SignUp.jsx";
import About from "../About/About.jsx";
import Layout from "../../Layout/Layout.jsx";

export default function AuthLayout() {
  const [isLogin, setisLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

 
  const toggleForm = () => {
    setIsTransitioning(true); // Start the transition b/c starting  with true
    setTimeout(() => {
       setisLogin((prev) => !prev); 
      setIsTransitioning(false); 
    }, 500); 
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.inner_container}>
          <div
            className={`${styles.formContainer} ${
              isTransitioning ? styles.fadeOut : styles.fadeIn
            }`}
          >
            {isLogin ? (
              <Login onSwitch={toggleForm} />
            ) : (
              <SignUp onSwitch={toggleForm} />
            )}
          </div>
          <div className={styles.about}>
            <About />
          </div>
        </div>
      </div>
    </Layout>
  );
}
