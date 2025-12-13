import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./pages/App";
import "./main.css";
import ScrollToTop from "./methods/ScrollToTop";

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
