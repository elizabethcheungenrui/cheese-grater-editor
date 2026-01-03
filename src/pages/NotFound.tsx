import { useIsMobile } from "../hooks/useIsMobile";
import Footer from "./header-footer/Footer";
import HeaderDesktop from "./header-footer/HeaderDesktop";
import HeaderMobile from "./header-footer/HeaderMobile";
import "./NotFound.css";

export default function NotFound() {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}
      <div className="not-found">
        <h1>404 Not Found</h1>
        <p>Either we've cocked up and routed this link to something that doesn't exist, or you just aren't that good at typing in links yourself. Maybe try searching up what you want instead?</p>
      </div>
      <Footer />
    </div>
  );
}
