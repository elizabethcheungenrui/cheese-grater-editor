import Footer from "../header-footer/Footer";
import HeaderDesktop from "../header-footer/HeaderDesktop";
import ModifyArticleList from "./ModifyArticleList";

export default function EditorModify() {
  return (
    <div className="page-desktop">
      <HeaderDesktop />
      <ModifyArticleList />
      <Footer />
    </div>
  );
}
