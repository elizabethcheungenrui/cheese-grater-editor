import Footer from "../header-footer/Footer";
import Header from "../header-footer/Header";
import List from "./List";

export default function SectionList({ section }: { section: string }) {
  return (
    <div>
      <Header />
      <List section={section} />
      <Footer />
    </div>
  );
}
