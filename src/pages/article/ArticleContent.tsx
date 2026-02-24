import "./ArticleContent.css";
import type { Article } from "../../lib/types/Article";
import { formatDate } from "../../lib/methods/formatting";
import stringToJSX from "../../lib/methods/stringToJSX";

export default function ArticleContent({ article }: { article: Article }) {
  return (
    <div className="article-container">
      <div className="main-article">
        <div className="main-heading">
          <p className="date">
            {article.subsection} / {formatDate(article.date_published)}
          </p>

          <h1>{article.title}</h1>
        </div>

        <div className="main-content">
          {article.summary && (
            <p
              className="article-summary"
              dangerouslySetInnerHTML={{
                __html: article.summary,
              }}
            />
          )}

          <div className="author-box">
            <img
              className="author-image"
              src={
                article.author_thumbnail ??
                "https://lrhddyosfvnhpxojsjpa.supabase.co/storage/v1/object/public/images/author_thumbnails/cg_author.jpeg"
              }
              alt={article.section}
            />
            <div className="author-text">
              <span className="author">
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
                  : "Unable to retrieve"}
              </span>
              <span className="role">{article.role}</span>
            </div>
          </div>

          {article.image_url && (
            <img src={article.image_url} alt={article.image_caption || ""} />
          )}

          {article.image_caption && (
            <p className="caption">{article.image_caption}</p>
          )}

          {article.content && (stringToJSX(article.content) || "")}
        </div>
      </div>
    </div>
  );
}
