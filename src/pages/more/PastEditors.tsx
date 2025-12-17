import MoreTitle from "./MoreTitle";
import Footer from "../header-footer/Footer";

import "./MoreStyling.css";
import { useIsMobile } from "../../hooks/useIsMobile";
import HeaderMobile from "../header-footer/HeaderMobile";
import HeaderDesktop from "../header-footer/HeaderDesktop";

export default function PastEditors() {
  const isMobile = useIsMobile();
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}


      <MoreTitle headings={[
        "Past Editors"
      ]} />

      <div className="more-styling">
        <p><b>Hall of fame? Graveyard of the former greats? Each of our past editors have done something to change the publication and influence student life at UCL. Here, we write each other’s obituaries in commemoration of those who were annoying on campus before we were.</b></p>

        <div className="more-styling-text">
<h3>Nick Miao and Robert Delaney</h3>
<p><b>September 2024–August 2025</b></p>

<p>Nick and Rob (for a second time) were always the natural choice to lead this publication as it enters its 20s, both falling into the printing press shortly after birth and being ominously christened with matching names which mean “to steal something”. Rob and Nick led the publication to new heights of glory, winning the SPA’s Best Publication in London 2025 and publishing FIVE issues. They can also be credited for the creation of “The Digestive” and our brand new podcast/radio show “Grater Insights”. Despite being absolutely snubbed by the SPA nationals (when will justice be served?) and the artsUCL awards (this is because they cannot give us all the awards every year and it had to be another sibling’s turn of the Xbox, if you will), <i>The Cheese Grater</i> is left at a new zenith. Rob and Nick have given us one of our most successful years ever.</p>
    </div>

    <div className="more-styling-text">
    <h3>Robert Delaney and Maddison Brown</h3>
<p><b>September 2023–August 2024</b></p>

<p>Rob and Mads inherited a broken magazine from the previous administration, who left a note saying “there is no money”. They leave behind a legacy of a refreshed <i>Cheese Grater</i>, which, while still broke as hell, nonetheless won Best Publication at the Arts Awards simply by doing slightly better than Pi. The bar was a tripping hazard in hell, and they surpassed it with flying colours.</p>
    </div>

<div className="more-styling-text">
    <h3>Samir Ismael and Nandini Agarwal</h3>
<p><b>September 2022–August 2023</b></p>

<p>Sam and Nandini formed a formidable duo when they were the co-editor-in-chiefs of this great magazine. Under their editorship, they oversaw victories at both the SPAs in Glasgow and the UCL Arts Awards back in Bloomsbury. Whilst we published less than usual, Nandini and Sam oversaw some great journalism and we wish them well on their future ventures!</p>
</div>

<div className="more-styling-text">
 <h3>Rusheen Bansal and Alfie Pannell</h3>
<p><b>September 2021–August 2022</b></p>

<p>We hated every minute of it.</p>
  </div>

<div className="more-styling-text">
 <h3>Sophia Robinson</h3>
<p><b>September 2020–August 2021</b></p>

<p>The chaos caused by a pesky pandemic necessitated the reintroduction of a dictatorship, but fortunately Sophia Robinson was the perfect candidate. While she claims to have ‘barely survived’ her time as the first <i>Cheese Grater editor</i> to have led the magazine during a global disaster, Sophia expertly edited her way through Zoom Year — despite having a markedly difficult relationship with Adobe Acrobat. She has since gone on to become an accountant, making us all very proud indeed.</p>
  </div>

<div className="more-styling-text">
  <h3>Suzy Kingston and Weronika Strzyzynska</h3>
<p><b>September 2019–August 2020</b></p>

<p>Suzy and Weronika continued the <i>CG</i> legacy, overseeing smash-hit investigative journalism and somewhat less smash-hit digs at ‘Gash’, the next big thing in sexual liberation. Actually, those were pretty smash-hit too, but irritatingly no one knows what ‘Gash’ is – especially as a cursory Google search no longer delivers photos of UCL students holding garden implements in their underwear. Anyway – Suzy and Weronika made another excellent editing duo, and they narrowly escaped the clutches of the big ‘Rona.</p>
  </div>

<div className="more-styling-text">
  <h3>Ollie Dunn and Peter FitzSimons</h3>
<p><b>September 2018–August 2019</b></p>

