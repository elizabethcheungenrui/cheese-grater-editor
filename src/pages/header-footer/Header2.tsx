import { Link } from "react-router-dom";

import "./Header2.css";

type HeaderProps = {
  isOpen: boolean;
  onMoreToggle: () => void;
};

export default function Header2({ isOpen, onMoreToggle }: HeaderProps) {

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

      <button              
          type="button"
          className="menu-item menu-more"
          onClick={onMoreToggle}
          aria-haspopup="true"        
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <h3>{isOpen ? "×" : "☰"}</h3>
      </button>

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
