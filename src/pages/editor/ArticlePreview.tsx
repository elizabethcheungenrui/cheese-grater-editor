import ArticleContent from "../article/ArticleContent";
import { mapDraftToPreviewArticle, type DraftArticle } from "../../lib/types/Article";
import { useEffect, useState } from "react";
import { validateDraft } from "../../lib/methods/validateDraft";
import { publishArticle } from "../../lib/articles/publishArticle";
import "./ArticlePreview.css";

const DRAFT_KEY = "draft:article:new";

export default function ArticlePreview() {
  const [draft, setDraft] = useState<DraftArticle | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    try {
      setDraft(JSON.parse(raw));
    } catch {
      setDraft(null);
    }
  }, []);

  if (!draft) {
    return <p>No draft to preview.</p>;
  }

  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const isEdit = mode === "edit";
  if (isEdit && !draft.id) throw new Error("Missing draft id for edit");

  // Build a fake Article object
  const article = mapDraftToPreviewArticle(draft);

  const validation = validateDraft(draft);

  return (
    <div className="article-preview">
      <div className="left">
        <ArticleContent article={article} />
        <div className="editor-buttons">
          <button
            className="editor-button"
            disabled={!validation.valid}
            onClick={() => {
              if (!window.confirm("Publish this article?")) return;
              publishArticle(draft, isEdit, false);
            }}
          >
            Publish Article
          </button>
          <button
            className="editor-button preview"
            disabled={!validation.valid}
            onClick={() => {
              if (!window.confirm("Publish this article?")) return;
              publishArticle(draft, isEdit, true);
            }}
          >
            Publish Article (for archival)
          </button>
        </div>
      </div>
    </div>
  );
}
