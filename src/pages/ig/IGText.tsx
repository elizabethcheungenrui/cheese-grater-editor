import { useRef } from "react";
import IGCardFrame from "./IGCardFrame";
import { useFitText } from "../../lib/methods/formatting";
// import "./IGText.css";

export default function IGText({
  section,
  content,
}: {
  section: string;
  content: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useFitText(contentRef, 14, 22, [content]);

  return (
    <IGCardFrame section={section}>
      <div className="ig-text-card">
        <div className="ig-text-box">
          <div
            ref={contentRef}
            className="ig-text-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </IGCardFrame>
  );
}
