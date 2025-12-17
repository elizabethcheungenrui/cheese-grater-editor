import Footer from "../header-footer/Footer";
import List from "./List";
import Title from "./Title";
import { useIsMobile } from "../../hooks/useIsMobile";
import HeaderMobile from "../header-footer/HeaderMobile";
import HeaderDesktop from "../header-footer/HeaderDesktop";

export default function SectionList({ section }: { section: string }) {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}
      <Title sectionUpper={section} />
      <List section={section} />
      <Footer />
    </div>
  );
}
