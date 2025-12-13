import { useState } from "react";
import Footer from "../header-footer/Footer";
import Header from "../header-footer/Header";
import MoreMenu from "../header-footer/MoreMenu"
import Title from "./Title";

export default function PrintEdition() {
  const [moreOpen, setMoreOpen] = useState(false);
  
  return (
    <div className="page-container">
      <Header onMoreClick={() => setMoreOpen(!moreOpen)}/>      
      <MoreMenu isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
      <Title sectionUpper={"print"} />
      <p>SORRY WIP</p>
      <Footer />
    </div>
  );
}
