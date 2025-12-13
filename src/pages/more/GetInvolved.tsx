import { useState } from "react";
import Header from "../header-footer/Header";
import MoreMenu from "../header-footer/MoreMenu"
import MoreTitle from "./MoreTitle";
import Footer from "../header-footer/Footer";

import "./MoreStyling.css";

export default function GetInvolved() {
  const [moreOpen, setMoreOpen] = useState(false);
  
  return (
    <div className="page-container">
      <Header onMoreClick={() => setMoreOpen(!moreOpen)}/>      
      <MoreMenu isOpen={moreOpen} onClose={() => setMoreOpen(false)} />

      <MoreTitle headings={[
        "Get Involved!",
      ]} />

      <div className="more-styling">
        <div className="more-styling-text">
          <p>Love a bit of gossip? Think, “wow, I’m so funny”, on the regular? Spend most of your lectures doing silly doodles? If you answered “yes” to any of those (or even if you didn’t) you should consider joining <i>The Cheese Grater!</i></p>

          <p><i>The Cheese Grater</i> operates under the umbrella of the homonymous <a href="https://studentsunionucl.org/clubs-societies/cheese-grater-magazine" target="_blank">Cheese Grater Magazine Society</a>, a student society affiliated with our publisher, Students’ Union UCL. Together, we publish <i>The Cheese Grater, Women’s Wrongs</i>, and operate a Fringe-worthy sketch comedy group, the Graters. We also run regular meetings, socials, and offer training and guidance to all our journalists.</p>
        </div>

        <div className="more-styling-text">
          <h3>News & Investigations</h3>
          <p>The team meets every <b>Monday</b> at 6pm to discuss all the stories we’re investigating. We only publish investigations that have gone through this editorial; if you want your article in the magazine or just want to see what we do, then get yourself down to the meetings.</p>

          <p>If you want to spill the tea, break some news, or be the next Edward Snowden, send any tip offs to the investigations editor at <a href="mailto:investigations@cheesegratermagazine.org">investigations@cheesegratermagazine.org</a>.</p>
        </div>
        
        <div className="more-styling-text">
          <h3>Humour, Satire & Graphics</h3>
          <p>Meetings are on <b>Tuesdays</b> at 6pm. All submissions are sent to <a href="mailto:humour@cheesegratermagazine.org">humour@cheesegratermagazine.org</a> and then read out anonymously. Then we chat about each article, suggest edits, and workshop new ideas. After that, we go to the pub. Again, we only publish articles that have been submitted in this way. The best way to start writing with us it to come along and get involved. You don’t have to have written/drawn something, just bring your thinking cap and come and have a giggle.</p>
        </div>
        
        <div className="more-styling-text">
          <h3>The Graters</h3>
          <p>Sketch meetings are every <b>Wednesday</b> at 6pm, bring any sketch ideas you’ve got with you or send them to <a href="show@cheesegratermagazine.org">show@cheesegratermagazine.org</a> and we’ll read through and edit them with the group. We also workshop ideas, perform sketches, and generally talk comedy. Absolutely no experience is required and the best way to get it is to come along and prat around with us.</p>
        </div>
        
        <div className="more-styling-text">
          <h3><i>Women's Wrongs</i> Zine</h3>
          <p>Meetings are <b>Thursdays</b> at 6pm. Meetings are highly collaborative but no experience is required. Come along to the meetings to help create content, come up with new ideas and put the zine together. Send any ideas/question to <a href="zine@cheesegratermagazine.org">zine@cheesegratermagazine.org</a>.</p>
        </div>
        
        <div className="more-styling-text">
          <h3>Voices & letters</h3>
          <p>We also operate an opinion column called Voices that is open for all UCL students, even if you haven’t got a membership! If you have an idea or a hot take about something happening on campus or student life in general, send us a short pitch of two paragraphs outlining your argument. Voices articles must be no longer than 1,000 words. For shorter opinion pieces up to 150 words, you can write a letter to our editors. Please direct all Voices pitches and letters to <a href="editor@cheesegratermagazine.org">editor@cheesegratermagazine.org</a>.</p>
        </div>

      </div>

      <Footer />
    </div>
  );
}
