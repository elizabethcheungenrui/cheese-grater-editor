import "./IGCover.css";
import type { Article } from "../../lib/types/Article";
import { useRef } from "react";
import { useFitText, useFitTextWidth } from "../../lib/methods/formatting";
import IGCardFrame from "./IGCardFrame";

function renderAuthors(article: Article) {
  if (!article.authors?.length) return "Unable to retrieve";

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
  const coverTitle = article.igCover?.title || article.title;
  const coverSummary = article.igCover?.summary || article.summary || "";
  
  const titleRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const authorRef = useRef<HTMLParagraphElement>(null);

  useFitText(titleRef, 16, 30, [coverTitle]);
  useFitText(summaryRef, 12, 15, [coverSummary]);
  useFitTextWidth(authorRef, 10, 13, [
    article.authors,
    article.role,
  ]);

  return (
    <IGCardFrame section={article.section}>
      <div className="main-heading">
        <h1 ref={titleRef} className="ig-title">
          {coverTitle}
        </h1>
      </div>

      <div className="main-content">
        <div className="yellow-box">
          <p ref={authorRef} className="ig-author">
            By {renderAuthors(article)} {article.role && <i>[{article.role}]</i>}
          </p>

          {coverSummary && (
            <div className="summary-box">
              <p
                ref={summaryRef}
                className="article-summary"
                dangerouslySetInnerHTML={{
                  __html: coverSummary,
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
    </IGCardFrame>
  );
}
