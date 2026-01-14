import Footer from "../header-footer/Footer";
import Header from "../header-footer/Header";
import ModifyArticleList from "./ModifyArticleList";

export default function EditorModify() {
  return (
    <div className="page-desktop">
      <Header />
      <ModifyArticleList />
      <Footer />
    </div>
  );
}
