import { supabase } from "../../lib/supabase/supabaseClient";
import { useEffect, useState } from "react";
import Footer from "../header-footer/Footer";
import Header from "../header-footer/Header";
import AuthorSelector from "./AuthorSelector";
import EditorUpload from "./EditorUpload";
import { Link, useNavigate, useParams } from "react-router-dom";
import { readEntry, saveEntry, type BulkEntry } from "../../lib/bulk/bulkStore";
import { validateDraft } from "../../lib/methods/validateDraft";
import type { DraftArticle, ArticleAuthorJoin } from "../../lib/types/Article";
import "./EditorUploadPage.css";

const SECTIONS = ["News", "Humour", "Voices"] as const;

type SectionName = (typeof SECTIONS)[number];

type SubsectionRow = {
  section: SectionName;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  default_author_thumbnail: string | null;
};

const DEFAULT_AUTHOR_THUMBNAIL =
  "https://images.cheesegratermagazine.org/author_thumbnails/cg_author.jpeg";

const DRAFT_KEY = "draft:article:new";

export default function EditorUploadPage({ mode }: { mode: string }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bulkEntry, setBulkEntry] = useState<BulkEntry | null>(null);
  const [bulkReady, setBulkReady] = useState(mode !== "bulk");
  const [bulkError, setBulkError] = useState("");
  const [draft, setDraft] = useState<DraftArticle>(() => {
    const raw = mode === "bulk" ? null : localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return {
        section: "",
        subsection: "",
        title: "",
        summary: "",
        authors: [],
        author_thumbnail: null,
        role: "",
        image: null,
        image_caption: "",
        content: "",
        liveblog_eid: "",
        publish_date: new Date().toISOString().slice(0, 10),
        updatedAt: Date.now(),
        link: "",
      };
    }

    try {
      return JSON.parse(raw);
    } catch {
      return {
        section: "",
        subsection: "",
        title: "",
        summary: "",
        authors: [],
        author_thumbnail: null,
        role: "",
        image: null,
        image_caption: "",
        content: "",
        liveblog_eid: "",
        publish_date: new Date().toISOString().slice(0, 10),
        updatedAt: Date.now(),
        link: "",
      };
    }
  });

  const [subsections, setSubsections] = useState<SubsectionRow[]>([]);

  useEffect(() => {
    async function loadSubsections() {
      const { data, error } = await supabase
        .from("subsections")
        .select(
          "section, name, slug, sort_order, is_active, default_author_thumbnail",
        )
        .eq("is_active", true)
        .order("section", { ascending: true })
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load subsections:", error);
        alert("Failed to load section options.");
        return;
      }

      setSubsections((data ?? []) as SubsectionRow[]);
    }

    loadSubsections();
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !id) return;

    async function loadArticle() {
      const { data, error } = await supabase
        .from("articles")
        .select(
          `*,
          article_authors (
            authors (
              id,
              name
            )
          )`,
        )
        .eq("id", id)
        .single();

      if (error) {
        alert("Failed to load article");
        return;
      }

      setDraft({
        id: data.id,
        slug: data.slug,
        section: data.section,
        subsection: data.subsection,
        title: data.title,
        summary: data.summary ?? "",
        authors: (data.article_authors as ArticleAuthorJoin[]).map(
          (x) => x.authors,
        ),
        author_thumbnail: data.author_thumbnail,
        role: data.role ?? "",
        image: data.image_url,
        image_caption: data.image_caption ?? "",
        content: data.content ?? "",
        liveblog_eid: data.liveblog_eid ?? "",
        publish_date: data.date_published.slice(0, 10),
        updatedAt: Date.now(),
        link: data.link,
      });
    }

    loadArticle();
  }, [mode, id]);

  useEffect(() => {
    if (mode !== "bulk") return;
    let cancelled = false;
    setBulkReady(false);
    if (!id) {
      setBulkError("Missing bulk article ID");
      return;
    }
    readEntry(id).then((entry) => {
      if (cancelled) return;
      if (!entry) {
        setBulkError("This draft is no longer in the bulk queue.");
        return;
      }
      setBulkEntry(entry);
      setDraft(entry.draft);
      setBulkError("");
      setBulkReady(true);
    }).catch((err) => { if (!cancelled) setBulkError(String(err)); });
    return () => { cancelled = true; };
  }, [mode, id]);

  const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(
    draft.author_thumbnail,
  );
  const [authorImageOverridden, setAuthorImageOverridden] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(
    draft.image,
  );
  const [customSubsection, setCustomSubsection] = useState(false);

  useEffect(() => {
    setAuthorImagePreview(draft.author_thumbnail);
    setMainImagePreview(draft.image);
  }, [bulkEntry?.id]);

  async function saveDraft() {
    const nextDraft = { ...draft, updatedAt: Date.now() };
    if (mode === "bulk") {
      if (!bulkReady || !bulkEntry) return;
      await saveEntry({ ...bulkEntry, draft: nextDraft });
    } else {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
    }
  }

  async function backToQueue() {
    await saveDraft();
    navigate("/editor/bulk-import");
  }

  async function openPreview() {
    if (mode === "bulk") {
      await saveDraft();
      navigate(`/editor/preview?mode=bulk&id=${encodeURIComponent(id ?? "")}`);
    } else {
      await saveDraft();
      window.open(`/editor/preview?mode=${mode}`);
    }
  }

  const validation = validateDraft(draft);
  const canProceed = validation.valid;

  function removeMainImage() {
    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
    }

    setMainImagePreview(null);

    setDraft((d) => ({
      ...d,
      image: null,
      image_caption: "",
    }));
  }

  useEffect(() => {
    if (mode === "bulk" && (!bulkReady || !bulkEntry)) return;
    const timeoutId = window.setTimeout(() => {
      if (mode === "bulk" && bulkEntry) {
        void saveEntry({ ...bulkEntry, draft: { ...draft, updatedAt: Date.now() } });
      } else {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, updatedAt: Date.now() }));
      }
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [draft, mode, bulkEntry, bulkReady]);

  useEffect(() => {
    if (authorImageOverridden) return;

    const autoImage =
      selectedSubsection?.default_author_thumbnail ??
      DEFAULT_AUTHOR_THUMBNAIL;

    setDraft((d) => ({
      ...d,
      author_thumbnail: autoImage,
    }));

    setAuthorImagePreview(autoImage);
  }, [
    draft.section,
    draft.subsection,
    subsections,
    authorImageOverridden,
  ]);

  const currentSubsections = draft.section
    ? subsections.filter((sub) => sub.section === draft.section)
    : [];

  const selectedSubsection =
    draft.section && draft.subsection
      ? subsections.find(
          (sub) =>
            sub.section === draft.section &&
            sub.name === draft.subsection,
        ) ?? null
      : null;

  if (mode === "bulk" && !bulkReady) {
    return <p role="status">{bulkError || "Loading archived draft…"} <Link to="/editor/bulk-import">Back to queue</Link></p>;
  }

  return (
    <div className="page-desktop">
      <Header />
      <div className="editor-upload">
        <h1>{mode === "bulk" ? `Review archive article ${bulkEntry ? bulkEntry.position + 1 : ""}` : mode === "create" ? "Article Upload" : "Edit Article"}</h1>
        {mode === "bulk" && (
          <p><button className="editor-button" type="button" onClick={() => void backToQueue()}>Back to bulk queue</button> — review the category, author and extraction before publishing.</p>
        )}

        <div className="editor-upload-columns">
          <div className="editor-upload-left">
            <div className="field">
              <h2>Article Section</h2>
              <select
                value={draft.section}
                onChange={(e) => {
                  const nextSection = e.target.value;
                  setDraft((d) => {
                    const fallbackNames = ["The News Desk", "The Humour Desk", "The Cheese Grater"];
                    const existing = d.authors.length === 1 ? d.authors[0].name : "";
                    const replaceFallback = mode === "bulk" && fallbackNames.includes(existing);
                    const bySection = nextSection === "News" ? "The News Desk" : nextSection === "Voices" ? "The Cheese Grater" : "The Humour Desk";
                    return {
                      ...d,
                      section: nextSection,
                      subsection: "",
                      authors: replaceFallback ? [{ name: bySection }] : d.authors,
                    };
                  });
                }}
              >
                <option value="">Select section</option>

                {SECTIONS.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <h2>Article Subsection</h2>
              <select
                value={customSubsection ? "__custom__" : draft.subsection}
                disabled={!draft.section}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "__custom__") {
                    setCustomSubsection(true);
                    setDraft((d) => ({ ...d, subsection: "" }));
                  } else {
                    setCustomSubsection(false);
                    setDraft((d) => ({ ...d, subsection: value }));
                  }
                }}
              >
                <option value="">
                  {draft.section ? "Select subsection" : "Select section first"}
                </option>

                {currentSubsections.map((sub) => (
                  <option key={sub.slug} value={sub.name}>
                    {sub.name}
                  </option>
                ))}

                {draft.section && <option value="__custom__">Other…</option>}
              </select>

              {customSubsection && (
                <div className="field">
                  <input
                    type="text"
                    value={draft.subsection}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, subsection: e.target.value }))
                    }
                    placeholder="Enter custom subsection"
                    className="custom-subsection"
                    spellCheck="false"
                  />
                </div>
              )}
            </div>

            <div className="field">
              <h2>Publish Date</h2>
              <div className="date-fields">
                <input
                  type="date"
                  value={draft.publish_date}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, publish_date: e.target.value }))
                  }
                  className="date-field"
                />

                <button
                  type="button"
                  className="editor-button"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      publish_date: new Date().toISOString().slice(0, 10),
                    }))
                  }
                >
                  Today
                </button>
              </div>
            </div>

            <div className="field">
              <h2>Article Title + Standfirst</h2>
              <p>
                Standfirst optional. If you want to add Italics in the standfirst,
                please enclose the selected text like so: <br />
                <i>&lt;i&gt;The Cheese Grater&lt;/i&gt;</i>.
              </p>
              <textarea
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
                placeholder="Enter article title"
                className="editor-title-textarea"
                spellCheck="false"
                rows={3}
              />
              <textarea
                value={draft.summary}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, summary: e.target.value }))
                }
                placeholder="Optional standfirst shown below the title"
                className="editor-summary-textarea"
                spellCheck="false"
                rows={3}
              />
            </div>

            <div className="field">
              <h2>Author Details</h2>
              <p>
                1. Author Image - Optional (will use defaults if none given){" "}
                <br />
                2. Author <br />
                3. Author Role - Optional
              </p>

              <div className="author-box">
                <div
                  className="author-image"
                  onClick={() =>
                    document.getElementById("author-image-input")?.click()
                  }
                  style={{
                    backgroundImage: authorImagePreview
                      ? `url(${authorImagePreview})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                  }}
                >
                  {!authorImagePreview && <span>+</span>}
                </div>

                <input
                  id="author-image-input"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (mode === "bulk") {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const preview = String(reader.result);
                        setAuthorImagePreview(preview);
                        setAuthorImageOverridden(true);
                        setDraft((d) => ({ ...d, author_thumbnail: preview }));
                      };
                      reader.readAsDataURL(file);
                    } else {
                      const preview = URL.createObjectURL(file);
                      setAuthorImagePreview(preview);
                      setAuthorImageOverridden(true);
                      setDraft((d) => ({ ...d, author_thumbnail: preview }));
                    }
                  }}
                />

                <div className="author-text">
                  <AuthorSelector
                    authors={draft.authors}
                    setAuthors={(authors) =>
                      setDraft((d) => ({ ...d, authors }))
                    }
                  />

                  <input
                    type="text"
                    value={draft.role}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, role: e.target.value }))
                    }
                    placeholder="Role"
                    className="role"
                    spellCheck="false"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAuthorImageOverridden(false);

                  const auto =
                    selectedSubsection?.default_author_thumbnail ??
                    DEFAULT_AUTHOR_THUMBNAIL;

                  setAuthorImagePreview(auto);
                  setDraft((d) => ({ ...d, author_thumbnail: auto }));
                }}
                className="editor-button"
              >
                Reset to default
              </button>
            </div>

            <div className="field">
              <h2>Main Image</h2>
              <p>Optional (will use Author Image if none given)</p>
              <div className="main-image-wrapper">
                <div
                  className="main-image"
                  onClick={() =>
                    document.getElementById("main-image-input")?.click()
                  }
                  style={{
                    backgroundImage: mainImagePreview
                      ? `url(${mainImagePreview})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                  }}
                >
                  {!mainImagePreview && <span>+</span>}
                </div>
                <input
                  id="main-image-input"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (mode === "bulk") {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const preview = String(reader.result);
                        setMainImagePreview(preview);
                        setDraft((d) => ({ ...d, image: preview }));
                      };
                      reader.readAsDataURL(file);
                    } else {
                      const preview = URL.createObjectURL(file);
                      setMainImagePreview(preview);
                      setDraft((d) => ({ ...d, image: preview }));
                    }
                  }}
                />

                {mainImagePreview && (
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={removeMainImage}
                  >
                    Remove image
                  </button>
                )}

                <textarea
                  value={draft.image_caption}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, image_caption: e.target.value }))
                  }
                  placeholder={
                    mainImagePreview
                      ? "Main Image Caption"
                      : "Add a main image to enable caption"
                  }
                  className="editor-image-caption-textarea"
                  spellCheck="false"
                  rows={2}
                  disabled={!mainImagePreview}
                />
              </div>
            </div>

            <div className="field">
              <h2>Article Content</h2>
              <p>Optional (for Graphics etc.)</p>
              <EditorUpload
                initialContent={draft.content}
                onChange={(html) => setDraft((d) => ({ ...d, content: html }))}
              />
            </div>

            {/* <div className="field">
              <h2>24LiveBlog Embed ID</h2>
              <p>Optional. Paste only the numeric data-eid, not the full script.</p>

              <input
                type="text"
                value={draft.liveblog_eid ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, liveblog_eid: e.target.value.trim() }))
                }
                placeholder="4119487725568182970"
                className="custom-subsection"
                spellCheck="false"
              />
            </div> */}

            {/* <div className="field">
              <h2>Old Wordpress Link</h2>
              <p>ONLY USED FOR ARCHIVAL.</p>{" "}
              <p>
                Fill this in if transferring an old WP article to the new site,
                leave blank if this is a new article.
              </p>
              <div className="field">
                <input
                  type="text"
                  value={draft.link}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, link: e.target.value }))
                  }
                  placeholder="https://old.cheesegratermagazine.org/..."
                  className="custom-subsection"
                  spellCheck="false"
                />
              </div>
            </div> */}

            <button
              className="preview-button"
              disabled={!canProceed}
              onClick={() => void openPreview()}
            >
              Preview Article
            </button>
            <div className="field">
              {validation.errors.length > 0 && (
                <>
                  <p>Errors:</p>
                  <ul>
                    {validation.errors.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="editor-upload-right">
            <button className="editor-button" onClick={() => void saveDraft()}>
              Save
            </button>
            <button
              className="editor-button"
              disabled={!canProceed}
              onClick={() => void openPreview()}
            >
              Preview Article
            </button>

            {mode === "bulk" ? (
              <button type="button" className="editor-button" onClick={() => void backToQueue()}>Back to Bulk Queue</button>
            ) : (
              <Link to="/editor"><button className="editor-button">Back to Editor Menu</button></Link>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
