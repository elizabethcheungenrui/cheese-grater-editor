import { useState } from "react";
import Footer from "../header-footer/Footer";
import Header from "../header-footer/Header";
import MoreMenu from "../header-footer/MoreMenu"
import List from "./List";
import Title from "./Title";
import { useIsMobile } from "../../hooks/useIsMobile";
import HeaderMobile from "../header-footer/HeaderMobile";

export default function SectionList({ section }: { section: string }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    isMobile? (
      <div className="page-mobile">
        <HeaderMobile />      
        <Title sectionUpper={section} />
        <List section={section} />
        <Footer />
      </div>
    ) : (
      <div className="page-desktop">
        <Header onMoreClick={() => setMoreOpen(!moreOpen)}/>      
        <MoreMenu isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
        <Title sectionUpper={section} />
        <List section={section} />
        <Footer />
      </div>
    )
  );
}
