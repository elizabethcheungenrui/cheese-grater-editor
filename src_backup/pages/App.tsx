import { Routes, Route } from "react-router-dom";
import HomePage from "./home/HomePage";
import SectionList from "./section-list/SectionList";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/news" element={<SectionList section="news" />} />
      <Route path="/humour" element={<SectionList section="humour" />} />
      <Route path="/voices" element={<SectionList section="voices" />} />
    </Routes>
  );
}
