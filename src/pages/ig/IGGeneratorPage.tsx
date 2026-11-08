import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";

import { supabase } from "../../lib/supabase/supabaseClient";
import { formatDate } from "../../lib/methods/formatting";
import { countWords } from "../../lib/methods/wordCount";

import type {
  Article,
  ArticleAuthorJoin,
} from "../../lib/types/Article";

import type { IGCard } from "../../lib/types/IGCard";

import {
  parseIGCarousel,
  renderIGMarkdown,
  serializeIGCarousel,
  type IGCarouselDocument,
} from "../../lib/ig/IGCarouselSource";

import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";

import IGCover from "./cards/IGCover";
import IGCardRenderer from "./cards/IGCardRenderer";

import "./IGGeneratorPage.css";
import ArticleContent from "../article/ArticleContent";

/* TYPES */

type ArticleListItem = Pick<
  Article,
  | "id"
  | "slug"
  | "title"
  | "section"
  | "subsection"
  | "date_published"
>;

type PublicArticleRow = Omit<Article, "authors"> & {
  article_authors: ArticleAuthorJoin[] | null;
};

type CoverOverrides = Partial<
  Pick<
    Article,
    | "section"
    | "subsection"
    | "authors"
    | "role"
    | "image_url"
    | "image_caption"
  >
>;

/* LOCAL DRAFT STORAGE */

const LOCAL_DRAFT_PREFIX = "cg:instagram-carousel:v1:";

function localDraftKey(articleId: string): string {
  return `${LOCAL_DRAFT_PREFIX}${articleId}`;
}

type SavedCover = {
  section: string;
  subsection: string;
  title: string;
  summary: string | null;
  authors: string[];
  role: string | null;
  image_url: string | null;
  image_caption: string | null;
};

type SavedCarouselDraft = {
  version: 1;
  articleId: string;
  cover: SavedCover;
  cards: IGCard[];
  savedAt: string;
};

