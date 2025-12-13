import "./MoreTitle.css"

export default function MoreTitle({ headings }: {headings: string[] }) {  
  return (
    <div className="more-title">
      <h3 className="heading">{headings[0]}</h3>
    </div>
  );
}
