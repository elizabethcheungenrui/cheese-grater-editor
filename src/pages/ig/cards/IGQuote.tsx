import { useLayoutEffect, useRef } from "react";
import IGCardFrame from "./IGCardFrame";
import "./IGQuote.css";

import quotes from "../../../assets/ig/quotes.png";

export default function IGQuote({
  section,
  content,
  quoteAuthor,
  quoteAuthorRole,
}: {
  section: string;
  content: string;
  quoteAuthor: string;
  quoteAuthorRole: string;
}) {  
  const boxRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const attributionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let cancelled = false;

    function fitQuote() {
      const box = boxRef.current;
      const quote = quoteRef.current;
      const attribution = attributionRef.current;

      if (!box || !quote) return;

      const min = 14;
      const max = 23;

      const fits = (size: number): boolean => {
        quote.style.fontSize = `${size}px`;

        const boxRect = box.getBoundingClientRect();

        const lastElement = attribution ?? quote;
        const lastRect = lastElement.getBoundingClientRect();

        const boxStyle = getComputedStyle(box);
        const paddingBottom =
          parseFloat(boxStyle.paddingBottom) || 0;

        return (
          lastRect.bottom <=
            boxRect.bottom - paddingBottom + 1 &&
          quote.scrollWidth <= quote.clientWidth + 1 &&
          (!attribution ||
            attribution.scrollWidth <=
              attribution.clientWidth + 1)
        );
      };

      if (!fits(min)) {
        quote.dataset.overflow = "true";
        return;
      }

      let low = min;
      let high = max;

      for (let i = 0; i < 12; i++) {
        const mid = (low + high) / 2;

        if (fits(mid)) {
          low = mid;
        } else {
          high = mid;
        }
      }

      quote.style.fontSize = `${low}px`;
      quote.dataset.overflow = "false";
    }

    fitQuote();

    void document.fonts.ready.then(() => {
      if (!cancelled) fitQuote();
    });

    return () => {
      cancelled = true;
    };
  }, [content, quoteAuthor, quoteAuthorRole]);

  return (
    <IGCardFrame section={section}>
      <img
        className="ig-quote-logo"
        src={quotes}
      />

      <div 
        className="ig-quote-box"
        ref={boxRef}
      >
        <div
          ref={quoteRef}
          className="ig-quote-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        {(quoteAuthor || quoteAuthorRole) && (
          <div
            className="ig-quote-attribution"
            ref={attributionRef}
          >
            {quoteAuthor && (
              <p className="ig-quote-author">
                {quoteAuthor}
              </p>
            )}

            {quoteAuthorRole && (
              <p className="ig-quote-author-role">
                {quoteAuthorRole}
              </p>
            )}
          </div>
        )}
      </div>
    </IGCardFrame>
  );
}
