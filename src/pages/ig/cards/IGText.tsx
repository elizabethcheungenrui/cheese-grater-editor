import "./IGText.css";

import { useLayoutEffect, useRef } from "react";

import IGCardFrame from "./IGCardFrame"
import cgLogo from "../../../assets/ig/cg-full-opacity.png";

export default function IGText({
  section,
  content,
}: {
  section: string;
  content: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let cancelled = false;

    function fitText() {
      const element = contentRef.current;
      const box = boxRef.current;

      if (!element || !box) return;

      const min = 14;
      const max = 26;

      const fits = (size: number): boolean => {
        element.style.fontSize = `${size}px`;

        const contentHeight =
          element.getBoundingClientRect().height;

        const availableHeight =
          box.getBoundingClientRect().height;

        return (
          contentHeight <= availableHeight + 1 &&
          element.scrollWidth <= box.clientWidth + 1
        );
      };

      if (!fits(min)) {
        element.dataset.overflow = "true";
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

      element.style.fontSize = `${low}px`;
      element.dataset.overflow = "false";
    }

    fitText();

    void document.fonts.ready.then(() => {
      if (!cancelled) fitText();
    });

    return () => {
      cancelled = true;
    };
  }, [content]);

  return (
    <IGCardFrame section={section}>
      <img
        className="ig-logo-text"
        src={cgLogo}
      />

      <div 
        className="ig-text-box"
        ref={boxRef}
      >
        <div
          ref={contentRef}
          className="ig-text-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </IGCardFrame>
  );
}
