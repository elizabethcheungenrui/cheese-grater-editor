import "./ArticleList.css"

import { useHomepageSection } from "../../hooks/useHomepageSection";  
import { formatDate, truncateWords } from "../../methods/formatting";
import { Link } from "react-router-dom";

import BCard from "../../components/BCard";
import { useIsMobile } from "../../hooks/useIsMobile";
import MBCard from "../../components/MBCard";

const sectionInfo: Record<string, [string, string]> = {
  "Voices": [
    "Tell the rest of UCL what you think",
    "See the rest of our voice pieces and letters →"
  ],
  "News": [
    "Your most-trusted source of UCL Students' Union and campus news",
    "See all of our news and investigations stories →"
  ],
  "Humour": [
    "The ONLY funny people at UCL x",
    "See us take the piss out of everything else →"
  ],
};

export default function ArticleList({ section }: { section: string }) {
 
  const { data, loading } = useHomepageSection(section, 9);

  const isMobile = useIsMobile();

  if (loading) {
    return <div>Loading…</div>;
  } 

  const articlesToShow = data!.articles;

  const dataSection = data!.section.toLowerCase();

  return (
    <div id={`${data?.section.toLowerCase()}`}>
      <div className="article-list">
        <div className="main-grid">
          <div className="top-grid">
            <div className="titles">
              <h3 className={`${dataSection}-h3`}>
                { data!.section } 
              </h3>
              
              <p>{ sectionInfo[data!.section][0] }</p>

              <Link 
                to={`/${dataSection}`} 
                className= {
                  `underline-link
                  ${dataSection}-link`
                }>
                { sectionInfo[data!.section][1] }
              </Link>
            </div>

            {!isMobile && (
              <>
                <BCard
                  slug={articlesToShow[0].slug}
                  section={data!.section}
                  title={articlesToShow[0].title}
                  summary={truncateWords(articlesToShow[0].summary!, 120) || ""}
                  image={articlesToShow[0].image_url || ""}
                  tag={articlesToShow[0].subsection}
                  date={formatDate(articlesToShow[0].date_published)} />
            
                <BCard
                  slug={articlesToShow[1].slug}
                  section={data!.section}
                  title={articlesToShow[1].title}
                  summary={truncateWords(articlesToShow[1].summary!, 120) || ""}
                  image={articlesToShow[1].image_url || ""}
                  tag={articlesToShow[1].subsection}
                  date={formatDate(articlesToShow[1].date_published)} />
              </>
            )}

          </div>

          <div className="bottom-grid">

            {isMobile
              ? (articlesToShow.slice(0, 4).map(article => 
                (
                  <MBCard
                    slug={article.slug}
                    section={data!.section}
                    title={article.title}
                    image={article.image_url || ""}
                    tag={article.subsection}
                    date={formatDate(article.date_published)} />
                ))) 
              : (articlesToShow.slice(2, 6).map(article => 
                (
                  <BCard
                    slug={article.slug}
                    section={data!.section}
                    title={article.title}
                    summary=""
                    image={article.image_url || ""}
                    tag={article.subsection}
                    date={formatDate(article.date_published)} />
                )))}
          </div>
        </div>
      </div>
    </div>
  );
}
