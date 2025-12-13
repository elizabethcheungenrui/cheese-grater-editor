import Header from "../header-footer/Header";
import Home from "./Home";
import BestPub2025 from "./BestPub2025";
import ArticleList from "./ArticleList";
import Newsletter from "./Newsletter";
import Footer from "../header-footer/Footer";

import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="page-container">
      <Header />

      <div className="home-wrapper">
        <Home />
      </div>

      <BestPub2025 />
      <ArticleList section="News" />
      <ArticleList section="Humour" />
      <Newsletter />
      <ArticleList section="Graphics" />
      <ArticleList section="Voices" />
      <Footer />
    </div>
  );
}
