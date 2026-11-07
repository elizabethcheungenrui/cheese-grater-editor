import type { CSSProperties, ReactNode } from "react";
import { getIGSectionTheme } from "../../../lib/methods/igSections";
import "./IGCard.css";

export default function IGCardFrame({
  section,
  children,
}: {
  section: string;
  children: ReactNode;
}) {  
  const theme = getIGSectionTheme(section);

  return (
    <div 
      className={`ig-container ${section.toLowerCase()}`}
      style={
        { "--ig-accent": theme.color } as CSSProperties
      }
    >
      <div className="ig-cover-box">
        <div className="ig-inner-box">
          <div className="ig-section-tab">
            {theme.label}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
