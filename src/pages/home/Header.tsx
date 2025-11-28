import "./Header.css";

export default function Header() {
  return (
    <div>
      <div className="header">
        <h3 className="the"> THE </h3>
        <h3 className="cheese-grater">
          <span className="cheese">CHEESE</span>
          <span className="grater"> GR 
            <span className="grater-icon" />TER</span>
        </h3>
        <span className="best">SPA Best Publication in London 2025</span>

        <div className="menu-bar">
          <div></div>
          <span className="menu-item">Home</span>
          <span className="menu-item">News</span>
          <span className="menu-item">Humour</span>
          <span className="menu-item">Voices</span>
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
