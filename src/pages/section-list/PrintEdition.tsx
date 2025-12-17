import Footer from "../header-footer/Footer";
import Title from "./Title";
import { useIsMobile } from "../../hooks/useIsMobile";
import HeaderMobile from "../header-footer/HeaderMobile";
import HeaderDesktop from "../header-footer/HeaderDesktop";

export default function PrintEdition() {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}
      <Title sectionUpper={"print"} />
      <p>SORRY WIP</p>
      <Footer />
    </div>
  );
}
