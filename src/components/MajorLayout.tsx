import "./MajorLayout.css"

import ACard from "./ACard";
import BCard from "./BCard";
import type { HomepageSection } from "../api/getHomepageSection";
import { formatDate, truncateWords } from "../methods/formatting";

export default function MajorLayout({ data }: { data: HomepageSection }) {
  
  if (!data || !data.articles || data.articles.length < 3) {
    return null; // or a placeholder skeleton
  }

  return (
    <div className="major-layout-main-grid">
      <h3 className={`major-section-title title-${data.section}`}>{data.section}</h3>

      <ACard
        section={data.section}
        title={data.articles[0].title}
        summary={truncateWords(data.articles[0].summary!, 170) || ""}
        image={data.articles[0].image_url || ""}
        tag={data.articles[0].subsection}
        date={formatDate(data.articles[0].date_published)}
      />

      <section className="major-layout-bottom-grid">
        <BCard
          section={data.section}
          title={data.articles[1].title}
          summary={truncateWords(data.articles[1].summary!, 120) || ""}
          image={data.articles[1].image_url || ""}
          tag={data.articles[1].subsection}
          date={formatDate(data.articles[1].date_published)}
        />
            
        <BCard
          section={data.section}
          title={data.articles[2].title}
          summary={truncateWords(data.articles[2].summary!, 120) || ""}
          image={data.articles[2].image_url || ""}
          tag={data.articles[2].subsection}
          date={formatDate(data.articles[2].date_published)}
        /> 
      </section>
    </div>
  );
}

