import "./Section.css"

type Data = {
  section: string;
  title: string;
  articles: {
    id: number;
    title: string;
    summary: string;
    image: string;
    tag: string;
    date: string;
  }[];
};

export default function Section({ data }: { data: Data }) {
  return (
    <div>
      <div className="section-list">
        <div className="section-list-title">
          <h3>{data.title}</h3>
          <p></p>
        </div>
      </div>
    </div>
  );
}
