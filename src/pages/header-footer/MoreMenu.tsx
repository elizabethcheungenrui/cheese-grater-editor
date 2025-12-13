import { useEffect, useRef } from "react";
import "./MoreMenu.css";
import { Link } from "react-router-dom";

export default function MoreMenu(
  {isOpen, onClose }: 
  {isOpen: boolean, onClose: () => void}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={`more-menu ${isOpen ? "open" : ""}`}
      onClick={(e) => e.stopPropagation()}>
      <div className="menu-inner">
        <div className="more-submenu">
          <h3>About Us!</h3>          
  
          <Link to="/who-we-are" className="more-menu-text">Who We Are</Link>
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
      </div>
    </div>
  );
}