<p>Collective leadership proved popular, and <i>CG</i> took coalition government in full stride with the election of Ollie Dunn and Peter FitzSimons. While the person writing this paragraph had limited interaction with either editor (on account of the website being edited once every 3-4 years), Ollie and Peter seem to have done a decent job because the magazine is, as ever, thriving. I imagine they were both Wildly Extroverted, since the CG 15th Birthday Party looks like a right old laugh – going by the Facebook photos, that is.</p>
  </div>

<div className="more-styling-text">
  <h3>Jason Murugesu and Jack Redfern</h3>
<p><b>September 2017–August 2018</b></p>

<p>The bloody purges and violence of collectivisation in 2016–2017 led <i>The Cheese Grater</i> to adopt a form of collective leadership, to prevent the magazine from succumbing again to a cult of personality. Two clear leaders emerged from the power struggle. Jason Murugesu and Jack Redfern pursued a policy of détente with the magazine’s old nemeses at SUCKLE (fmrly UCLU), but found a new foe in the Men’s Rugby club. The cold war with the team never turned hot (luckily, since they’re bigger than us), and <i>CG</i> ended the year as winners of best print publication at the Union’s Arts Colours awards.</p>
  </div>

<div className="more-styling-text">
  <h3>Ollie Phelan</h3>
<p><b>September 2016–August 2017</b></p>

<p>Famed for his cotton jumpers, Ollie Phelan was the editor who brought <i>The Cheese Grater</i> to the digital age… about 20 years too late. Yes: this was the year the new website, coordinated and led by President Will Orton, made a similar-sized splash as Facebook did in Harvard circa 2004. Phelan, known for his savage cuts, prioritised stories that weren’t self-indulgent and ones which could be read by even those students who didn’t personally know the moustachioed Scandinavian David Dahlborn. Phelan brought the magazine into the era of actually being read by real people: thousands of them! Long may that last.</p>
    </div>

<div className="more-styling-text">
    <h3>Bo Franklin</h3>
<p><b>September 2015–August 2016</b></p>

<p>For the first time in the history of <i>The Cheese Grater</i>, Bo was chosen through a televised competition, loosely based on the Crystal Maze format and broadcast to millions on BBC One. Franklin, a previous Investigations Editor, beat thousands of hopefuls from across the country in rounds such as high-pressure sub-editing and quick-fire Photoshop. By the way, does anyone actually read these blurbs of text, or am I (the website maker) just wasting an entire Wednesday afternoon transcribing a useless page from the old website to the new one? Please let me know my efforts weren't in vain. If you see this, text me on Whatsapp (if you know me personally) or use the email all the way down below and I'll treat you to a pint next time <i>The Cheese Grater</i> meets at the Institute, on the condition that you don't tell anyone else about this. Finally, he took down then editor Charlie Hayton in a head-to-head pun battle, which left Hayton writhing on the studio floor begging for mercy.</p>
    </div>

<div className="more-styling-text">
    <h3>Charlie Hayton</h3>
<p><b>September 2014–August 2015</b></p>

<p>On the 21st of May 1994, a child was born whose life has shaped the course of the past decade more than any stinking politician, poxy celebrity, or vainglorious artist. Millions adore him, young’uns around the world dream of achieving the heights he has reached. Despite the international scrutiny placed upon him in his teenage years, many argue that it is only now that he has achieved true prominence, and the fame he has always deserved. That man is, of course, British Olympic diver and star of ITV’s Splash!, Tom Daley. Also born on that day was some twat called Charlie Hayton, who has ever since struggled to get out of Daley’s immense but shapely shadow, a goal he seems unlikely to ever attain. Having been inexplicably elected to the editorship of <i>The Cheese Grater</i>, Hayton seemed intent on driving the publication into the ground, a task with which he was ably assisted by his provincial sub-editors, Magic Patguire and Ollie Phelan. Thankfully everything was basically fine, bar a brief incident which forced Hayton to hide under a table at the UCLU Arts Ball. When asked to describe him, most of Hayton’s acquaintances utter foul swears under their breath and launch into torturous comparisons to depraved Roman Emperors or inbred Habsburg Kings. Hayton prefers to think of himself as “basically just a really nice guy”.</p>
  </div>

<div className="more-styling-text">
  <h3>Hannah Sketchley</h3>
<p><b>September 2013–August 2014</b></p>

