import MoreTitle from "./MoreTitle";
import Footer from "../header-footer/Footer";

import "./MoreStyling.css";
import { useIsMobile } from "../../hooks/useIsMobile";
import HeaderMobile from "../header-footer/HeaderMobile";
import HeaderDesktop from "../header-footer/HeaderDesktop";

export default function Honorary() {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}
  
      <MoreTitle headings={[
        "Honorary Life Members"
      ]} />

      <div className="more-styling">
        <p>Honorary Life Membership to <i>The Cheese Grater</i> requires two or more years of outstanding contribution to the publication, going above and beyond one’s position and consistently embodying its ethos and beliefs. The publication could not have achieved what it has without the efforts of these amazing people (sorted by the second letter of their last names):</p>
      
      <div className="more-styling-text honorary-columns">
          <ul> 
    <li>P. K. Maguire</li>
    <li>Alex 'Daish' Daish</li>
    <li>Sasha Baker</li>
    <li>Rosie Halsall</li>
    <li>Peter Daniels</li>
    <li>Tara Sarangi</li>
    <li>Hugh Bassett</li>
    <li>Alejandro Castillo-Powell</li>
    <li>Anna Saunders</li>
    <li>René Lavanchy</li>
    <li>Rob Davidson</li>
    <li>Christina Ravinet</li>
    <li>Mark Ravinet</li>
    <li>Charlie Hayton</li>
    <li>A. Z. McKenna</li>
    <li>Oscar Webb</li>
    <li>Jack Redfern</li>
          </ul>
          <ul>
    <li>John Bell</li>
    <li>Beatrice Kelly</li>
    <li>Iona Jenkins</li>
    <li>Marina Merryweather</li>
    <li>Ollie Phelan</li>
    <li>Jasmine Chinasamy</li>
    <li>Thom Rhoades</li>
    <li>Alex Diamond</li>
    <li>Adam Gillett</li>
    <li>Peter FitzSimons</li>
    <li>Hannah Sketchley</li>
    <li>Kate 'Scary Boots' Oliver</li>
    <li>Colette Allen</li>
    <li>Tim Smith</li>
    <li>Michael Johnson</li>
    <li>James Donaldson-Briggs</li>
    <li>George Potts</li>
          </ul>
          <ul>
    <li>Will Rowland</li>
    <li>Gareth Spencer</li>
    <li>Bo Franklin</li>
    <li>Will Orton</li>
    <li>Sebastian Stacey</li>
    <li>Sam Steddy</li>
    <li>Huw Steer</li>
    <li>Harry Stopes</li>
    <li>Hannah Hudson</li>
    <li>Jenni Hulse</li>
    <li>Ross Humphreys</li>
    <li>Ollie Dunn</li>
    <li>Ben Munster</li>
    <li>Jess Murray</li>
    <li>Jason Murugesu</li>
            </ul>
        </div>
        </div>
      <Footer />
    </div>
  );
}
