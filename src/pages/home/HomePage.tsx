import { useIsMobile } from "../../hooks/useIsMobile";
import HeaderMobile from "../header-footer/HeaderMobile";
import HeaderDesktop from "../header-footer/HeaderDesktop";
import Home from "./Home";
import HomeMobile from "./HomeMobile";
import BestPub2025 from "./BestPub2025";
import ArticleList from "./ArticleList";
import Podcast from "./Podcast"
import Newsletter from "./Newsletter";
import Footer from "../header-footer/Footer";

import "./HomePage.css";
import GraphicsCarousel from "./GraphicsCarousel";

export default function HomePage() {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}

      <div className="home-wrapper">
        {isMobile ? (<HomeMobile />) : (<Home />)}
      </div>
      <BestPub2025 />
      <ArticleList section="News" />
      <Podcast />
      <ArticleList section="Humour" />
      <GraphicsCarousel />
      <Newsletter />
      <ArticleList section="Voices" />
      <Footer />
    </div>
  );
}
