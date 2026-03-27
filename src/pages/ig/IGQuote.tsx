import { useRef } from "react";
import IGCardFrame from "./IGCardFrame";
import { useFitText } from "../../lib/methods/formatting";
// import "./IGQuote.css";

export default function IGQuote({
  section,
  content,
  quoteAuthor,
}: {
  section: string;
  content: string;
  quoteAuthor: string;
}) {
  const quoteRef = useRef<HTMLDivElement>(null);

  useFitText(quoteRef, 16, 24, [content]);

  return (
    <IGCardFrame section={section}>
      <div className="ig-quote-card">
        <div className="ig-quote-box">
          <div
            ref={quoteRef}
            className="ig-quote-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {quoteAuthor && <p className="ig-quote-author">— {quoteAuthor}</p>}
      </div>
    </IGCardFrame>
  );
}