function coverSnapshot(article: Article): SavedCover {
  return {
    section: article.section,
    subsection: article.subsection,
    title: article.title,
    summary: article.summary,
    authors: article.authors.map((author) => author.name),
    role: article.role,
    image_url: article.image_url,
    image_caption: article.image_caption,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSavedCarouselDraft(
  value: unknown,
  articleId: string,
): value is SavedCarouselDraft {
  if (!isRecord(value) || !isRecord(value.cover)) return false;
  if (value.version !== 1 || value.articleId !== articleId) return false;
  if (!Array.isArray(value.cards)) return false;

  const cover = value.cover;
  const textFields = ["section", "subsection", "title"];
  const optionalFields = ["summary", "role", "image_url", "image_caption"];

  if (!textFields.every((key) => typeof cover[key] === "string")) return false;
  if (!optionalFields.every((key) => cover[key] === null || typeof cover[key] === "string")) return false;
  if (!Array.isArray(cover.authors) || !cover.authors.every((name) => typeof name === "string")) return false;

  return value.cards.every((card: unknown) => {
    if (!isRecord(card)) return false;
    if (typeof card.id !== "string" || typeof card.content !== "string") return false;
    return card.type === "text" ||
  (
    card.type === "quote" &&
    typeof card.quoteAuthor === "string" &&
    (
      card.quoteAuthorRole === undefined ||
      typeof card.quoteAuthorRole === "string"
    )
  );
  });
}

function readLocalDraft(articleId: string): SavedCarouselDraft | null {
  try {
    const raw = localStorage.getItem(localDraftKey(articleId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isSavedCarouselDraft(parsed, articleId)) return null;

    return {
      ...parsed,
      cards: parsed.cards.map((card) =>
        card.type === "quote"
          ? {
              ...card,
              quoteAuthorRole: card.quoteAuthorRole ?? "",
            }
          : card,
      ),
    };
  } catch (err) {
    console.warn("Cannot restore local Instagram draft:", err);
    return null;
  }
}

function restoreLocalCover(original: Article, saved: SavedCover): Article {
  return {
    ...original,
    ...saved,
    authors: saved.authors.map(
      (name) => original.authors.find((author) => author.name === name) ?? { name },
    ),
  };
}

/* FETCH ARTICLE */

async function fetchArticle(id: string): Promise<Article> {
  const { data, error } = await supabase
    .from("articles")
    .select(`
      id,
      slug,
      section,
      subsection,
      date_published,
      title,
      summary,
      author_thumbnail,
      role,
      image_url,
      image_caption,
      content,
      liveblog_eid,
      article_authors (
        authors (id, name, slug)
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Article not found.");

  const row = data as unknown as PublicArticleRow;

  return {
    id: row.id,
    slug: row.slug,
    section: row.section,
    subsection: row.subsection,
    date_published: row.date_published,
    title: row.title,
    summary: row.summary,
    authors: (row.article_authors ?? [])
      .map((join) => join.authors)
      .filter(
        (author): author is Article["authors"][number] =>
          Boolean(author),
      ),
    author_thumbnail: row.author_thumbnail,
    role: row.role,
    image_url: row.image_url,
    image_caption: row.image_caption,
    content: row.content,
    liveblog_eid: row.liveblog_eid,
  };
}

/* SERIALISATION */

/*
 * The existing IGCarouselSource handles:
 * - article ID
 * - cover title / summary
 * - text / quote cards
 *
 * Additional optional directives preserve
 * client-side edits to other cover fields.
 */

function serializeWorkingCarousel(
  article: Article,
  cards: IGCard[],
): string {
  const base = serializeIGCarousel({
    articleId: article.id,
    cover: {
      title: article.title,
      summary: article.summary ?? "",
    },
    cards,
  });

  const metadata = [
    `@section ${JSON.stringify(article.section)}`,
    `@subsection ${JSON.stringify(article.subsection)}`,
    `@authors ${JSON.stringify(
      article.authors.map((author) => author.name),
    )}`,
    `@role ${JSON.stringify(article.role)}`,
    `@image ${JSON.stringify(article.image_url)}`,
    `@caption ${JSON.stringify(article.image_caption)}`,
  ].join("\n");

  return base.replace(
    "@cover\n",
    `@cover\n${metadata}\n`,
  );
}

function parseCoverOverrides(source: string): CoverOverrides {
  const header = source
    .replace(/\r\n?/g, "\n")
    .split(/^\s*---\s*$/m)[0];

  function read(name: string): unknown {
    const prefix = `@${name} `;

    const line = header
      .split("\n")
      .find((line) => line.startsWith(prefix));

    if (!line) return undefined;

    return JSON.parse(line.slice(prefix.length));
  }

  const overrides: CoverOverrides = {};

  const section = read("section");
  const subsection = read("subsection");
  const authors = read("authors");
  const role = read("role");
  const image = read("image");
  const caption = read("caption");

  if (typeof section === "string") {
    overrides.section = section;
  }

  if (typeof subsection === "string") {
    overrides.subsection = subsection;
  }

  if (
    Array.isArray(authors) &&
    authors.every((name) => typeof name === "string")
  ) {
    overrides.authors = authors.map((name) => ({ name }));
  }

  if (role === null || typeof role === "string") {
    overrides.role = role;
  }

  if (image === null || typeof image === "string") {
    overrides.image_url = image;
  }

  if (caption === null || typeof caption === "string") {
    overrides.image_caption = caption;
  }

  return overrides;
}

/* DOWNLOAD HELPERS */

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

async function prepareSlide(element: HTMLElement) {
  await document.fonts.ready;

  const images = Array.from(
    element.querySelectorAll("img"),
  );

  await Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve, reject) => {
          image.addEventListener(
            "load",
            () => resolve(),
            { once: true },
          );

          image.addEventListener(
            "error",
            () => reject(new Error("Image failed to load")),
            { once: true },
          );
        });
      }

      if (!image.naturalWidth) {
        throw new Error(`Cannot load image: ${image.src}`);
      }

      await image.decode?.().catch(() => undefined);
    }),
  );

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

/* GENERATOR PAGE */

export default function IGGeneratorPage() {
  /* Article list */

  const [articles, setArticles] =
    useState<ArticleListItem[]>([]);

  const [listLoading, setListLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] =
    useState<string | null>(null);

  /* Client-side working state */

  const [article, setArticle] =
    useState<Article | null>(null);

  const [originalArticle, setOriginalArticle] =
    useState<Article | null>(null);

  const [cards, setCards] = useState<IGCard[]>([]);
  const [authorsInput, setAuthorsInput] = useState("");
  const [localDraftStatus, setLocalDraftStatus] = useState("");

  /* Import/export */

  const [importSource, setImportSource] = useState("");
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  /* DOM references */

  const coverRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<
    Record<string, HTMLDivElement>
  >({});

  const requestNumber = useRef(0);

  /* Load article list */

  useEffect(() => {
    let cancelled = false;

    async function loadArticles() {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select(
            "id, slug, title, section, subsection, date_published",
          )
          .order("date_published", { ascending: false })
          .limit(400);

        if (error) throw error;

        if (!cancelled) {
          setArticles(data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            `Failed to load articles: ${String(err)}`,
          );
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    }

    void loadArticles();

    return () => {
      cancelled = true;
    };
  }, []);

  /* Autosave the current article's edits and cards on this device.
   * Only save fields that the carousel editor can change.
   * When everything matches the published article, remove the draft.
   */
  useEffect(() => {
    if (!article || !originalArticle || article.id !== originalArticle.id) return;

    const currentCover = coverSnapshot(article);
    const originalCover = coverSnapshot(originalArticle);
    const modified =
      cards.length > 0 ||
      JSON.stringify(currentCover) !== JSON.stringify(originalCover);

    try {
      if (!modified) {
        localStorage.removeItem(localDraftKey(article.id));
        setLocalDraftStatus("No local changes");
        return;
      }

      const draft: SavedCarouselDraft = {
        version: 1,
        articleId: article.id,
        cover: currentCover,
        cards,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(localDraftKey(article.id), JSON.stringify(draft));
      setLocalDraftStatus("Saved automatically on this device");
    } catch (err) {
      console.error("Cannot save Instagram draft locally:", err);
      setLocalDraftStatus("Could not save locally — export plaintext to keep your work");
    }
  }, [article, originalArticle, cards]);

  /* Select article */

  async function selectArticle(
    id: string,
    imported?: IGCarouselDocument,
    overrides: CoverOverrides = {},
  ) {
    // Clicking the currently selected article shouldn't discard its edits.
    if (!imported && article?.id === id) return;

    const request = ++requestNumber.current;

    setLoadingId(id);
    setError("");

    try {
      const selected = await fetchArticle(id);

      if (request !== requestNumber.current) return;

      // A deliberate plaintext import takes precedence over local storage.
      const saved = imported ? null : readLocalDraft(id);

      const workingArticle: Article = imported
        ? {
            ...selected,
            ...overrides,
            title: imported.cover.title,
            summary: imported.cover.summary,
          }
        : saved
          ? restoreLocalCover(selected, saved.cover)
          : { ...selected };

      setOriginalArticle(selected);
      setArticle(workingArticle);
      setAuthorsInput(
        workingArticle.authors.map((author) => author.name).join("\n"),
      );
      setCards(imported?.cards ?? saved?.cards ?? []);
      setLocalDraftStatus(
        imported
          ? "Imported carousel; local autosave is enabled"
          : saved
            ? "Restored your saved carousel on this device"
            : "No local changes",
      );
    } catch (err) {
      if (request === requestNumber.current) {
        setError(`Failed to select article: ${String(err)}`);
      }
    } finally {
      if (request === requestNumber.current) {
        setLoadingId(null);
      }
    }
  }

  /* Edit article locally */

  function updateArticle<K extends keyof Article>(
    field: K,
    value: Article[K],
  ) {
    setArticle((previous) =>
      previous
        ? { ...previous, [field]: value }
        : null,
    );
  }

  function resetCover() {
    if (!originalArticle) return;

    setArticle({ ...originalArticle });

    setAuthorsInput(
      originalArticle.authors
        .map((author) => author.name)
        .join("\n"),
    );
  }

  function discardLocalDraft() {
    if (!article || !originalArticle) return;

    if (!window.confirm(
      "Discard this article's saved carousel and reset the cover and all slides?",
    )) return;

    // The autosave effect will also remove this key once state is reset.
    try {
      localStorage.removeItem(localDraftKey(article.id));
    } catch (err) {
      console.warn("Could not remove local Instagram draft:", err);
    }

    setArticle({ ...originalArticle });
    setCards([]);
    setAuthorsInput(originalArticle.authors.map((author) => author.name).join("\n"));
    setLocalDraftStatus("Local draft discarded");
  }

  function updateAuthors(value: string) {
    setAuthorsInput(value);

    const authors = value
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    updateArticle("authors", authors);
  }

  /* Carousel cards */

  function addCard(type: IGCard["type"]) {
    const id = crypto.randomUUID();

    const newCard: IGCard =
      type === "quote"
        ? {
            id,
            type: "quote",
            content: "",
            quoteAuthor: "",
            quoteAuthorRole: "",
          }
        : {
            id,
            type: "text",
            content: "",
          };

    setCards((previous) => [...previous, newCard]);
  }

  function updateCardContent(id: string, content: string) {
    setCards((previous) =>
      previous.map((card) =>
        card.id === id
          ? { ...card, content }
          : card,
      ),
    );
  }

  function updateQuoteAuthor(id: string, author: string) {
    setCards((previous) =>
      previous.map((card) =>
        card.id === id && card.type === "quote"
          ? { ...card, quoteAuthor: author }
          : card,
      ),
    );
  }

  function updateQuoteAuthorRole(id: string, role: string) {
    setCards((previous) =>
      previous.map((card) =>
        card.id === id && card.type === "quote"
          ? { ...card, quoteAuthorRole: role }
          : card,
      ),
    );
  }

  function removeCard(id: string) {
    setCards((previous) =>
      previous.filter((card) => card.id !== id),
    );
  }

  function moveCard(index: number, direction: -1 | 1) {
    setCards((previous) => {
      const target = index + direction;

      if (target < 0 || target >= previous.length) {
        return previous;
      }

      const next = [...previous];

      [next[index], next[target]] = [
        next[target],
        next[index],
      ];

      return next;
    });
  }

  /* Article search */

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((item) =>
      `${item.title} ${item.section} ${item.subsection}`
        .toLowerCase()
        .includes(query),
    );
  }, [articles, search]);

  /* Generated plaintext */

  const source = useMemo(
    () =>
      article
        ? serializeWorkingCarousel(article, cards)
        : "",
    [article, cards],
  );

  /* HTML rendering */

  const previewArticle = useMemo<Article | null>(() => {
    if (!article) return null;

    return {
      ...article,
      summary: renderIGMarkdown(article.summary ?? ""),
    };
  }, [article]);

  /*
   * Cards are transformed separately.
   * No igCards property is added to Article.
   */

  const previewCards = useMemo<IGCard[]>(
    () =>
      cards.map((card) => ({
        ...card,
        content: renderIGMarkdown(card.content),
      })),
    [cards],
  );

  /* Import plaintext */

  async function applyImportedSource() {
    try {
      const parsed = parseIGCarousel(importSource);
      const overrides = parseCoverOverrides(importSource);

      await selectArticle(
        parsed.articleId,
        parsed,
        overrides,
      );
    } catch (err) {
      setError(
        `Invalid carousel source: ${String(err)}`,
      );
    }
  }

  /* Download plaintext */

  function downloadSource() {
    if (!article) return;

    const blob = new Blob([source], {
      type: "text/markdown;charset=utf-8",
    });

    downloadBlob(
      blob,
      `${article.slug}-instagram.md`,
    );
  }

  async function copySource() {
    try {
      await navigator.clipboard.writeText(source);
      setError("");
    } catch {
      setError("Unable to copy plaintext.");
    }
  }

  /* Download PNGs */

  async function downloadImages() {
    if (!article || !coverRef.current) return;

    setExporting(true);
    setError("");

    try {
      const elements = [
        coverRef.current,
        ...cards.map(
          (card) => cardRefs.current[card.id],
        ),
      ];

      if (elements.some((element) => !element)) {
        throw new Error("Some slides are not mounted.");
      }

      const zip = new JSZip();

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        if (!element) {
          throw new Error(`Missing slide ${i + 1}`);
        }

        await prepareSlide(element);

        if (
          element.querySelector(
            '[data-overflow="true"]',
          )
        ) {
          throw new Error(
            `Slide ${i + 1} contains text that cannot fit.`,
          );
        }
        
        console.log(`Exporting slide ${i + 1}`, element);

        console.log(`Slide ${i + 1}: images loaded`);

        const png = await toPng(element, {
          pixelRatio: 2.7,
          cacheBust: true,
        });

        console.log(`Slide ${i + 1}: PNG generated`);

        const filename =
          `${String(i + 1).padStart(2, "0")}-` +
          `${i === 0 ? "cover" : "slide"}.png`;

        zip.file(filename, png.split(",")[1], {
          base64: true,
        });
      }

      const blob = await zip.generateAsync({
        type: "blob",
      });

      downloadBlob(
        blob,
        `${article.slug}-instagram.zip`,
      );
    } catch (err) {
      console.error("Instagram export failed:", err);

      if (err instanceof Event) {
        const target = err.target;

        console.error("Event type:", err.type);
        console.error("Event target:", target);

        if (target instanceof HTMLImageElement) {
          console.error("Failed image URL:", target.src);
        }
      }

      setError(
        `Image export failed: ${
          err instanceof Error
            ? err.message
            : err instanceof Event
              ? `${err.type} event — see browser console`
              : String(err)
        }`
      );
    } finally {
      setExporting(false);
    }
  }

  /* RENDER */

  return (
    <div className="page-desktop">
      <Header />

      <main className="ig-generator">
        <header className="ig-generator-header">
          <h1>Instagram Carousel Generator</h1>
        </header>

        {error && (
          <p className="ig-generator-error" role="alert">
            {error}
          </p>
        )}

        <div className="ig-generator-columns">
          {/* LEFT: EDITOR */}

          <section className="ig-generator-controls">
            {/* ARTICLE SELECTOR */}

            <div className="ig-generator-panel">
              <h2>1. Select Article</h2>

              <input
                className="ig-generator-input"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search articles..."
              />

              {listLoading ? (
                <p>Loading articles...</p>
              ) : (
                <div className="ig-generator-article-list">
                  {filteredArticles.length === 0 && (
                    <p>No matching articles.</p>
                  )}

                  {filteredArticles
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={
                          "ig-generator-article " +
                          (article?.id === item.id
                            ? "selected"
                            : "")
                        }
                        disabled={loadingId !== null}
                        onClick={() =>
                          void selectArticle(item.id)
                        }
                      >
                        <strong>{item.title}</strong>

                        <span>
                          {item.section} / {item.subsection}
                          {" · "}
                          {formatDate(item.date_published)}
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {article && (
              <>
                {/* COVER EDITOR */}

                <div className="ig-generator-panel">
                  <div className="ig-generator-panel-heading">
                    <h2>2. Cover</h2>

                    <div className="ig-generator-actions">
                      <button
                        type="button"
                        className="ig-generator-button"
                        onClick={resetCover}
                        title="Reset cover fields, keeping additional slides"
                      >
                        Reset Cover
                      </button>
                      <button
                        type="button"
                        className="ig-generator-button"
                        onClick={discardLocalDraft}
                        title="Discard this article's local cover edits and all cards"
                      >
                        Discard Draft
                      </button>
                    </div>
                  </div>
                  <p className="ig-generator-local-status" role="status">
                    {localDraftStatus}
                  </p>

                  <div className="ig-generator-field-group">
                    <div className="ig-generator-field">
                      <label htmlFor="ig-section">
                        Section
                      </label>

                      <select
                        id="ig-section"
                        className="ig-generator-input"
                        value={article.section}
                        onChange={(e) =>
                          updateArticle(
                            "section",
                            e.target.value,
                          )
                        }
                      >
                        <option value="News">News</option>
                        <option value="Humour">Humour</option>
                        <option value="Voices">Voices</option>
                      </select>
                    </div>

                    <div className="ig-generator-field">
                      <label htmlFor="ig-subsection">
                        Subsection
                      </label>

                      <input
                        id="ig-subsection"
                        className="ig-generator-input"
                        value={article.subsection}
                        onChange={(e) =>
                          updateArticle(
                            "subsection",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="ig-generator-field">
                    <label htmlFor="ig-title">
                      Title
                    </label>

                    <textarea
                      id="ig-title"
                      rows={3}
                      value={article.title}
                      onChange={(e) =>
                        updateArticle(
                          "title",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="ig-generator-field-group">
                    <div className="ig-generator-field">
                      <label htmlFor="ig-authors">
                        Authors
                      </label>

                      <textarea
                        id="ig-authors"
                        rows={2}
                        value={authorsInput}
                        onChange={(e) =>
                          updateAuthors(e.target.value)
                        }
                      />
                    </div>

                    <div className="ig-generator-field">
                      <label htmlFor="ig-role">
                        Author Role
                      </label>

                      <input
                        id="ig-role"
                        className="ig-generator-input"
                        value={article.role ?? ""}
                        onChange={(e) =>
                          updateArticle(
                            "role",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="ig-generator-field">
                    <label htmlFor="ig-image">
                      Image URL
                    </label>

                    <input
                      id="ig-image"
                      className="ig-generator-input"
                      value={article.image_url ?? ""}
                      onChange={(e) =>
                        updateArticle(
                          "image_url",
                          e.target.value || null,
                        )
                      }
                    />
                  </div>

                  <div className="ig-generator-field-group">
                    <div className="ig-generator-field">
                      <label htmlFor="ig-caption">
                        Image Caption
                      </label>

                      <textarea
                        id="ig-caption"
                        rows={2}
                        value={article.image_caption ?? ""}
                        onChange={(e) =>
                          updateArticle(
                            "image_caption",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="ig-generator-field">
                      <label htmlFor="ig-summary">
                        Standfirst
                      </label>

                      <textarea
                        id="ig-summary"
                        rows={3}
                        value={article.summary ?? ""}
                        onChange={(e) =>
                          updateArticle(
                            "summary",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* CARD EDITOR */}

                <div className="ig-generator-panel">
                  <h2>3. Carousel Cards</h2>

                  <p>
                    Markdown supported: **bold**,
                    *italic*, and paragraphs.
                  </p>

                  {cards.map((card, index) => {
                    const limit =
                      card.type === "text" ? 70 : 50;

                    const words = countWords(card.content);

                    return (
                      <div
                        className="ig-generator-card-editor"
                        key={card.id}
                      >
                        <div className="ig-generator-card-title">
                          <h3>
                            Slide {index + 2}:{" "}
                            {card.type === "text"
                              ? "Text"
                              : "Quote"}
                          </h3>

                          <div className="ig-generator-actions">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() =>
                                moveCard(index, -1)
                              }
                              aria-label="Move slide up"
                            >
                              ↑
                            </button>

                            <button
                              type="button"
                              disabled={
                                index === cards.length - 1
                              }
                              onClick={() =>
                                moveCard(index, 1)
                              }
                              aria-label="Move slide down"
                            >
                              ↓
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeCard(card.id)
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={7}
                          value={card.content}
                          onChange={(e) =>
                            updateCardContent(
                              card.id,
                              e.target.value,
                            )
                          }
                          aria-label={`Slide ${index + 2} content`}
                        />

                        <small
                          className={
                            words > limit
                              ? "over-limit"
                              : ""
                          }
                        >
                          {words}/{limit} words
                        </small>

                        {card.type === "quote" && (
                          <div className="ig-generator-field-group">
                            <div className="ig-generator-field">
                              <label
                                htmlFor={`quote-author-${card.id}`}
                              >
                                Quote Author
                              </label>

                              <input
                                id={`quote-author-${card.id}`}
                                className="ig-generator-input"
                                value={card.quoteAuthor}
                                onChange={(e) =>
                                  updateQuoteAuthor(
                                    card.id,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="ig-generator-field">
                              <label htmlFor={`quote-author-role-${card.id}`}>
                                Quote Author Role
                              </label>

                              <input
                                id={`quote-author-role-${card.id}`}
                                className="ig-generator-input"
                                value={card.quoteAuthorRole ?? ""}
                                onChange={(e) =>
                                  updateQuoteAuthorRole(card.id, e.target.value)
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="ig-generator-actions">
                    <button
                      type="button"
                      className="ig-generator-button"
                      onClick={() => addCard("text")}
                    >
                      Add Text Card
                    </button>

                    <button
                      type="button"
                      className="ig-generator-button"
                      onClick={() => addCard("quote")}
                    >
                      Add Quote Card
                    </button>
                  </div>
                </div>

                {/* EXPORT */}

                <div className="ig-generator-panel">
                  <h2>4. Export</h2>

                  <div className="ig-generator-actions">
                    <button
                      type="button"
                      className="ig-generator-button primary"
                      disabled={exporting}
                      onClick={() =>
                        void downloadImages()
                      }
                    >
                      {exporting
                        ? "Rendering..."
                        : "Download Images (ZIP)"}
                    </button>

                    <button
                      type="button"
                      className="ig-generator-button"
                      onClick={downloadSource}
                    >
                      Download Plaintext
                    </button>

                    <button
                      type="button"
                      className="ig-generator-button"
                      onClick={() =>
                        void copySource()
                      }
                    >
                      Copy Plaintext
                    </button>
                  </div>

                  <label htmlFor="ig-source">
                    Generated Carousel Source
                  </label>

                  <textarea
                    id="ig-source"
                    rows={12}
                    readOnly
                    value={source}
                  />

                  <details className="ig-generator-import">
                    <summary>Import Plaintext</summary>

                    <textarea
                      rows={10}
                      value={importSource}
                      onChange={(e) =>
                        setImportSource(e.target.value)
                      }
                      placeholder="Paste carousel source..."
                    />

                    <button
                      type="button"
                      className="ig-generator-button"
                      disabled={loadingId !== null}
                      onClick={() =>
                        void applyImportedSource()
                      }
                    >
                      Apply Source
                    </button>
                  </details>
                </div>
              </>
            )}

            {/* IMPORT BEFORE SELECTING */}

            {!article && (
              <div className="ig-generator-panel">
                <details className="ig-generator-import">
                  <summary>
                    Import an existing carousel
                  </summary>

                  <textarea
                    rows={10}
                    value={importSource}
                    onChange={(e) =>
                      setImportSource(e.target.value)
                    }
                    placeholder="Paste carousel source..."
                  />

                  <button
                    type="button"
                    className="ig-generator-button"
                    disabled={loadingId !== null}
                    onClick={() =>
                      void applyImportedSource()
                    }
                  >
                    Apply Source
                  </button>
                </details>
              </div>
            )}
          </section>

          {/* RIGHT: LIVE PREVIEW */}

          <section className="ig-generator-preview">
            <div className="ig-generator-preview-heading">
              <h2>Live Preview</h2>
              {previewArticle ? (
              <button
                type="button"
                className="ig-generator-button primary"
                disabled={exporting}
                onClick={() =>
                  void downloadImages()
                }
              >
                {exporting
                  ? "Rendering..."
                  : "Download Images (ZIP)"}
              </button>
              ) : null}
            </div>

            {!previewArticle ? (
              <p>Select an article to begin.</p>
            ) : (
              <>
                <div className="ig-generator-preview-slot">
                  <div className="ig-generator-preview-label">
                    Cover
                  </div>

                  <div
                    className="ig-generator-export-target"
                    ref={coverRef}
                  >
                    <IGCover article={previewArticle} />
                  </div>
                </div>

                {previewCards.map((card, index) => (
                  <div
                    className="ig-generator-preview-slot"
                    key={card.id}
                  >
                    <div className="ig-generator-preview-label">
                      Slide {index + 2}
                    </div>

                    <div
                      className="ig-generator-export-target"
                      ref={(node) => {
                        if (node) {
                          cardRefs.current[card.id] = node;
                        } else {
                          delete cardRefs.current[card.id];
                        }
                      }}
                    >
                      <IGCardRenderer
                        article={previewArticle}
                        card={card}
                      />
                    </div>
                  </div>
                ))}

                {/* SOURCE ARTICLE */}

                {previewArticle.content && (
                  <div className="ig-generator-article-reference">
                    <a
                      className="ig-generator-article-link"
                      href={`https://cheesegratermagazine.org/article/${article?.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Go to Article Page
                    </a>

                    <details>
                      <summary>Read Article / Select Excerpts</summary>

                      <div className="ig-generator-article-body">
                        <ArticleContent article={previewArticle} />
                      </div>
                    </details>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