<p>Having returned from political exile in Berlin, Hannah Sketchley ascended to the helm of the Good Ship Cheese Grater. Previously playing First-Lieutenant as Investigations Editor two years before, she dealt with attempts of censorship from the Union and the re-surfacing of past Krakens.  She also broke stories about former Provost Malcolm Grant’s lavish and questionable spending on expenses, which attracted a shot across the bows from his lawyers.  As she steered the magazine through its tenth anniversary year, she left a trail of incisive investigation, frustrated lawyers and cutting humour in her wake. She was joined at the poop-deck by Charlie “Charlie the Dog” Hayton and Bo Franklin, who filled the boots of Humour and Investigations Editors respectively. Both delivered broadsides of printed excellence as they navigated the tempestuous seas of student journalism. Looking down from the crows nest with love and grace was the Grater’s first stand-alone president Beatrice Kelly. Incidentally, though indulging heavily in nautical metaphor, Sketchley hates boats and in fact prefers looking at big dogs on Hampstead Heath. She now works at the NUS.</p>
  </div>

<div className="more-styling-text">
  <h3>Will Rowland</h3>
<p><b>September 2012–August 2013</b></p>

<p>Will Rowland oversaw <i>The Cheese Grater</i> from his underground lair in Fitzrovia, and from the dark depths came both inspirational leadership as well some of the most brilliant humour articles to have ever graced its pages. Throughout his editorship, he was aided by assistant editors who could quite definitely be described as ‘enthusiastic’, and Will sometimes struggled to rein in their excitement. However, he still managed to produce a stellar run of the magazine, despite several committee members upping their sticks and leaving empty posts behind them. The magazine was graced by UCL providing plenty of muck to rake, with exposées appearing in almost every issue. He co-wrote and performed in the Graters show “Crab Salad”, which followed a run in the UCLU Garage Theatre with stunning success at the Edinburgh Festival Fringe, where constant adversity was overcome by his calm leadership. The show was a mature and witty comic play, described by the sole reviewer who turned up as “inspired”, “genius”, and “fast-paced and funny, well worth going to see”. But who was the man behind the art? It was Will Rowland.</p>
  </div>

<div className="more-styling-text">
  <h3>Chon Böll</h3>
<p><b>September 2011–August 2012</b></p>

<p>Chin Bolt hurtled into <i>The Cheese Grater</i> resulting in a year of high-octane development and improvement. His year at the wheel began with a record print run of the first issue with a racy and much-needed magazine redesign, putting it in pole position. Chrevor then chicaned into controversy, being forced to defend a censorship threat, a case that he skilfully resolved before taking a sharp turn with the magazine’s integrity and chassis still intact. Chames took a short pit-stop and founded the UCL Graters, the comedy performance side of the society, directing and co-writing Graters’ full-throttle month-long run in Edinburgh to five-star reviews, medium-sized audiences and one woman who asked, “Is it over yet?” Graters were the proud recipients of the UCLU Best Garage Theatre Production 2012, a feat that Balls celebrated by shaving his head and spraying copious amounts of Mumm on two waiting models. Belt is currently spending some time with children.</p>
  </div>

<div className="more-styling-text">
  <h3>Thom Rhoades</h3>
<p><b>September 2010–August 2011</b></p>

<p>Thom Rhoades was initially worried when he took over that his lack of investigative experience would limit what stories <i>The Cheese Grater</i> could produce during his year in charge. Thankfully his tenure coincided with a big load of government cuts to higher education which presented ample headline opportunities. As if it couldn’t get any better, then came a string of protests by UCL’s very own Eastern Bloc that were begging for a good journalist to dish some dirt on them! In Thom’s year as editor, <i>Times Higher Education</i> liked <i>The Cheese Grater</i>’s work so much that it took our findings, made an <a href="http://www.timeshighereducation.co.uk/story.asp?storycode=415297" target="_blank">article</a> out of them, and then threw a pithy credit into the closing sentence. After initial plans to convert to Law at the end of his degree (encouraged by the magazine for want of a defence attorney willing to work pro bono), Thom has put such plans on hold and is currently touring with the band Citizens.</p>
    </div>

<div className="more-styling-text">
    <h3>A.Z. McKenna</h3>
<p><b>September 2009–August 2010</b></p>

<p>A.Z. McKenna’s leadership of <i>The Cheese Grater</i> resulted in crippling staffing issues and legal threats which continue to this day. Thankfully, McKenna possessed both the knowing wit and proactive flat mate necessary to ensure the magazine continued its successful run. “Knowing wit” here refers to a chilling ability to disguise puerile toilet humour with references to Kingsley Amis. Being the first editor not to win a Union Arts Award will always be remembered as the one black mark on his time at the helm – he did however achieve the biggest print run of any previous editor for a single issue. Notable investigative scoops included leaks on the merger of the Modern Languages department and the infamous “UCL Pants Bomber” saga. Since graduating he has scratched backs and greased palms to get himself a job at <i>The Georgian</i> (one of the few publications with a smaller readership than this godforsaken rag) before retreating back into academia to pursue a Master’s in History at Cambridge.</p>
    </div>

