import ArticleContent from "../article/ArticleContent";
import IGCover from "../ig/IGCover";
import { useEffect, useState } from "react";
import { validateDraft } from "./validateDraft";
import { supabase } from "../../lib/supabaseClient";
import { triggerRedeploy } from "../../lib/triggerRedeploy";
import "./ArticlePreview.css";

const DRAFT_KEY = "draft:article:new";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove punctuation
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-"); // collapse multiple hyphens
}

export function wpLinkToSlug(link: string): string | null {
  try {
    // Handle full URLs and paths uniformly
    const url = link.startsWith("http")
      ? new URL(link)
      : new URL(link, "https://old.cheesegratermagazine.org");

    const path = url.pathname.replace(/\/+$/, "");

    const match = path.match(
      /^\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/([^/]+)$/
    );

    if (!match) return null;

    const [, year, month, day, slug] = match;
    return `${year}-${month}-${day}-${slug}`;
  } catch {
    return null;
  }
}

export function normaliseWpLink(link: string): string | null {
  try {
    const url = link.startsWith("http")
      ? new URL(link)
      : new URL(link, "https://old.cheesegratermagazine.org");

    return url.pathname.replace(/\/?$/, "/");
  } catch {
    return null;
  }
}

export default function ArticlePreview() {
  const [draft, setDraft] = useState<any | null>(null);

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

  const isEdit = Boolean(draft.id);

  // Build a fake Article object
  const article = {
    id: "draft",
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
    link: draft.link,
  };

  const validation = validateDraft(draft);

  async function uploadImage(
    file: File,
    path: string,
  ): Promise<{ url: string; width: number; height: number }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const res = await fetch("/api/uploadImage", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    return res.json();
  }

  async function processContentImages(
    html: string,
    slug: string,
  ): Promise<string> {
    const doc = new DOMParser().parseFromString(html, "text/html");

    const images = Array.from(doc.querySelectorAll("img"));

    let index = 1;

    for (const img of images) {
      const src = img.getAttribute("src");
      if (!src || !(src.startsWith("blob:") || src.startsWith("data:"))) continue;

      const response = await fetch(src);
      const blob = await response.blob();
      const ext = blob.type.split("/")[1] ?? "bin";
      const file = new File([blob], `image_${index}.${ext}`, {
        type: blob.type,
      });

      const path = `article_images/${slug}/image_${index}.webp`;
      const { url } = await uploadImage(file, path);
      img.setAttribute("src", url);
      index++;
    }

    return doc.body.innerHTML;
  }

  async function blobUrlToFile(blobUrl: string, name: string) {
    const blob = await fetch(blobUrl).then((r) => r.blob());
    return new File([blob], name, { type: blob.type });
  }

  async function publishArticle(forArchive: boolean) {
    if (!validation.valid) return;

    if (!window.confirm("Publish this article?")) return;

    const date = new Date(draft.publish_date);
    const datePrefix = date.toISOString().slice(0, 10);

    const derivedFromWp = draft.link ? wpLinkToSlug(draft.link) : null;

    const slug =
      derivedFromWp ??
      (isEdit
        ? draft.slug
        : `${datePrefix}-${slugify(draft.title)}`
      );
    
    try {
      // 1. Upload author image (if overridden blob)
      let authorThumbnailUrl = draft.author_thumbnail;

      if (authorThumbnailUrl?.startsWith("blob:")) {
        const file = await blobUrlToFile(authorThumbnailUrl, "author.webp");
        const { url } = await uploadImage(
          file,
          `article_images/${slug}/author.webp`,
        );
        authorThumbnailUrl = url;
      }
      // 2. Upload main image
      let mainImageUrl: string | null = draft.image ?? null;
      let imageWidth: number | null = null;
      let imageHeight: number | null = null;

      if (draft.image?.startsWith("blob:")) {
        const file = await blobUrlToFile(draft.image, "main.webp");
        const { url, width, height } = await uploadImage(
          file,
          `article_images/${slug}/main_image.webp`,
        );

        mainImageUrl = url;
        imageWidth = width;
        imageHeight = height;
      }

      // 3. Process editor content images
      const processedContent = await processContentImages(draft.content, slug);

      const normalisedLink = draft.link ? normaliseWpLink(draft.link) : null;

      const date = new Date(draft.publish_date);
      const now = new Date();

      date.setHours(
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      );

      const articleRow = {
        slug,
        link: normalisedLink,
        section: draft.section,
        subsection: draft.subsection,
        date_published: date.toISOString(),
        title: draft.title,
        summary: draft.summary || null,
        author: draft.author,
        author_thumbnail: authorThumbnailUrl,
        role: draft.role || null,
        image_url: mainImageUrl,
        image_width: imageWidth,
        image_height: imageHeight,
        image_caption: draft.image_caption || null,
        content: processedContent,
      };

      const query = isEdit
        ? supabase.from("articles").update(articleRow).eq("id", draft.id)
        : supabase.from("articles").insert(articleRow);

      const { error } = await query;
      if (error) throw error;

      if (!forArchive) await triggerRedeploy();

      localStorage.removeItem("draft:article:new");
      window.location.href = "/editor";
    } catch (err) {
      console.error(err);
      alert("Failed to publish article.");
    }
  }

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
            onClick={() => publishArticle(false)}
          >
            Publish Article
          </button>
          <button
            className="editor-button preview"
            disabled={!validation.valid}
            onClick={() => publishArticle(true)}
          >
            Publish Article (for archival)
          </button>
        </div>
      </div>

      <div className="right">
        <div className="ig-heading-text">
          <h1>IG Cards ( WIP :) )</h1>
          <p>Screenshot and crop for posting</p>
        </div>
        <IGCover article={article} />
      </div>
    </div>
  );
}
