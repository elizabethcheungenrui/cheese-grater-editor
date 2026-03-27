import type { ReactNode } from "react";
import "./IGCard.css";

function getSectionLabel(section: string) {
  switch (section) {
    case "Humour":
      return "Humour & Satire";
    case "News":
      return "News & Investigations";
    case "Voices":
      return "Voices & Reviews";
    default:
      return "Other";
  }
}

export default function IGCardFrame({
  section,
  children,
}: {
  section: string;
  children: ReactNode;
}) {
  return (
    <div className={`ig-container ${section.toLowerCase()}`}>
      <p className="ig-section">{getSectionLabel(section)}</p>
      {children}
    </div>
  );
}
