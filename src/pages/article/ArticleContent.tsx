import "./ArticleContent.css";
import type { Article } from "../../types/Article"
import { formatDate } from "../../methods/formatting";  
import stringToJSX from "../../methods/stringToJSX";

export default function ArticleContent({ article }: { article: Article }) {
  return (
    <div className="article-container">
      <div className="container-main">
        <div className="main-article">
          <div className="main-heading">
            <p className="date">{article.section} / {formatDate(article.date_published)}</p>  
            
            <h1>{article.title}</h1>
          </div>
          
          <div className="main-content">
            {article.summary && (
              <p
                className="article-summary"
                dangerouslySetInnerHTML={{
                  __html: (article.summary)}}
              />
            )}

            <div className="author-box">
              <img
                className="author-image"
                src={article.author_thumbnail ?? "https://lrhddyosfvnhpxojsjpa.supabase.co/storage/v1/object/public/images/author_thumbnails/cg_author.jpeg"}
                alt={article.section}
              />
              <div className="author-text">
                <span className="author">{article.author}</span>
                <span className="role">{article.role}</span>
              </div>
            </div>

            {article.image_url && (<img src={article.image_url} alt={article.image_caption || ""} />)}

            {article.image_caption && (<p className="caption">{article.image_caption}</p>)}

            {article.content && (stringToJSX(article.content) || "")}
          </div>
        </div>
      </div>
    </div>
  );
}
