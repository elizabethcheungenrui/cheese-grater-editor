import type { ReactNode } from "react";
import "./Title.css"

const sectionTitles: Record<string, ReactNode[]> = {
  voices: 
    ["Voices & Letters",
    <p>Opinion, reviews, and analysis: tell the rest of UCL what you think. Send us a pitch or a letter at <a href="maito: editor@cheesegratermagzine.org">editor@cheesegratermagazine.org</a> to get started.</p>],
  news: 
    ["News & Investigations",
    <p>Your most-trusted news source on all things UCL: The Students' Union, campus stories, activism and much more. Got a scoop you think might be newsworthy? Follow our Instagram (<a href="https://www.instagram.com/uclcheesegrater/" target="_blank" rel="noopener noreferrer">@uclcheesegrater</a>) to find out when we meet or email pitches/queries to <a href="mailto:investigations@cheesegratermagazine.org">investigations@cheesegratermagazine.org</a>.</p>],
  humour: 
    ["Humour, Satire & Graphics",
    <p>The ONLY funny people at UCL. Follow our Instagram (<a href="https://www.instagram.com/uclcheesegrater/"target="_blank" rel="noopener noreferrer">@uclcheesegrater</a>) to find out when we meet or email pitches/drawings/queries to <a href="mailto:humour@cheesegratermagazine.org">humour@cheesegratermagazine.org</a>. Don’t be shy. We need all the help we can get…</p>],
  podcast:
    ["Podcast: Grater Insight",
    <p>Take a deep dive beyond the headlines with Grater Insight, our weekly radio slot on Rare FM every Saturday during term time live from 12pm. Listen back to every episode right here, or on our <a href="https://open.spotify.com/show/671H9f9qfFds30m8ju8VIG" target="_blank">Spotify Page</a>.</p>],
  print:
    ["Print Edition",
    <p>We print three times a year, and whenever else we feel like it. Explore almost every issue of <i>The Cheese Grater</i> since 2004.</p>],
};

export default function List({ sectionUpper }: {sectionUpper: string }) {  
  const section = sectionUpper.toLowerCase();

  // fallback if the key isn't recognised
  const title = sectionTitles[section][0] ?? "Section";

  const subtitle = sectionTitles[section][1] ?? "Subtitle";
  
  return (
    <div className={`title ${section}`}>
      <h3 className="heading">{title}</h3>
      <p className="subheading">{subtitle}</p>
    </div>
  );
}
