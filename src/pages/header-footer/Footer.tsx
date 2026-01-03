import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      
      <div className="contact">
        
        {/* LEFT COLUMN */}
        <div className="column">
          <h3 className="header">Our Standards</h3>
          <p className="ipso"><em>The Cheese Grater</em> holds itself to the highest standards set out in the IPSO Editor's Code of Practice. 
            If you spot a mistake, let us know at 
            <a href="mailto:editor@cheesegratermagazine.org"> editor@cheesegratermagazine.org</a>.
            If you wish to make a complaint, you can do so <a href="https://studentsunionucl.org/webform/student-media-complaint" target="_blank">here</a>.
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="column">
          <h3 className="header">Mailing Address</h3>
          <p>The Cheese Grater Magazine Society
          <br/>C/O Students' Union UCL
          <br/>2/F Bloomsbury Theatre
          <br/>15 Gordon St
          <br/>London WC1H 0AH
          <br/>We accept fan mail, just no clothing of the used variety.</p>
        </div>

      </div>

      <div className="copyright">
        <p className="copyright-text">Copyright © 2004–{new Date().getFullYear()} The Cheese Grater Magazine, Students’ Union UCL</p>

        <div className="lizzie">
          <p className="lizzie-text">Website made in React + Supabase by Elizabeth Cheung</p>
          <p className="lizzie-text">Please direct any website issues to <a href="mailto:elizabeth.cheung.25@ucl.ac.uk"> elizabeth.cheung.25@ucl.ac.uk</a></p>
          <Link to="/editor" className="link"><p className="lizzie-text">Editor Login</p></Link>
        </div>
      </div>
    </div>
  );
}
