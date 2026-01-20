import ArticleContent from "../article/ArticleContent"
import { useEffect, useState } from "react"
import { validateDraft } from "./validateDraft"
import { supabase } from "../../lib/supabaseClient"
import { triggerRedeploy } from "../../lib/triggerRedeploy"
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

  const isEdit = Boolean(draft.id)

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
    date_published: new Date(draft.publish_date).toISOString(),
  }

  const validation = validateDraft(draft);

  async function uploadImage(
    file: File,
    path: string
  ): Promise<string> {
    const { error } = await supabase.storage
      .from("images")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      })

    if (error) throw error

    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(path)

    return data.publicUrl
  }

  async function processContentImages(
    html: string,
    slug: string
  ): Promise<string> {
    const doc = new DOMParser().parseFromString(html, "text/html")
    const images = Array.from(doc.querySelectorAll("img"))

    let index = 1

    for (const img of images) {
      const src = img.getAttribute("src")
      if (!src || !src.startsWith("blob:")) continue

      const blob = await fetch(src).then(r => r.blob())
      const file = new File([blob], `image_${index}.webp`, { type: blob.type })

      const path = `article_images/${slug}/image_${index}.webp`
      const publicUrl = await uploadImage(file, path)

      img.setAttribute("src", publicUrl)
      index++
    }

    return doc.body.innerHTML
  }

  async function blobUrlToFile(blobUrl: string, name: string) {
    const blob = await fetch(blobUrl).then(r => r.blob())
    return new File([blob], name, { type: blob.type })
  }

  async function publishArticle() {
    if (!validation.valid) return

    if (!window.confirm("Publish this article?")) return

    const date = new Date()
    const datePrefix = date.toISOString().slice(0, 10)
    const slug = isEdit
      ? draft.slug
      : `${datePrefix}-${slugify(draft.title)}`

    try {
      // 1. Upload author image (if overridden blob)
      let authorThumbnailUrl = draft.author_thumbnail

      if (authorThumbnailUrl?.startsWith("blob:")) {
        const file = await blobUrlToFile(authorThumbnailUrl, "author.webp")
        authorThumbnailUrl = await uploadImage(
          file,
          `article_images/${slug}/author.webp`
        )
      }
      // 2. Upload main image
      let mainImageUrl: string | null = draft.image ?? null

      if (draft.image?.startsWith("blob:")) {
        const file = await blobUrlToFile(draft.image, "main.webp")
        mainImageUrl = await uploadImage(
          file,
          `article_images/${slug}/main_image.webp`
        )
      }

      // 3. Process editor content images
      const processedContent = await processContentImages(
        draft.content,
        slug
      )

      const articleRow = {
        slug,
        section: draft.section,
        subsection: draft.subsection,
        date_published: new Date(draft.publish_date).toISOString(),
        title: draft.title,
        summary: draft.summary || null,
        author: draft.author,
        author_thumbnail: authorThumbnailUrl,
        role: draft.role || null,
        image_url: mainImageUrl,
        image_caption: draft.image_caption || null,
        content: processedContent,
      }

      const query = isEdit
      ? supabase
          .from("articles")
          .update(articleRow)
          .eq("id", draft.id)
      : supabase
          .from("articles")
          .insert(articleRow)

      const { error } = await query

      if (error) throw error

      await triggerRedeploy();

      localStorage.removeItem("draft:article:new")
      window.location.href = "/editor"
    } catch (err) {
      console.error(err)
      alert("Failed to publish article.")
    }
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
