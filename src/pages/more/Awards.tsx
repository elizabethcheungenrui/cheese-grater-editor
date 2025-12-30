import MoreTitle from "./MoreTitle";
import Footer from "../header-footer/Footer";

import "./MoreStyling.css";
import { Link } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile";
import HeaderMobile from "../header-footer/HeaderMobile";
import HeaderDesktop from "../header-footer/HeaderDesktop";

export default function Awards() {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}

      <MoreTitle headings={[
        "Awards & Accolades"
      ]} />

      <div className="more-styling awards">
        <div className="more-styling-text">
          <p><b><i>Winner, winner, chicken dinner, baby.</i></b> <i>The Cheese Grater</i> is proud to have won the most awards of any UCL publication. Our journalists are some of the best in London, and we continue to be recognised locally, regionally, and nationally. Here’s some of what we’ve won in the past.</p>
        </div>

        <div className="more-styling-text awards-table">
          <table>
            <thead>
              <tr>
                <th>Award</th>
                <th>Year</th>
                <th>Category</th>
                <th>Nominee</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td scope="col" rowSpan={15}>Student Publication Association (National Awards)</td>
                <td scope="col" rowSpan={9}>2025</td>
                <td>Best Specialist Publication</td>
                <td><i>Women's Wrongs</i></td>
                <td>Won</td>
              </tr>

              <tr>
                <td>Best Website</td>
                <td><i>The Cheese Grater</i></td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Best Reporter</td>
                <td>Lucy Reade, Robert Delaney, and Nick Miao</td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Best Newcomer</td>
                <td>Go Kitajima</td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Best Investigation</td>
                <td>Malvika Murkumbi for <Link to="/article/2025-01-20-ucl-support-tool-did-more-harm-than-good-report-finds/">UCL support tool did more harm than good, report finds</Link></td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Best News Story</td>
                <td>Andrea Bidnic for <Link to="/article/2024-11-11-no-jobs-for-graduates-if-union-bans-oil-and-gas-sponsorships-engineers-warn/">No jobs for graduates if Union bans oil and gas sponsorships, engineers warn</Link></td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Best Comment Piece</td>
                <td>Andrea Bidnic for What is it with the Provost and 'Disagreeing Well'?</td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Best Comment Piece</td>
                <td>Andrea Bidnic for Jewish Society, wake up!</td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Best Creative Piece</td>
                <td>Jasmine Yiu for <Link to="/article/2024-10-31-dear-phantom-flatmate/">Dear phantom flatmate</Link></td>
                <td>Nominated</td>
              </tr>
              
              <tr>
                <td scope="col" rowSpan={2}>2024</td>
                <td>Best Creative Piece</td>
                <td>Ben Scanlan for Keir Starmer... A Day in the Life</td>
                <td>Highly commended</td>
              </tr>

              <tr>
                <td>Best Newcomer</td>
                <td><i>Women's Wrongs</i></td>
                <td>Highly commended</td>
              </tr>
              
              <tr>
                <td scope="col" rowSpan={3}>2023</td>
                <td>Best Media Piece</td>
                <td>Neil Majithia and Elettra Plati for Chun Buckets Everywhere: How initiation ceremonies ruin the freshers experience</td>
                <td>Won</td>
              </tr>

              <tr>
                <td>Best Creative Piece</td>
                <td>Mathilde Turner for Naked Yoga: A Belligerent Ode to the Pussy</td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Billy Dowling-Reid Award for Outstanding Commitment</td>
                <td>Nandini Agarwal</td>
                <td>Nominated</td>
              </tr>
              
              <tr>
                <td>2019</td>
                <td>Best Publiation</td>
                <td><i>The Cheese Grater</i></td>
                <td>Highly Commended</td>
              </tr>

              <tr>
                <td scope="col" rowSpan={7}>Student Publication Association (London Regional Awards)</td>
                <td scope="col" rowSpan={5}>2025</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>

              <tr>
                <td>Best Digital</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>

              <tr>
                <td>Best Design (Print)</td>
                <td><i>The Cheese Grater</i></td>
                <td>Highly Commended</td>
              </tr>

              <tr>
                <td>Best Journalist</td>
                <td>Malvika Murkumbi</td>
                <td>Won</td>
              </tr>

              <tr>
                <td>Best Article</td>
                <td>Andrea Bidnic for A 'culture of overwork and abuse': Years after the first complaints, the mistreatment of PGTAs continues</td>
                <td>Highly Commended</td>
              </tr>

              <tr>
                <td>2024</td>
                <td>Best Journalist</td>
                <td>Rebekah Wright</td>
                <td>Highly Commended</td>
              </tr>

              <tr>
                <td>2022</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>

              <tr>
                <td scope="col" rowSpan={20}>Students' Union UCL Arts Awards</td>
                <td scope="col" rowSpan={5}>2025</td>
                <td>Best Publication</td>
                <td><i>Women's Wrongs</i></td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Best Written Media Piece</td>
                <td>Malvika Murkumbi for <Link to="/article/2025-01-20-ucl-support-tool-did-more-harm-than-good-report-finds/">UCL support tool did more harm than good, report finds</Link></td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Best Video Media Piece</td>
                <td>Nick Miao for UCL paid for 80% of Union Gym refurbishment</td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Outstanding Contribution to the Media</td>
                <td>Andrea Bidnic, Lily Park and Robert Delaney</td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>Media Personality of the Year</td>
                <td>Andrea Bidnic, Lucy Reade, Nick Miao, and Robert Delaney</td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td scope="col" rowSpan={2}>2024</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>
              
              <tr>
                <td>Best Media Piece</td>
                <td>Mads Brown for TERF out Transphobia: The IOE and "Academic Freedom"</td>
                <td>Won</td>
              </tr>

              <tr>
                <td scope="col" rowSpan={2}>2023</td>
                <td>Best Publication</td>
                <td><i>Women's Wrongs</i></td>
                <td>Won</td>
              </tr>
              
              <tr>
                <td>Best Media Piece</td>
                <td>Neil Majithia and Elettra Plati for Chun Buckets Everywhere: How initiation ceremonies ruin the freshers experience</td>
                <td>Won</td>
              </tr>

              <tr>
                <td>2018</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>

              <tr>
                <td>2016</td>
                <td>Most Improved Society</td>
                <td>The Cheese Grater Magazine Society</td>
                <td>Won</td>
              </tr>

              <tr>
                <td scope="col" rowSpan={2}>2014</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>

              <tr>
                <td>Diversity and Incluion</td>
                <td>The Cheese Grater Magazine Society</td>
                <td>Won</td>
              </tr>

              <tr>
                <td>2012</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>2011</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>

              <tr>
                <td>2010</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>2009</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>

              <tr>
                <td>2008</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>

              <tr>
                <td>2007</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>

              <tr>
                <td>2006</td>
                <td>Best Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>

              <tr>
                <td scope="col" rowSpan={2}>Guardian Student Media Awards</td>
                <td>2007</td>
                <td>Best Magazine</td>
                <td><i>The Cheese Grater</i></td>
                <td>Nominated</td>
              </tr>

              <tr>
                <td>2006</td>
                <td>Best Small Budget Publication</td>
                <td><i>The Cheese Grater</i></td>
                <td>Won</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}
