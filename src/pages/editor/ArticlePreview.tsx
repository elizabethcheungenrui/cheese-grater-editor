import ArticleContent from "../article/ArticleContent";
import { mapDraftToPreviewArticle, type DraftArticle } from "../../lib/types/Article";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateDraft } from "../../lib/methods/validateDraft";
import { publishArticle } from "../../lib/articles/publishArticle";
import { readEntry, readEntries, saveEntry, type BulkEntry } from "../../lib/bulk/bulkStore";
import "./ArticlePreview.css";

const DRAFT_KEY = "draft:article:new";

export default function ArticlePreview() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const bulkId = params.get("id");
  const isBulk = mode === "bulk";
  const isEdit = mode === "edit";
  const [draft, setDraft] = useState<DraftArticle | null>(null);
  const [bulkEntry, setBulkEntry] = useState<BulkEntry | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isBulk) {
      if (!bulkId) { setError("Missing bulk article ID"); return; }
      readEntry(bulkId).then((entry) => {
        if (!entry) { setError("Bulk draft not found"); return; }
        setBulkEntry(entry);
        setDraft(entry.draft);
      }).catch((err) => setError(String(err)));
    } else {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      try { setDraft(JSON.parse(raw)); } catch { setError("Invalid saved article draft"); }
    }
  }, [bulkId, isBulk]);

  async function submit(forArchive: boolean) {
    if (!draft || publishing) return;
    if (!window.confirm("Publish this article?")) return;
    setPublishing(true);
    setError("");
    try {
      const result = await publishArticle(draft, isEdit, forArchive, { bulk: isBulk });
      if (!result) return; // publication failed and the publisher displayed an error
      if (isBulk && bulkEntry) {
        await saveEntry({ ...bulkEntry, draft, status: "published", publishedSlug: result.slug, publishedId: result.id });
        const entries = await readEntries();
        const next = entries.find((item) => item.position > bulkEntry.position && item.status === "pending")
          ?? entries.find((item) => item.status === "pending");
        navigate(next ? `/editor/bulk-import/article/${next.id}` : "/editor/bulk-import");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally { setPublishing(false); }
  }

  if (!draft) return <p role="status">{error || "Loading article draft…"}</p>;
  if (isEdit && !draft.id) return <p>Missing draft ID for edit</p>;

  const article = mapDraftToPreviewArticle(draft);
  const validation = validateDraft(draft);

  return (
    <div className="article-preview">
      <div className="left">
        <ArticleContent article={article} />
        <div className="editor-buttons">
          {isBulk ? (
            <>
              <button className="editor-button" type="button" disabled={publishing} onClick={() => navigate(`/editor/bulk-import/article/${bulkId}`)}>Back to editor</button>
              <button className="editor-button preview" type="button" disabled={!validation.valid || publishing} onClick={() => void submit(true)}>
                {publishing ? "Publishing…" : "Publish archival article & next"}
              </button>
            </>
          ) : (
            <>
              <button className="editor-button" disabled={!validation.valid || publishing} onClick={() => void submit(false)}>Publish Article</button>
              <button className="editor-button preview" disabled={!validation.valid || publishing} onClick={() => void submit(true)}>Publish Article (for archival)</button>
            </>
          )}
        </div>
        {error && <p role="alert" style={{ color: "crimson" }}>{error}</p>}
      </div>
    </div>
  );
}
