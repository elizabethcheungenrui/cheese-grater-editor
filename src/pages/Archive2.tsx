import { Link } from "react-router-dom";
import { useHomepageSection } from "../hooks/useHomepageSection";
import "./Archive2.css";

export default function Archive2() {
  const { data: newsData, loading: newsLoading } = useHomepageSection("News", 5);
  const { data: humourData, loading: humourLoading } = useHomepageSection("Humour", 5);

  if (newsLoading || humourLoading) {
    return <div>Loading…</div>;
  } 

  return (
    <div className="archive-scale">
      <div className="archive-page">
        <header className="page-header">
          <img
            src="https://lrhddyosfvnhpxojsjpa.supabase.co/storage/v1/object/public/images/archive/cg-logo-archive.png"
            alt="Cheese Grater Magazine"
          />
          <nav className="header-nav">
            <ul>
              <li><a href="/">HOME</a></li>
              <li><a href="/news">INVESTIGATIONS</a></li>
              <li><a href="/humour">HUMOUR</a></li>
              <li><a href="/past-issues">BACK ISSUES</a></li>
              <li><a href="/about">ABOUT US</a></li>
              <li><a href="/contact-us">CONTACT</a></li>
            </ul>
          </nav>
        </header>

        <div className="page-body">
          <div className="content">
            <div className="section">
              <a href="/news">
                <img src="https://lrhddyosfvnhpxojsjpa.supabase.co/storage/v1/object/public/images/archive/cg-invest-top.png" alt="Investigations" />
              </a>

              <div className= "body">
                <img src="https://lrhddyosfvnhpxojsjpa.supabase.co/storage/v1/object/public/images/archive/cg-detective.png" />

                <div className="content">
                  {newsData?.articles.map(article => (
                    <article>
                      <Link to={`/article/${article.slug}/#`}> 
                        <h3>{article.title}</h3>
                        <p>{article.summary}</p>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="section">
              <a href="/humour">
                <img src="https://lrhddyosfvnhpxojsjpa.supabase.co/storage/v1/object/public/images/archive/cg-humour-top.png" alt="Humour" />
              </a>

              <div className="body">
                <img src="https://lrhddyosfvnhpxojsjpa.supabase.co/storage/v1/object/public/images/archive/cg-jester.png" />

                <div className="content">
                  {humourData?.articles.map(article => (
                    <article>
                      <Link to={`/article/${article.slug}/#`}> 
                        <h3>{article.title}</h3>
                        <p>{article.summary}</p>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <img className="print-img" src="https://lrhddyosfvnhpxojsjpa.supabase.co/storage/v1/object/public/past-issues/CG93-Autumn-2025-updated.png" />
        </div>

        <div className="page-footer">
          <p>© The Cheese Grater Magazine Society, Students' Union UCL, 2/F Bloomsbury Theatre, 15 Gordon Street, London, WC1H 0AH<br />This is a faithful recreation of the <i>Cheese Grater</i> website circa 2012-2016.<br />Just goes to show how far we've come, eh?<br />For the original reference see this <a href="https://web.archive.org/web/20120724103754/http://www.cheesegratermagazine.org/" target="_blank">archived link</a>.</p>
        </div>
      </div>
    </div>
  );
}
