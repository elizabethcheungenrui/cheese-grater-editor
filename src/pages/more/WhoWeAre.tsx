import { useState } from "react";
import Header from "../header-footer/Header";
import MoreMenu from "../header-footer/MoreMenu"
import MoreTitle from "./MoreTitle";
import Footer from "../header-footer/Footer";

import "./MoreStyling.css";
import { Link } from "react-router-dom";

export default function WhoWeAre() {
  const [moreOpen, setMoreOpen] = useState(false);
  
  return (
    <div className="page-container">
      <Header onMoreClick={() => setMoreOpen(!moreOpen)}/>      
      <MoreMenu isOpen={moreOpen} onClose={() => setMoreOpen(false)} />

      <MoreTitle headings={[
        "About Us",
      ]} />

      <div className="more-styling">
        <div className="more-styling-text">
          <p><i>The Cheese Grater</i> is UCL’s student paper for campus news, investigations, and satire and the <b>Best Student Publication in London</b> (<a href="https://www.spajournalism.com/spa-2025-regional-award-winners/" target="_blank">SPAs 2025</a>).</p>

          <p>We’ve been annoying people across campus since 2004, producing award-winning journalism, illuminating important issues at the university, and holding the establishment to account.</p>

          <p>We print three times a year and whenever else we feel like it because we’re cool and easy-going like that. During term time, we run a fortnightly newsletter, the <b><a href="https://us17.campaign-archive.com/home/?u=65bd5c7a770205040fd2e9e8a&id=9679db51c3" target="_blank">Digestive</a></b>, packed with the biggest campus headlines, our biting humour pieces, and fresh new graphics. Every Saturday noon, we’re on Rare FM for our weekly radio segment, <b>Grater Insight</b>. As “The Cheese Grater Magazine Society” at Students’ Union UCL, we also have a cool younger sister – our feminist zine <b><i>Women’s Wrongs</i></b> – and a problem child, our sketch group, <b>the Graters.</b></p>

          <p><i>The Cheese Grater</i> has twice been named the Best Publication in London, most recently in 2025, when we were also named Best Digital and highly commended for Best Print Design. We’ve also won the title of UCL’s Best Publication 10 times since 2004, most recently in 2024.</p>

          <p>We are proof that you can make it out of Ifor Evans Hall, where, in 2004, Classics student René Lavanchy established <i>The Cheese Grater</i> to offer an alternative to the Union mouthpiece, <i>Pi Magazine</i>. Today, we’re proud to be UCL’s largest publication by circulation and are far more relevant, successful, and funny than all our predecessors.</p>

          <p>We are deeply committed to public interest journalism, supporting student democracy, standing up for students’ interests without fear or favour, supporting marginalised communities at UCL, and also having a bit of laugh every now and then. If you like what you hear, you should <Link to="/get-involved">join our crew!</Link></p>

          <p><i>We hold ourselves to the highest standards, set out by the <a href="https://www.ipso.co.uk/editors-code-of-practice/" target="_blank">IPSO Editor’s Code of Practice.</a> The editors for 2025/26 are Malvika Murkumbi and Rebekah Wright.</i></p>
        </div>

        <section className="whoweare-section">  
          <h2>Senior Editorial</h2>
          <div className="whoweare-editors">
            <div>
              <h3>Editors-in-Chief</h3>
              <p>Malvika Murkumbi & Rebekah Wright</p>
              <p>editor@cheesegratermagazine.org</p>
            </div>
          </div>
        </section>
        
        <section className="whoweare-section">
          <h2>Section Editors</h2>
          <div className="whoweare-editors">
            <div>
              <h3>News and Investigations Editors</h3>
              <p>James Balloqui & Go Kitajima</p>
              <p>investigations@cheesegratermagazine.org</p>
            </div>

            <div>
              <h3>Humour and Satire Editors</h3>
              <p>Go Kitajima & Holly Turner</p>
              <p>humour@cheesegratermagazine.org</p>
            </div>

            <div>
              <h3>Graphics Editor</h3>            
              <p>Kotryna Taujanskaite</p>
              <p>humour@cheesegratermagazine.org</p>
            </div>

            <div>
              <h3>Online Editor</h3>
              <p>Szofi Vardy</p>
              <p>szofi.vardy.24@ucl.ac.uk</p>
            </div>
          </div>
        </section>

        <section className="whoweare-section">
          <h2>The Graters and Women's Wrongs Zine</h2>
          <div className="whoweare-editors">
            <div>
              <h3>Sketch Directors</h3>
              <p>Robin Elfsberg & Carla Rodrigues</p>
              <p>show@cheesegratermagazine.org</p>
            </div>

            <div>
              <h3>Zine Editors</h3>
              <p>Coryn Gyimah & Rinikka Kapoor</p>
              <p>zine@cheesegratermagazine.org</p>
            </div>
          </div>
        </section>

        <section className="whoweare-section">
          <h2>Society Officers</h2>
          <div className="whoweare-editors">
            <div>
              <h3>President</h3>
              <p>Izzie Moull</p>
              <p>president@cheesegratermagazine.org</p>
            </div>

            <div>
              <h3>Treasurer</h3>
              <p>Robert Delaney</p>
              <p>robert.delaney.22@ucl.ac.uk</p>
            </div>

            <div>
              <h3>Welfare Officer</h3>
              <p>Callum Gregor</p>
              <p>callum.gregor.23@ucl.ac.uk</p>
            </div>

            <div>
              <h3>Social Secretary</h3>
              <p>Sophia Marmion</p>
              <p>sophia.marmion.24@ucl.ac.uk</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
