import "./Card.css"

export default function CCard({
  section,
  title,
  image,
  tag,
  date,
}: {
  section: string;
  title: string;
  image: string;
  tag: string;
  date: string;
}) {
  return (
    <div className="card c-card">
      
      <div className="ratio-7-5">
        <img src={image} alt={title} />
      </div>

      <span className={`tag tag-minor tag-${section.toLowerCase()}`}> {tag.toUpperCase()} </span>

      <h3> {title} </h3>

      <span className="date c-card-date"> {date} </span>

    </div>
  );
}
