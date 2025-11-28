import "./Card.css"

export default function BCard({
  section,
  title,
  summary,
  image,
  tag,
  date,
}: {
  section: string;
  title: string;
  summary: string;
  image: string;
  tag: string;
  date: string;
}) {
  return (
    <div className="card b-card">
    
      <div className="ratio-7-5">
        <img src={image} alt={title} />
      </div>

      <span className={`tag tag-major tag-${section.toLowerCase()}`}> {tag.toUpperCase()} </span>

      <h3> {title} </h3>
      
      <p> {summary} </p>

      <span className="date"> {date} </span>

    </div>
  );
}
