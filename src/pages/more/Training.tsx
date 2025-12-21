import MoreTitle from "./MoreTitle";
import Footer from "../header-footer/Footer";

import "./MoreStyling.css";
import { useIsMobile } from "../../hooks/useIsMobile";
import HeaderMobile from "../header-footer/HeaderMobile";
import HeaderDesktop from "../header-footer/HeaderDesktop";

export default function Training() {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}

      <MoreTitle headings={[
        "Resources Hub",
      ]} />

      <div className="more-styling">
        <div className="more-styling-text">
          <p>This page provides guidance and resources for editors, writers, and Society members.</p>
        </div>
        
        <div className="more-styling-text">
          <h3>Editor Training Programme</h3>
          <p>Presentation slides from our editor training programme.</p>
          <a href="https://drive.google.com/drive/folders/1Jqscv5xGLHTFH_iVZhu-FMd25no7GcpG?usp=drive_link" target="_blank">Click here</a>
        </div>
        
        <div className="more-styling-text">
          <h3>Cover Sheet and Templates</h3>
          <p>All article drafts should include our official cover sheet so we can keep track of progress. Writers are strongly encouraged to follow our news template and review our right of reply guidance. Please make a copy of this in Google Drive and write your story on Google Docs.</p>
          <a href="https://docs.google.com/document/d/1_1Iayunjkc8lNHpADzA3EIOZ4k9pnHEZkFcq2Bk3YEw/edit?tab=t.0" target="_blank">Copy to Drive</a>
        </div>
        
        <div className="more-styling-text">
          <h3>Style Guide</h3>
          <p><i>The Cheese Grater</i> takes very seriously its responsibility to maintain high editorial standards. Part of this responsibility is to make sure that we know how to spell and punctuate correctly and write in a consistent manner. It is the task of both writers and subeditors to ensure that all articles produced by <i>The Cheese Grater</i> adhere to this guide. Exceptions include Humour and Satire, which may take some artistic liberties, Voices and Letters, where writers may enjoy greater stylistic freedoms, and <i>Women’s Wrongs</i>, where this guide does not apply.</p>

          <p>This guide will take previous editions of the style guide as a starting point and refer to external guides where appropriate. It will also set a standard for the structure of articles and provide guidance on picture sourcing.</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <iframe
            src="/pdfs/Cheese-Grater-Style-Guide-Nov-2024.pdf"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
