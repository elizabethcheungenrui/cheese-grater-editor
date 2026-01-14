import Footer from "./header-footer/Footer";
import Header from "./header-footer/Header";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="page-desktop">
      <Header />
      <div className="not-found">
        <h1>404 Not Found</h1>
        <p>Either we've cocked up and routed this link to something that doesn't exist, or you just aren't that good at typing in links yourself. Maybe try searching up what you want instead?</p>
      </div>
      <Footer />
    </div>
  );
}
