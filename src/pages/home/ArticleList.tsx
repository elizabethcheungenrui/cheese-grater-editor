import "./ArticleList.css"

import { useHomepageSection } from "../../hooks/useHomepageSection";  
import { formatDate, truncateWords } from "../../methods/formatting";
import { Link } from "react-router-dom";

import BCard from "../../components/BCard";
import { useIsMobile } from "../../hooks/useIsMobile";

type Sections = "voices" | "news" | "humour" | "graphics";

const sectionInfo: Record<Sections, [string, string]> = {
  voices: [
    "Tell the rest of UCL what you think",
    "See the rest of our voice pieces and letters →"
  ],
  news: [
    "Your most-trusted source of UCL Students' Union and campus news",
    "See all of our news and investigations stories →"
  ],
  humour: [
    "The ONLY funny people at UCL x",
    "See us take the piss out of everything else →"
  ],
  graphics: [
    "Lorem Ipsum",
    "Lorem Ipsum"
  ]
};

function toKnownSection(s: string): Sections | null {
  const k = s.toLowerCase();
  return (["voices", "news", "humour", "graphics"] as const).includes(
    k as Sections
  )
    ? (k as Sections)
    : null;
}

const homepageSections = ["voices", "news", "humour"] as const;
type HomepageSection = typeof homepageSections[number];

export default function ArticleList({ section }: { section: string }) {
 
  const { data, loading } = useHomepageSection(section, 9);

  const isMobile = useIsMobile();

  if (loading) {
    return <div>Loading…</div>;
  } 

  const key = toKnownSection(data!.section);
  const safeKey = key ?? "news";
  
  const isHomepageSection = homepageSections.includes(key as HomepageSection);

  const start = isHomepageSection ? 3 : 0;
  const end = isHomepageSection ? 9 : 6;

  const articlesToShow = data!.articles.slice(start, end);

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
              
              <p>{ sectionInfo[safeKey][0] }</p>

              <Link 
                to={`/${dataSection}`} 
                className= {
                  `underline-link
                  ${dataSection}-link`
                }>
                { sectionInfo[safeKey][1] }
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

            {(isMobile
              ? articlesToShow.slice(0, 4)
              : articlesToShow.slice(2, 6)
            ).map(article => (
              <BCard
                slug={article.slug}
                section={data!.section}
                title={article.title}
                summary=""
                image={article.image_url || ""}
                tag={article.subsection}
                date={formatDate(article.date_published)} />
            ))}
          
          </div>
        </div>
      </div>
    </div>
  );
}
