import { useState } from "react";
import Header from "../header-footer/Header";
import MoreMenu from "../header-footer/MoreMenu"
import MoreTitle from "./MoreTitle";
import Footer from "../header-footer/Footer";

import "./MoreStyling.css";

export default function Anonymous() {
  const [moreOpen, setMoreOpen] = useState(false);
  
  return (
    <div className="page-container">
      <Header onMoreClick={() => setMoreOpen(!moreOpen)}/>      
      <MoreMenu isOpen={moreOpen} onClose={() => setMoreOpen(false)} />

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
