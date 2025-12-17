import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header2 from "../header-footer/Header2";
import MoreMenu2 from "../header-footer/MoreMenu2"

import "./HeaderMobile.css";

export default function HeaderMobile() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);
  
  return (
    <div className="header-mobile-wrapper">
      <Header2 isOpen={moreOpen} onMoreToggle={() => setMoreOpen(!moreOpen)} />
      <MoreMenu2 isOpen={moreOpen} onClose={() => setMoreOpen(false)} /> 
    </div>
  );
}
