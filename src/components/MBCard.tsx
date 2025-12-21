import { Link } from "react-router-dom";
import "./Card.css"

export default function MBCard({
  slug,
  section,
  title,
  image,
  tag,
  date,
}: {
  slug: string;
  section: string;
  title: string;
  image: string;
  tag: string;
  date: string;
}) {
  return (
    <div className="card mb-card">
      <Link to={`/article/${slug}`} className="link">
        <div className="ratio-7-5">
          <img src={image} alt={title} />
        </div>

        { (tag != "") && <h2 className={`tag tag-major-mbcard tag-${section.toLowerCase()}`}> {tag.toUpperCase()} </h2> }

        <h3 className="mbcard-title"> 
          <span className="wipe">{title}</span>
        </h3>
    
        <span className="date"> {date} </span>
      </Link>
    </div>
  );
}
