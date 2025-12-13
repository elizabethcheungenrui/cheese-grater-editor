import { useState } from "react";
import Header from "../header-footer/Header";
import MoreMenu from "../header-footer/MoreMenu"
import MoreTitle from "./MoreTitle";
import Footer from "../header-footer/Footer";

import "./MoreStyling.css";

export default function HelpWelfare() {
  const [moreOpen, setMoreOpen] = useState(false);
  
  return (
    <div className="page-container">
      <Header onMoreClick={() => setMoreOpen(!moreOpen)}/>      
      <MoreMenu isOpen={moreOpen} onClose={() => setMoreOpen(false)} />

      <MoreTitle headings={[
        "Help & Welfare",
      ]} />

      <div className="more-styling">
        <div className="more-styling-text">
          <p>This page provides information about support services available to students at UCL and an anonymous submission form for any welfare concerns you may have at The Cheese Grater Magazine Society.</p>
        </div>
        
        <div className="more-styling-text">
          <h3>Student Support & Wellbeing Services</h3>
          <p>The SSW team of expert wellbeing, disability, and mental health staff provide a safe, confidential, and non-judgemental space, in which you can discuss any issues that may be affecting your ability to study. All of their support services are free of charge and open to UCL students of all levels.</p>
          <a href="https://www.ucl.ac.uk/students/support-and-wellbeing-services" target="_blank">Visit SSW</a>
        </div>
        
        <div className="more-styling-text">
          <h3>Students' Union Advice Service</h3>
          <p>The Union Advice Service is a team of experienced caseworkers ready to support you with any difficulties that might occur during your time at UCL, specialising in academic issues, housing, employment, and money advice. Sessions are confidential and will not be reported to your department or any other university staff unless at your request. Students can make an appointment or attend a drop-in session for free, confidential, and independent advice and support.</p>
          <a href="https://studentsunionucl.org/advice-and-support/find-help/advice-service" target="_blank">Visit the Advice Service</a>
        </div>
        
        <div className="more-styling-text">
          <h3>Welfare Contact Form</h3>
          <p>This is an anonymous submission point for if you have any welfare concerns pertaining to an event, incident or individual/group of individuals that you would like to report without revealing your identity, please use the form below.

Any information shared via this form will be kept confidential apart from the parties involved, and entries made on this form will only be directly accessible to the President and Welfare Officer of The Cheese Grater Magazine Society. However, if you are comfortable, please leave your email so we can contact you to help resolve your concern.

If you would prefer to contact us directly, please email our Welfare Officer Callum Gregor at callum.gregor.23@ucl.ac.uk or President Izzie Moull at president@cheesegratermagazine.org.</p>

          <a href="https://docs.google.com/forms/d/e/1FAIpQLScqVFnk3amP7IZwiiSGvgNf-msf7Ukt5Gi3cMySLXVBtxCKdQ/viewform" target="_blank">Contact us anonymously</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
