import ArticleContent from "../article/ArticleContent"
import { useEffect, useState } from "react"
import { validateDraft } from "./validateDraft"
import { supabase } from "../../lib/supabaseClient"
import "./ArticlePreview.css"

const DRAFT_KEY = "draft:article:new"

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // remove punctuation
    .replace(/\s+/g, "-")       // spaces → hyphens
    .replace(/-+/g, "-")        // collapse multiple hyphens
}

export default function ArticlePreview() {
  const [draft, setDraft] = useState<any | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return

    try {
      setDraft(JSON.parse(raw))
    } catch {
      setDraft(null)
    }
  }, [])

  if (!draft) {
    return <p>No draft to preview.</p>
  }

  // Build a fake Article object
  const article = {
    id: "draft",
    link: "preview",
    slug: "preview",
    section: draft.section,
    subsection: draft.subsection,
    title: draft.title || "Untitled",
    summary: draft.summary || "",
    author: draft.author || "Unknown",
    role: draft.role || "",
    author_thumbnail: draft.author_thumbnail,
    image_url: draft.image,
    image_caption: draft.image_caption,
    content: draft.content,
    date_published: new Date().toISOString(),
  }

  const validation = validateDraft(draft);

  async function publishArticle() {
    if (!validation.valid) return

    if (!window.confirm("Publish this article?")) return

    const date = new Date()
    const datePrefix = date.toISOString().slice(0, 10)
    const slug = `${datePrefix}-${slugify(draft.title)}`

    const articleRow = {
      slug,
      section: draft.section,
      subsection: draft.subsection,
      date_published: new Date().toISOString(),
      title: draft.title,
      summary: draft.summary || null,
      author: draft.author,
      author_thumbnail: draft.author_thumbnail,
      role: draft.role || null,
      image_url: draft.image,
      image_caption: draft.image_caption || null,
      content: draft.content,
    }

    const { error } = await supabase
      .from("articles")
      .insert(articleRow)

    if (error) {
      console.error(error)
      alert("Failed to publish article.")
      return
    }

    localStorage.removeItem("draft:article:new")
    window.location.href = "/editor"
  }

  return (
    <div className="article-preview">
      <ArticleContent article={article} />
      {!validation.valid && (
        <div className="publish-warning">
          <p>Cannot publish. Missing:</p>
          <ul>
            {validation.missing.map(field => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="editor-button"
        disabled={!validation.valid}
        onClick={publishArticle}
      >
        Publish Article
      </button>
    </div>
  );
}
