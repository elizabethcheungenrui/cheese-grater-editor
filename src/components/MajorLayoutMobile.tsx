import "./MajorLayoutMobile.css"

import ACard from "./ACard";
import MBCard from "./MBCard";
import type { HomepageSection } from "../api/getHomepageSection";
import { formatDate, truncateWords } from "../methods/formatting";

export default function MajorLayoutMobile({ data }: { data: HomepageSection }) {
  
  if (!data || !data.articles || data.articles.length < 3) {
    return null; // or a placeholder skeleton
  }

  return (
    <div className="major-layout-main-grid-mobile">
      <h3 className={`major-section-title title-${data.section}`}>{data.section}</h3>

      <ACard
        slug={data.articles[0].slug}
        section={data.section}
        title={data.articles[0].title}
        summary={truncateWords(data.articles[0].summary!, 160) || ""}
        image={data.articles[0].image_url ?? data.articles[0].author_thumbnail}
        tag={data.articles[0].subsection}
        date={formatDate(data.articles[0].date_published)}
      />

      <MBCard
        slug={data.articles[1].slug}
        section={data.section}
        title={data.articles[1].title}
        image={data.articles[1].image_url ?? data.articles[1].author_thumbnail}
        tag={data.articles[1].subsection}
        date={formatDate(data.articles[1].date_published)}
      />
          
      <MBCard
        slug={data.articles[2].slug}
        section={data.section}
        title={data.articles[2].title}
        image={data.articles[2].image_url ?? data.articles[1].author_thumbnail}
        tag={data.articles[2].subsection}
        date={formatDate(data.articles[2].date_published)}
      /> 
      
      <div className="button-row">
        <a href={`#${data.section.toLowerCase()}`}>
          <h3 className={`button title-${data.section}`}>See More</h3>
        </a>
      </div>
    </div>
  );
}

