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
    </div>
  );
}
