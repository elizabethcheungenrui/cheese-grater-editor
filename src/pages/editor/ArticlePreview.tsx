import ArticleContent from "../article/ArticleContent";
import IGCover from "../ig/IGCover";
import IGCardRenderer from "../ig/IGCardRenderer";
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
        {!validation.valid && (
          <div className="publish-warning">
            <p>Cannot publish. Missing:</p>
            <ul>
              {validation.missing.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        )}

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

      <div className="right">
        <div className="ig-heading-text">
          <h1>IG Cards</h1>
          <p>Screenshot and crop for posting</p>
        </div>
        <IGCover article={article} />
        {article.igCards.map((card) => (
          <IGCardRenderer key={card.id} article={article} card={card} />
        ))}
      </div>
    </div>
  );
}
