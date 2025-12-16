import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import HeaderMobile from "../header-footer/HeaderMobile";
import Header from "../header-footer/Header";
import MoreMenu from "../header-footer/MoreMenu"
import Home from "./Home";
import HomeMobile from "./HomeMobile";
import BestPub2025 from "./BestPub2025";
import ArticleList from "./ArticleList";
import Newsletter from "./Newsletter";
import Footer from "../header-footer/Footer";

import "./HomePage.css";

export default function HomePage() {
  const [moreOpen, setMoreOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return ( 
    isMobile ? (
      <div className="page-mobile">
      {/* <HeaderMobile onMoreClick={() => setMoreOpen(!moreOpen)} /> */}
        <HeaderMobile />
        <div className="home-wrapper">
          <HomeMobile />
        </div>
        <BestPub2025 />
        <ArticleList section="News" />
        <ArticleList section="Humour" />
        <Newsletter />
        <ArticleList section="Voices" />
        <Footer />
      </div>
    ) : (
      <div className="page-desktop">
        <Header onMoreClick={() => setMoreOpen(!moreOpen)} />
        <MoreMenu isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
        <div className="home-wrapper">
          <Home />
        </div>
        <BestPub2025 />
        <ArticleList section="News" />
        <ArticleList section="Humour" />
        <Newsletter />
        <ArticleList section="Voices" />
        <Footer />
      </div>
    )
  );
}
