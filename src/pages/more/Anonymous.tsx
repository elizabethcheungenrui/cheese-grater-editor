import MoreTitle from "./MoreTitle";
import Footer from "../header-footer/Footer";

import "./MoreStyling.css";
import { useIsMobile } from "../../hooks/useIsMobile";
import HeaderMobile from "../header-footer/HeaderMobile";
import HeaderDesktop from "../header-footer/HeaderDesktop";

export default function Anonymous() {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}

      <MoreTitle headings={[
        "Send us a tip",
      ]} />

      <div className="more-styling">
        <div className="more-styling-text anonymous">
          <p>If you have something you’d like to share anonymously, fill in the form below. <b>We always protect the identity of our sources.</b></p>
          <p><b>DISCLAIMER:</b> Submissions are anonymous to us. They are handled by Google Forms. <br />If you are concerned about traceability, or you feel your submission could put you at risk:
            <ul>
              <li>Do <b>not</b> use a university email,</li>
              <li>Avoid uploading files with metadata,</li>
              <li>Consider using a personal device and network.</li>
            </ul>
          </p>
          <iframe 
            src="http://cheesegratermagazine.org"
            width="80%"
            height="auto"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
