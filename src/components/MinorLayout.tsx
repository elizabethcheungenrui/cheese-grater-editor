import "./MinorLayout.css"

import CCard from "./CCard";
import type { HomepageSection } from "../api/getHomepageSection";
import { formatDate } from "../methods/formatting";

export default function MinorLayout({ data }: { data: HomepageSection }) {
  if (!data || !data.articles || data.articles.length < 3) {
    return null; // or a placeholder skeleton
  }

  return (
    <div className={`minor-layout minor-layout-${data.section}`}>
    
    <h3 className="minor-section-title">{data.section}</h3>

    {data.articles.map(article => (
      <CCard
        slug={article.slug}
        section={data.section}
        title={article.title}
        image={article.image_url || ""}
        tag={article.subsection}
        date={formatDate(article.date_published)}
        category="layout"
      />
    ))} 
    </div>
  );
}
