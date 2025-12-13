import CCard from "../../components/CCard"
import { useHomepageSection } from "../../hooks/useHomepageSection";
import { formatDate } from "../../methods/formatting";

import "./List.css"

export default function List({ section }: { section:string }) {
  const { data, loading } = useHomepageSection(section, undefined);

  if (loading) {
    return <div>Loading…</div>;
  } 

  return (
    <div>
      <div className="subpage-list">
        {data?.articles.map(article => (
          <CCard
            slug={article.slug}
            section={data.section}
            title={article.title}
            image={article.image_url || ""}
            tag={article.subsection}
            date={formatDate(article.date_published)}
            category="subpage"
          />
        ))} 
      </div>
    </div>
  );
}
