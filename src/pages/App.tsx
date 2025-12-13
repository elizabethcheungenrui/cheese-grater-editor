import { Routes, Route } from "react-router-dom";
import HomePage from "./home/HomePage";
import SectionList from "./section-list/SectionList";
import PrintEdition from "./section-list/PrintEdition";
import ArticlePage from "./article/ArticlePage";

import WhoWeAre from "./more/WhoWeAre";
import GetInvolved from "./more/GetInvolved";
import Awards from "./more/Awards";
import PastEditors from "./more/PastEditors";
import Honorary from "./more/Honorary";

import ContactUs from "./more/ContactUs"; 
import Training from "./more/Training";
import HelpWelfare from "./more/HelpWelfare";
import Anonymous from "./more/Anonymous";

import { Analytics } from "@vercel/analytics/react"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<SectionList section="News" />} />
        <Route path="/humour" element={<SectionList section="Humour" />} />
        <Route path="/voices" element={<SectionList section="Voices" />} />
        <Route path="/podcast" element={<SectionList section="Podcast" />} />
        <Route path="/print" element={<PrintEdition/>} />

        <Route path="/article/:slug" element={<ArticlePage />} />


        <Route path="/who-we-are" element={<WhoWeAre/>} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/past-editors" element={<PastEditors />} />
        <Route path="/life-members" element={<Honorary />} />


        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/anonymous-form" element={<Anonymous />} />
        <Route path="/training-style" element={<Training />} />
        <Route path="/help-welfare" element={<HelpWelfare />} />
      </Routes>
      <Analytics />
    </>
  );
}