<div className="more-styling-text">
    <h3>Jenni Hulse</h3>
<p><b>September 2008–August 2009</b></p>

<p>Jenni felt the full force of UCL Union’s wrath in her first term in charge of <i>The Cheese Grater</i>, when Sabbatical Officer Charlie Clinton censored her exposé of one of its former employees. Inspired by Tony Benn’s 1987 Speaker’s Corner reading of “Spycatcher” – which was banned by Mrs Thatcher – she decided to hijack a Union poetry night in order to declaim the banned piece. Certain reports said she even made it rhyme so as not to upset UCL’s literati who had come to hear anxiety-ridden student poems about masturbation, lukewarm tea and bicycle rides in Regent’s Park. Despite Clinton’s continued spinelessness, the ever-gracious Hulse refused to stoop as low as one unnamed aspirant to the editorship wanted her to, rejecting the suggestion that the magazine should publish pictures of Clinton’s recently deceased pet dog. Instead, she pressed on with investigations into the UCL Academy, the college’s use and abuse of Post Graduate Teaching Assistants, and the limits of its ethical investment policy.</p>
  </div>

<div className="more-styling-text">
  <h3>Hannah Hudson</h3>
<p><b>January–August 2008</b></p>

<p>Elected to the <i>Grater</i>’s helm midway through the academic year, under Hannah’s editorship <i>The Cheese Grater</i> investigated UCL’s asbestos problem, the failings of <i>Pi Magazine</i> and the money wasted by the Union’s Sabbatical Officers. Hannah also produced a special report on the UCL Union AGM after the event garnered headlines in the national press, as well as a UCL Union investigative bonanza. Meanwhile, on the humour front, she and Assistant Editor Harry Stopes produced an eclectic array of articles including a futuristic <i>Cheese Grater</i> parody (cyborg jokes ad nauseam). After graduating, she headed for the world of real journalism and has since studied for a Journalism MA at City University. Since graduating, she has disappeared off to become editor-in-chief of an expat magazine in Northern China, as well as contributing to a range of publications, including <i>News of the World, Time Out London, BBC Focus, and Love It!</i></p>
  </div>

<div className="more-styling-text">
  <h3>Mark Ravinet</h3>
<p><b>September 2006–December 2007</b></p>

<p>Some men are born into greatness; Mark Ravinet had it thrust upon him as a perpetually embarrassed second-year Geography student. Sadly for him, “greatness” in this context was the editorship of a tatty, badly photocopied magazine filled with investigative journalism read by two people and the kind of nasty satirical humour that etched disappointment across the face of his mother. It wasn’t all bad though: there was ample opportunity to topple the egos of self-important student politicians around the Union, dig the dirt on some stunningly ill-conceived electoral fraud and expose a student newspaper franchise as little more than the wet dream of a wannabe Murdoch. His enduring legacy has been a string of embarrassing Google hits for those who really deserved it. At the time of writing, he is rapidly approaching the end of a PhD and attempting to improve his own employment prospects through search engine optimisation to remove any association with all that nasty humour. This must’ve worked, as Mark is now a serious evolutionary biologist at the University of Oslo.</p>
    </div>

<div className="more-styling-text">
    <h3>René Lavanchy</h3>
<p><b>September 2004–August 2006</b></p>

<p>René Lavanchy founded <i>The Cheese Grater</i> in February 2004 in his first year of studying Classics at UCL, roping in hallmates Nick Cowen and Richard Bridger as treasurer and assistant editor – Bridger would later go on to persuade Provost Malcolm Grant to shave his moustache off. Editing the magazine from its first issue in March 2004 to a special edition in July 2006, René set the tone of knowing humour mixed with no-holds-barred investigations. Initially friendly relations with <i>Pi Magazine</i> chilled after about the third time The Cheese Grater attacked its rival; he also burnt bridges with the Provost, the Dean of Students, and various sabbatical officers. Under his editorship, the magazine won its first UCL Union Arts Award and a Guardian Student Media Award for Best Small Budget Publication. This earned the boozy editor the chance, though not the right, to plant a wet kiss on Lauren Laverne.</p>
    </div>
      </div>
    <Footer />
  </div>);
}
