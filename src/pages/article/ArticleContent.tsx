import "./ArticleContent.css";
import type { Article } from "../../types/Article"
import { Link } from "react-router-dom";
import { formatDate } from "../../methods/formatting";  
import stringToJSX from "../../methods/stringToJSX";
import { useHomepageSection } from "../../hooks/useHomepageSection";
import CCard from "../../components/CCard";
import { useIsMobile } from "../../hooks/useIsMobile";
import MBCard from "../../components/MBCard";

export default function ArticleContent({ article, isEditor }: { article: Article, isEditor: boolean }) {
  const { data, loading } = useHomepageSection(article.section, 9);
  const isMobile = useIsMobile();

  if (loading || !data) return (<div>Loading</div>);

  const filtered = data.articles.filter(a => a.slug !== article.slug);
  const dataTop = filtered.slice(0,4);
  const dataBottom = !isMobile ? filtered.slice(4,8) : [];

  return (
    <div className="article-container">
      <div className="container-main">
        <div className="main-article">
          <div className="main-heading">
            <p className="date"><Link to={`/${article.section}`} className="section-link">{article.section}</Link> / {formatDate(article.date_published)}</p>  
            
            <h1>{article.title}</h1>
          </div>
          
          <div className="main-content">
            {article.summary && (<h2>{article.summary}</h2>)}

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
        { !isEditor && (<div className="more-article">
          <span className="readmore">{data.section == "Podcast" ? "Listen to more" : "Read more"}</span>
          <div className="article-row">
            {!isMobile 
              ? (dataTop!.map(article => (
                  <CCard
                    slug={article.slug}
                    section={data!.section}
                    title={article.title}
                    image={article.image_url ?? article.author_thumbnail}
                    tag={article.subsection}
                    date={formatDate(article.date_published)}
                    category="subpage"
                  />)))
              : (dataTop!.map(article => (
                  <MBCard
                    slug={article.slug}
                    section={data!.section}
                    title={article.title}
                    image={article.image_url ?? article.author_thumbnail}
                    tag={article.subsection}
                    date={formatDate(article.date_published)}
                  />)))} 
          </div>
          {!isMobile && (
            <div className="article-row">
              {dataBottom.map(article => (
                <CCard
                  key={article.slug}
                  slug={article.slug}
                  section={data.section}
                  title={article.title}
                  image={article.image_url ?? article.author_thumbnail}
                  tag={article.subsection}
                  date={formatDate(article.date_published)}
                  category="subpage"
                />
              ))}
            </div>
          )}
        </div>)}
      </div>

      <div className="container-side">
        { !isEditor && (<div className="contact-newsletter">
          <span className="side-header">Got a story for us?</span>
          <p>If you have something you want to share with our journalists, send us a tip via our <a href="https://instagram.com/uclcheesegrater" target="blank">socials</a>, <Link to="/get-involved" target="_blank">email</Link>, or using our <Link to="/anonymous-form" target="_blank">anonymous webform.</Link></p>
          
          <span className="side-header">Join our fortnightly newsletter</span>
          <p>The Digestive is our fortnightly newsletter, covering the latest campus news, satire, and student discourse every other Monday during term time.</p>
          <a href="https://us17.campaign-archive.com/home/?u=65bd5c7a770205040fd2e9e8a&id=9679db51c3" target="_blank"><button><h3 className="button-h3">Subscribe</h3></button></a>
        </div>)}
      </div>
    </div>
  );
}
