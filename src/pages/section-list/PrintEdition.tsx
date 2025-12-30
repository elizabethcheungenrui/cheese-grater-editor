import Footer from "../header-footer/Footer";
import Title from "./Title";
import { useIsMobile } from "../../hooks/useIsMobile";
import HeaderMobile from "../header-footer/HeaderMobile";
import HeaderDesktop from "../header-footer/HeaderDesktop";
import "./PrintEdition.css"

export default function PrintEdition() {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}
      <Title sectionUpper={"print"} />
      <div className="print-edition-page">
        <p>Hi</p>
        
        <p>Hi</p>
        <p>Hi</p>
        <p>Hi</p>
      </div>
      <Footer />
    </div>
  );
}
