import { Link } from "react-router-dom";

import "./HeaderMobile.css";

export default function HeaderMobile({ onMoreClick }: { onMoreClick: () => void }) {

  return (
    <div className="header-mobile">
      <div className="logo">
        <h3 className="the"> THE </h3>
        <Link to="/" className="logo-link">
          <h3 className="cheese-grater">
            <span className="cheese">CHEESE </span>
            <span className="grater"> 
              GR   
              <span className="grater-icon" />
              TER
            </span>
          </h3>
        </Link>
      </div>

      {/*<div className="menu-bar hide-on-mobile">
        <Link to="/" className="menu-item">Home</Link>
        <Link to="/news" className="menu-item news">News</Link>
        <Link to="/humour" className="menu-item humour">Humour</Link>
        <Link to="/voices" className="menu-item voices">Voices</Link>
        <Link to="/podcast" className="menu-item">Podcast</Link>

        <a href="https://womenswrongs.cheesegratermagazine.org" className="menu-item">Women's Wrongs</a>  

        <span 
          className="menu-item"
          data-more-button
          onClick={(e) => {
            e.stopPropagation(); 
            onMoreClick();
          }}> More
        </span>

        <Link to="/print" className="menu-item print-edition">Print Edition</Link>

        <a href="https://us17.campaign-archive.com/home/?u=65bd5c7a770205040fd2e9e8a&id=9679db51c3" target="_blank" className="menu-item print-edition">The Digestive</a>
      </div>*/}
    </div>
  );
}
