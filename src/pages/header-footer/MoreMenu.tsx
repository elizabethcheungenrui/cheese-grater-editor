import "./MoreMenu.css";
import { Link } from "react-router-dom";

type MoreMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MoreMenu({ isOpen, onClose }: MoreMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="more-menu open">
      <div className="menu-inner">
        <div className="more-submenu">
          <h3>About Us!</h3>          
  
          <Link to="/about" className="more-menu-text">Who We Are</Link>
          <Link to="/get-involved" className="more-menu-text">Get Involved!</Link>
          <Link to="/awards" className="more-menu-text">Awards and Accolades</Link>
          <Link to="/past-editors" className="more-menu-text">Past Editors</Link>
          <Link to="/life-members" className="more-menu-text">Honorary Life Members</Link>
        </div>

        <div className="more-submenu">
          <h3>Contact</h3>
          <Link to="/contact-us" className="more-menu-text">Contact Us</Link>
          <Link to="/anonymous-form" className="more-menu-text">Anonymous Form</Link>
        </div>
        
        <div className="more-submenu">
          <h3>Member Resources</h3>
          <Link to="/training-style" className="more-menu-text">Training and Style Guide</Link>
          <Link to="/help-welfare" className="more-menu-text">Help and Welfare</Link>
        </div>
        
        <div className="more-submenu">
          <button
            className="more-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <h3 className="x">&#x2718;</h3>
          </button>
        </div>
      </div>
      <Link to="/archive" className="more-menu-text">
        <span className="time-machine">The Time Machine</span>
      </Link>
    </div>
  );
}
