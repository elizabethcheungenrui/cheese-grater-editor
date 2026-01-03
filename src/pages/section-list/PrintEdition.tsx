import Footer from "../header-footer/Footer";
import Title from "./Title";
import { useIsMobile } from "../../hooks/useIsMobile";
import { usePrintEdition } from "../../hooks/usePrintEdition";
import HeaderMobile from "../header-footer/HeaderMobile";
import HeaderDesktop from "../header-footer/HeaderDesktop";
import "./PrintEdition.css"
import { Link } from "react-router-dom";

export default function PrintEdition() {
  const isMobile = useIsMobile();
  const { data, loading, error } = usePrintEdition()

  if (loading) return <div>Loading past issues…</div>
  if (error) return <div>Failed to load past issues.</div>
  
  return (
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}
      <Title sectionUpper={"print"} />
      <div className="print-edition-page">  
        {data.map(issue => {
          const slug = issue.name.replace(".png", "")

          return (
          <div key={issue.name} className="issue-card">
            <Link 
              key={slug}
              to={`/past-issues/${slug}`}>
              <img src={issue.url} alt={slug} />
            </Link>
          </div>
          )} 
        )}
      </div>
      <Footer />
    </div>
  );
}
