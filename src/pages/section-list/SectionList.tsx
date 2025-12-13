import { useState } from "react";
import Footer from "../header-footer/Footer";
import Header from "../header-footer/Header";
import MoreMenu from "../header-footer/MoreMenu"
import List from "./List";
import Title from "./Title";

export default function SectionList({ section }: { section: string }) {
  const [moreOpen, setMoreOpen] = useState(false);
  
  return (
    <div className="page-container">
      <Header onMoreClick={() => setMoreOpen(!moreOpen)}/>      
      <MoreMenu isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
      <Title sectionUpper={section} />
      <List section={section} />
      <Footer />
    </div>
  );
}
