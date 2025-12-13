import { Link } from "react-router-dom";

import "./Header.css";

export default function Header() {
  return (
    <div>
      <div className="header">
        <h3 className="the"> THE </h3>
        <Link to="/" className="logo-link">
          <h3 className="cheese-grater">
            <span className="cheese">CHEESE</span>
            <span className="grater"> GR 
              <span className="grater-icon" />TER</span>
          </h3>
        </Link>
        <span className="best">SPA Best Publication in London 2025</span>

        <div className="menu-bar">
          <div></div>
          <Link to="/" className="menu-item">Home</Link>
          <Link to="/news" className="menu-item news">News</Link>
          <Link to="/humour" className="menu-item humour">Humour</Link>
          <Link to="/voices" className="menu-item voices">Voices</Link>
          <span className="menu-item">Podcast</span>
          <span className="menu-item">Women's Wrongs</span>
          <span className="menu-item">More</span>
          <span className="menu-item print-edition">Print Edition</span>
          <span className="menu-item print-edition">The Digestive</span>
        </div>
      </div>
    </div>
  );
}
