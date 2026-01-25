import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <div className="copyright">
        <p className="copyright-text">
          Copyright © 2004–{new Date().getFullYear()} The Cheese Grater
          Magazine, Students’ Union UCL
        </p>

        <div className="lizzie">
          <p className="lizzie-text">
            Website made in React + Supabase by Elizabeth Cheung
          </p>
          <p className="lizzie-text">
            Please direct any website issues to{" "}
            <a href="mailto:elizabeth.cheung.25@ucl.ac.uk">
              {" "}
              elizabeth.cheung.25@ucl.ac.uk
            </a>
          </p>
          <Link to="/editor" className="link">
            <p className="lizzie-text">Editor Login</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
