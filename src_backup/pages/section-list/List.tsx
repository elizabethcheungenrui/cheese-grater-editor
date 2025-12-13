import type { ReactNode } from "react";
import "./List.css"

const sectionTitles: Record<string, ReactNode[]> = {
  voices: 
    ["Voices & Letters",
    ""],
  news: 
    ["News & Investigations"],
  humour: 
    ["Humour, Satire & Graphics",
    <p>The ONLY funny people at UCL. Follow our Instagram (<a href="">@uclcheesegrater</a>) to find out when we meet or email pitches/drawings/queries to <a href="mailto:humour@cheesegratermagzine.org">humour@cheesegratermagazine.org.</a> Don’t be shy. We need all the help we can get… – cheers, the Editors xxx</p>]
};

export default function List({ section }: {section: string }) {  
  // fallback if the key isn't recognised
  const title = sectionTitles[section.toLowerCase()][0] ?? "Section";

  const subtitle = sectionTitles[section.toLowerCase()][1] ?? "Subtitle";
  
  return (
    <div className="list">
      <h3 className="title">{title}</h3>
      <p className="subtitle">{subtitle}</p>
    </div>
  );
}
