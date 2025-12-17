import MoreTitle from "./MoreTitle";
import Footer from "../header-footer/Footer";

import "./MoreStyling.css";
import { Link } from "react-router-dom";
import HeaderMobile from "../header-footer/HeaderMobile";
import HeaderDesktop from "../header-footer/HeaderDesktop";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function ContactUs() {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}

      <MoreTitle headings={[
        "Contact Us"
      ]} />

      <div className="more-styling">
        <p>Got a story? Get in touch with our journalists via our <a href="https://instagram.com/uclcheesegrater" target="_blank">socials</a>, email (listed on the “Who We Are” page), or using our anonymous webform.</p>
        
        <div className="more-styling-text">
          <h3>Pitches</h3>
          <p>If you have an idea for the publication we would love to hear from you! As a membership publication, we can only accept pitches for news and satire stories from members of the Society. You can get your year-long membership <a href="https://studentsunionucl.org/clubs-societies/cheese-grater-magazine" target="_blank">here</a> for the low, low price of just £8.</p>

          <p>The good news is that you do not need a membership to pitch opinion pieces for <Link to="/voices">Voices & Letters</Link>, a forum of lively debate open to all UCL students, staff, and alumni! Voices pitches must still relate to the student experience at UCL and express a genuinely held view. Letters to the Editors work in the same way, except they should be no longer than 150 words and should contain your name and address — we will only publish your first name and your London borough. Send your views to <a href="mailto:editor@cheesegratermagazine.org">editor@cheesegratermagazine.org</a> or, even better, come along to one our weekly meetings (details are always on our Instagram). We’re a friendly bunch, promise!</p>
        </div>
        
        <div className="more-styling-text">
          <h3>Editorial Complaints</h3>
          <p>The Cheese Grater is a publication of Students’ Union UCL. We take our reporting very seriously and do genuinely hold ourselves to the highest editorial standards outlined in the <a href="https://www.ipso.co.uk/editors-code-of-practice/" target="_blank">IPSO Editor’s Code of Practice</a>. If you spot a factual error in our reporting, get in touch with our editors at <a href="mailto:editor@cheesegratermagazine.org">editor@cheesegratermagazine.org.</a></p>

          <p>If you wish to complain, you can do so <a href="https://studentsunionucl.org/webform/student-media-complaint" target="_blank">here</a>.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
