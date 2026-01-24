import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"

import RequireEditor from "../auth/RequireEditor";
import Login from "../auth/Login";
import EditorMain from "./editor/EditorMain";
import EditorUploadPage from "./editor/EditorUploadPage";
import EditorModify from "./editor/EditorModify";
import ArticlePreview from "./editor/ArticlePreview";
import EditorUploadPodcast from "./editor/EditorUploadPodcast";
import PodcastPreview from "./editor/PodcastPreview";
import NotFound from "./NotFound";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<RequireEditor />}>
          <Route path="/editor/" element={<EditorMain />} />
          <Route path="/editor/upload-article" element={<EditorUploadPage mode="create" />} />
          <Route path="/editor/upload-podcast" element={<EditorUploadPodcast mode="create" />} />
          <Route path="/editor/modify-article" element={<EditorModify />} />
          <Route path="/editor/edit/:id" element={<EditorUploadPage mode="edit" />} />
          <Route path="/editor/preview" element={<ArticlePreview />} />
          <Route path="/editor/preview-podcast" element={<PodcastPreview />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </>
  );
}
