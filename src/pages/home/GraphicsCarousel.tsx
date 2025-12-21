import { useEffect, useRef, useState } from "react";
import { useHomepageSubsection } from "../../hooks/useHomepageSubsection";
import { formatDate } from "../../methods/formatting";
import BCard from "../../components/BCard";

import "./GraphicsCarousel.css";
import { Link } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function GraphicsCarousel() {
  const isMobile = useIsMobile();
  const CARD_COUNT = 8;
  const VISIBLE = isMobile ? 1 : 4;
  const BUFFER = VISIBLE * 2;
  const step = 100 / VISIBLE;

  const trackRef = useRef<HTMLDivElement>(null);
  
  const [index, setIndex] = useState(BUFFER);
  useEffect(() => { setIndex(BUFFER); }, [BUFFER]);
  
  const { data, loading } = useHomepageSubsection("Graphics", CARD_COUNT);
  
  const items = data?.articles ?? [];
  const clonesBefore = items.slice(-BUFFER);
  const clonesAfter = items.slice(0, BUFFER);
  const extended = [...clonesBefore, ...items, ...clonesAfter];

  useEffect(() => {
    if (loading) return;

    const id = setInterval(() => {
      setIndex(i => i + 1);
    }, 5000);

    return () => clearInterval(id);
  }, [loading]);

  
  useEffect(() => {
    if (loading || !trackRef.current) return;

    // crossed right boundary → snap immediately
    if (index === items.length + VISIBLE) {
      trackRef.current.style.transition = "none";
      setIndex(VISIBLE);
      requestAnimationFrame(() => {
        trackRef.current!.style.transition =
          "transform 600ms cubic-bezier(0.2, 0, 0, 1)";
      });
    }

    // crossed left boundary → snap immediately
    if (index === VISIBLE - 1) {
      trackRef.current.style.transition = "none";
      setIndex(items.length + VISIBLE - 1);
      requestAnimationFrame(() => {
        trackRef.current!.style.transition =
          "transform 600ms cubic-bezier(0.2, 0, 0, 1)";
      });
    }
  }, [index, items.length, loading]);

  if (loading) {
    return <div>Loading…</div>;
  }

  return (
    <div className="carousel">
      <div className="main-grid">
        <div className="titles">
          <h3 className="graphics-h3">Graphics</h3>
              
          <Link to="/humour" className= "underline-link graphics-link">Funny text for link to graphics</Link>
        </div>

        <div className="carousel-viewport">
          <div
            ref={trackRef}
            className="carousel-track"
            style={{
              transform: `translateX(-${index * step}%)`,
            }}
          >
            {extended.map(article => (
              <div className="carousel-card">
                <BCard
                  slug={article.slug}
                  section={data!.section}
                  title={article.title}
                  summary=""
                  image={article.image_url || ""}
                  tag=""
                  date={formatDate(article.date_published)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
