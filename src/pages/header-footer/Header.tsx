import { Link } from "react-router-dom";

import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h3 className="the"> THE </h3>
        <a href="https://cheese-grater-new.vercel.app" className="logo-link">
          <h3 className="cheese-grater">
            <span className="cheese">CHEESE </span>
            <span className="grater"> 
              GR   
              <span className="grater-icon" />
              TER
            </span>
          </h3>
        </a>
      </div>

      <span className="best">SPA Best Publication in London 2025</span>
    </header>
  );
}
