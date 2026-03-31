import "./IGText.css";
import { useRef } from "react";
import IGCardFrame from "./IGCardFrame";
import { useFitText } from "../../lib/methods/formatting";

export default function IGText({
  section,
  content,
}: {
  section: string;
  content: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useFitText(contentRef, 11, 14, [content]);

  return (
    <IGCardFrame section={section}>
      <div className="ig-text-white-box">
        <div className="ig-text-yellow-box">
          <div className="ig-text-box">
            <div
              ref={contentRef}
              className="ig-text-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </IGCardFrame>
  );
}
