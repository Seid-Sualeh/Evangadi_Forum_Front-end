import style from "./Footer.module.css";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import image from "../../Assets/Images/evangadi-logo-footer.png";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className={style["evangadi-footer"]}>
      <div className={style["footer-container"]}>
        {/* Column 1: Logo and Social Icons */}
        <div className={style["footer-column"]}>
          <img src={image} className={style["footer-logo"]} alt="footer-logo" />

          <div className={style["social-icons"]}>
            <a
              href="https://www.facebook.com/evangaditech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/evangaditech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiInstagramFill />
            </a>
            <a
              href="https://www.youtube.com/@EvangadiTech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Column 2 */}
        <div className={style["footer-column"]}>
          <h4 className={style["footer-heading"]}>Useful Links</h4>
          <a href="/how-it-works" className={style["footer-link"]}>
            How it works
          </a>
          <a
            href="https://www.evangadi.com/legal/terms"
            target="_blank"
            rel="noopener noreferrer"
            className={style["footer-link"]}
          >
            Terms of Service
          </a>
          <Link to="/PrivacyPolicy" className={style["footer-link"]}>
            Privacy policy
          </Link>
        </div>

        {/* Column 3 */}
        <div className={`${style["footer-column"]} ${style["contact"]}`}>
          <h5 className={style["footer-heading"]}>Contact Info</h5>
          <p className={style["contact-item"]}>Evangadi Networks</p>
          <a
            href="mailto:support@evangadi.com"
            className={`${style["footer-link"]} ${style["contact-item"]}`}
          >
            support@evangadi.com
          </a>
          <p className={style["contact-item"]}>+1-209-386-2702</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
