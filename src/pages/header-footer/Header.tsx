import { Link } from "react-router-dom";

import "./Header.css";

type HeaderProps = {
  onMoreToggle: () => void;
};

export default function Header({ onMoreToggle }: HeaderProps) {

  return (
    <header className="header">
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

      <span className="best">SPA Best Publication in London 2025</span>

      <nav className="menu-bar" aria-label="Primary Navigation">
        <Link to="/" className="menu-item">Home</Link>
        <Link to="/news" className="menu-item news">News</Link>
        <Link to="/humour" className="menu-item humour">Humour</Link>
        <Link to="/voices" className="menu-item voices">Voices</Link>
        <Link to="/podcast" className="menu-item podcast">Podcast</Link>

        <a href="https://womenswrongs.cheesegratermagazine.org" target="_blank" className="menu-item">Women's Wrongs</a>  

        <button
          type="button"
          className="menu-item menu-more"
          onClick={onMoreToggle}
          aria-haspopup="true"
          aria-expanded={false /* parent controls this */}
        >
          More
        </button>

        <Link to="/print" className="menu-item print-edition">Print Edition</Link>

        <a href="https://us17.campaign-archive.com/home/?u=65bd5c7a770205040fd2e9e8a&id=9679db51c3" target="_blank" className="menu-item print-edition">The Digestive</a>
      </nav>
    </header>
  );
}
