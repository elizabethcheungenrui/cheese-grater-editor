import "./MoreMenu2.css";
import { Link } from "react-router-dom";
import { useState } from "react";

type MoreMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MoreMenu2({ isOpen }: MoreMenuProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    about: false,
    contact: false,
    resources: false,
  });
  
  if (!isOpen) return null;

  const toggle = (k: keyof typeof openSections) =>
    setOpenSections(p => ({ ...p, [k]: !p[k] }));

  return (
    <div className="more-menu-mobile">
      <div className="menu-inner">
        <Link to="/" className="more-menu-text">Home</Link>
        <Link to="/news" className="more-menu-text">News</Link>
        <Link to="/humour" className="more-menu-text">Humour</Link>
        <Link to="/voices" className="more-menu-text">Voices</Link>
        <Link to="/podcast" className="more-menu-text">Podcast</Link>
        <a href="https://womenswrongs.cheesegratermagazine.org" className="more-menu-text">Women's Wrongs</a>  
        <Link to="/print" className="more-menu-text yellow">Print Edition</Link>
        <a href="https://us17.campaign-archive.com/home/?u=65bd5c7a770205040fd2e9e8a&id=9679db51c3" target="_blank" className="more-menu-text yellow">The Digestive</a>

        <button
          className="more-menu-text section-header"
          onClick={() => toggle("about")}
          aria-expanded={openSections.about}
        >
          About Us! <span className="arrow">⤓</span>
        </button>

        {openSections.about && (
          <>
            <Link to="/who-we-are" className="more-menu-text-sub">Who We Are</Link>
            <Link to="/get-involved" className="more-menu-text-sub">Get Involved!</Link>
            <Link to="/awards" className="more-menu-text-sub">Awards and Accolades</Link>
            <Link to="/past-editors" className="more-menu-text-sub">Past Editors</Link>
            <Link to="/life-members" className="more-menu-text-sub">Honorary Life Members</Link>
          </>
        )}
        
        <button
          className="more-menu-text section-header"
          onClick={() => toggle("contact")}
          aria-expanded={openSections.contact}
        >
          Contact <span className="arrow">⤓</span>
        </button>

        {openSections.contact && (
          <>        
            <Link to="/contact-us" className="more-menu-text-sub">Contact Us</Link>
            <Link to="/anonymous-form" className="more-menu-text-sub">Anonymous Form</Link>
          </>
        )}

        <button
          className="more-menu-text section-header"
          onClick={() => toggle("resources")}
          aria-expanded={openSections.resources}
        >
          Member Resources <span className="arrow">⤓</span>
        </button>
        
        {openSections.resources && (
          <>
            <Link to="/training-style" className="more-menu-text-sub">Training and Style Guide</Link>
            <Link to="/help-welfare" className="more-menu-text-sub">Help and Welfare</Link>
          </>
        )}
      </div>
    </div>
  );
}
