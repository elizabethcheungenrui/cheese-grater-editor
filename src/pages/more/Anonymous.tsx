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
        "Anonymous Form",
      ]} />

      <div className="more-styling">
        <div className="more-styling-text">
          <p>Work in Progress!! This one's a bit more complicated</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
