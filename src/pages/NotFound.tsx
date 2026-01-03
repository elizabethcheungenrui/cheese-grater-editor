import { useIsMobile } from "../hooks/useIsMobile";
import Footer from "./header-footer/Footer";
import HeaderDesktop from "./header-footer/HeaderDesktop";
import HeaderMobile from "./header-footer/HeaderMobile";

export default function NotFound() {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}

      <h1>404 Not Found</h1>

      <Footer />
    </div>
  );
}
