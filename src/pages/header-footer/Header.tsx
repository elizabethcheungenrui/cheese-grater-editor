import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h3 className="the"> THE </h3>
        <a href="https://cheesegratermagazine.org" className="logo-link">
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
    </header>
  );
}
