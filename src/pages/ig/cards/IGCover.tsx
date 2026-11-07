import "./IGCover.css";
import { useLayoutEffect, useRef } from "react";

import type { Article } from "../../../lib/types/Article";
import IGCardFrame from "./IGCardFrame";
import cgLogo from "../../../assets/ig/cg-full-opacity.png";

function renderAuthors(article: Article) {
  return article.authors.map(({ name }, i) => {
    const total = article.authors.length;

    return (
      <span key={`${name}-${i}`}>
        {name}
        {total > 1 && i < total - 2 && ", "}
        {total > 1 && i === total - 2 && " & "}
      </span>
    );
  });
}

export default function IGCover({ article }: { article: Article }) {
  const coverTitle = article.title;
  const imageCaption = article.image_caption || "";
  const coverSummary = article.summary || "";
  const authorsKey = article.authors?.map(({ name }) => name).join("|") ?? "";

  const headingRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    let cancelled = false;

    function fitTitle() {
      const heading = headingRef.current;
      const title = titleRef.current;
      const image = imageRef.current;

      if (!heading || !title || !image) return;

      const min = 14;
      const max = 60;

      const fits = (size: number) => {
        title.style.fontSize = `${size}px`;

        const headingBottom =
          heading.offsetTop + heading.scrollHeight;

        const imageTop = image.offsetTop;

        return (
          headingBottom + 5 <= imageTop &&
          title.scrollWidth <= title.clientWidth + 1
        );
      };

      if (!fits(min)) {
        title.dataset.overflow = "true";
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

      title.style.fontSize = `${low}px`;
      title.dataset.overflow = "false";
    }

    fitTitle();

    void document.fonts.ready.then(() => {
      if (!cancelled) fitTitle();
    });

    return () => {
      cancelled = true;
    };
  }, [
    coverTitle,
    article.subsection,
    article.role,
    authorsKey,
  ]);

  return (
    <IGCardFrame section={article.section}>
      <img
        className="ig-logo"
        src={cgLogo}
      />

      <div 
        className="ig-heading"
        ref={headingRef}
      >
        <h2 className="ig-section">
          {article.subsection}
        </h2>

        <h1 
          className="ig-title"
          ref={titleRef}
        >
          {coverTitle}
        </h1>

        <p className="ig-author">
          {renderAuthors(article)}
        </p>

        <p className="ig-role">
          {article.role}
        </p>
      </div>
     
      <div
        className="ig-image-container"
        ref={imageRef}
      >
        {article.image_url && (
          <img
            className="ig-image"
            src={article.image_url}
          />
        )}

        {coverSummary && (
          <div className="ig-summary-box">
            <p
              className="ig-image-caption"
              dangerouslySetInnerHTML={{
                __html: imageCaption,
              }}  
            />

            <p
              className="ig-article-summary"
              dangerouslySetInnerHTML={{
                __html: coverSummary,
              }}
            />
          </div>
        )}
      </div>
    </IGCardFrame>
  );
}
