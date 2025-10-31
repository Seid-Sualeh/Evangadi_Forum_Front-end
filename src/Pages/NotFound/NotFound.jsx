
import  image from "../../Assets/Images/404.png"; // Ensure you have a 404.png image in this path

import { Link } from "react-router-dom";
import styles from "./NotFound.module.css"; // we’ll create this CSS

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>

      <img
        src={image}
        alt="404 illustration"
        className={styles.illustration}
      />
      <Link to="/" className={styles.homeButton}>
        ← Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
