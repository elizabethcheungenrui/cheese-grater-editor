import { Routes, Route } from "react-router-dom";
import HomePage from "./home/HomePage";
import SectionList from "./section-list/SectionList";
import PrintEdition from "./section-list/PrintEdition";
import PrintEditionViewer from "./section-list/PrintEditionViewer";
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

import NotFound from "./NotFound";
import Archive from "./Archive";

import { Analytics } from "@vercel/analytics/react"

import RequireEditor from "../auth/RequireEditor";
import Login from "../auth/Login";
import EditorMain from "./editor/EditorMain";
import EditorUploadPage from "./editor/EditorUploadPage";
import EditorModify from "./editor/EditorModify";
import ArticlePreview from "./editor/ArticlePreview";
import Archive2 from "./Archive2";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<SectionList section="News" />} />
        <Route path="/humour" element={<SectionList section="Humour" />} />
        <Route path="/voices" element={<SectionList section="Voices" />} />
        <Route path="/podcast" element={<SectionList section="Podcast" />} />
        <Route path="/past-issues" element={<PrintEdition/>} />
        <Route path="/past-issues/:slug" element={<PrintEditionViewer />} />

        <Route path="/article/:slug" element={<ArticlePage />} />


        <Route path="/about" element={<WhoWeAre/>} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/past-editors" element={<PastEditors />} />
        <Route path="/life-members" element={<Honorary />} />


        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/anonymous-form" element={<Anonymous />} />
        <Route path="/training-style" element={<Training />} />
        <Route path="/help-welfare" element={<HelpWelfare />} />
        
        <Route path="/archive2" element={<Archive />} />
        <Route path="/archive" element={<Archive2 />} />

        <Route path="/login" element={<Login />} />
        <Route element={<RequireEditor />}>
          <Route path="/editor/" element={<EditorMain />} />
          <Route path="/editor/upload-article" element={<EditorUploadPage mode="create" />} />
          <Route path="/editor/modify-article" element={<EditorModify />} />
          <Route path="/editor/edit/:id" element={<EditorUploadPage mode="edit" />} />
          <Route path="/editor/preview" element={<ArticlePreview />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </>
  );
}
