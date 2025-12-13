import { Link } from "react-router-dom";
import "./Card.css"

export default function CCard({
  slug,
  section,
  title,
  image,
  tag,
  date,
  category,
}: {
  slug: string;
  section: string;
  title: string;
  image: string;
  tag: string;
  date: string;
  category: string;
}) {
  return (
    <div className="card c-card">
      <Link to={`/article/${slug}/#`} className="link"> 
        <div className="ratio-7-5">
          <img src={image} alt={title} />
        </div>

        <h2 className={`tag tag-minor tag-${section.toLowerCase()}`}> {tag.toUpperCase()} </h2>

        <h3 className={`h3-${category}`}> 
        <span>{title}</span>
        </h3>

        <span className={`date c-card-date ${category}`}> {date} </span>
      </Link>
    </div>
  );
}
