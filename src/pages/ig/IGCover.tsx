import "./IGCover.css";
import type { Article } from "../../lib/types/Article";
import { useLayoutEffect, useRef } from "react";

function fitTextToContainer(el: HTMLElement, minPx: number, maxPx: number) {
  let low = minPx;
  let high = maxPx;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    el.style.fontSize = `${mid}px`;

    if (el.scrollHeight > el.parentElement!.clientHeight) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  el.style.fontSize = `${high}px`;
}

export default function IGCover({ article }: { article: Article }) {
  const section =
    article.section === "Humour"
      ? "Humour & Satire"
      : article.section === "News"
        ? "News & Investigations"
        : article.section === "Voices"
          ? "Voices & Reviews"
          : "Other";

  const titleRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (!titleRef.current) return;

    fitTextToContainer(
      titleRef.current,
      16, // minimum readable size
      22, // maximum design size
    );
  }, [article.title]);

  return (
    <div className={`ig-container ${article.section.toLowerCase()}`}>
      <div className="main-heading">
        <p className="ig-section">{section}</p>
        <div className="ig-title-box">
          <h1 ref={titleRef} className="ig-title">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="main-content">
        <div className="yellow-box">
          <p className="ig-author">
            By{" "}
            {article.authors?.length
              ? article.authors.map(({ name }, i) => {
                  const total = article.authors.length;

                  return (
                    <>
                      {name}
                      {total > 1 && i < total - 2 && ", "}
                      {total > 1 && i === total - 2 && " & "}
                    </>
                  );
                })
              : "Unable to retrieve"}{" "}
            {article.role && <i>[{article.role}]</i>}
          </p>

          {article.summary && (
            <div className="summary-box">
              <p
                ref={summaryRef}
                className="article-summary"
                dangerouslySetInnerHTML={{
                  __html: article.summary,
                }}
              />
            </div>
          )}
        </div>

        {article.image_url && (
          <img
            className="ig-image"
            src={article.image_url}
            alt={article.image_caption || ""}
          />
        )}
      </div>
    </div>
  );
}
