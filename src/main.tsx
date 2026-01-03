import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./pages/App";
import "./main.css";
import ScrollToTop from "./methods/ScrollToTop";
import * as pdfjsLib from "pdfjs-dist";
import {
  EventBus,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer.mjs"

import "pdfjs-dist/web/pdf_viewer.css"

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
