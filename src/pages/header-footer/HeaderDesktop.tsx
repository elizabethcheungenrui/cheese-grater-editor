import { useState } from "react";
import Header from "../header-footer/Header";
import MoreMenu from "../header-footer/MoreMenu"

export default function HeaderDesktop() {
  const [moreOpen, setMoreOpen] = useState(false);
  
  return (
    <>
      <Header onMoreToggle={() => setMoreOpen(!moreOpen)} />
      <MoreMenu isOpen={moreOpen} onClose={() => setMoreOpen(false)} /> 
    </>
  );
}
