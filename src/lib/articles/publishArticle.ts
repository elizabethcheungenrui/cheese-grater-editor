import { supabase } from "../../lib/supabase/supabaseClient";
import { triggerRedeploy } from "../../lib/vercel/triggerRedeploy";
import { slugify, normaliseAuthorName, wpLinkToSlug, normaliseWpLink } from "./slugs";
import { uploadImage, processContentImages, blobUrlToFile } from "./imageHandler";
import type { DraftArticle } from "../types/Article";

export async function publishArticle(
  draft: DraftArticle,
  isEdit: boolean,
  forArchive: boolean,
) {
  const date = new Date(draft.publish_date);
  const datePrefix = date.toISOString().slice(0, 10);

  const derivedFromWp = draft.link ? wpLinkToSlug(draft.link) : null;
  let slug: string;
  if (derivedFromWp) {
    slug = derivedFromWp;
  } else if (isEdit) {
    if (!draft.slug) {
      throw new Error("Missing slug for edit mode");
    }
    slug = draft.slug;
  } else {
    slug = `${datePrefix}-${slugify(draft.title)}`;
  }

  try {
    // Upload author image (if overridden blob)
    let authorThumbnailUrl = draft.author_thumbnail;

    if (authorThumbnailUrl?.startsWith("blob:")) {
      const file = await blobUrlToFile(authorThumbnailUrl, "author.webp");
      const { url } = await uploadImage(
        file,
        `article_images/${slug}/author.webp`,
      );
      authorThumbnailUrl = url;
    }
    // Upload main image
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

    // Process editor content images
    const processedContent = await processContentImages(draft.content, slug);

    const normalisedLink = draft.link ? normaliseWpLink(draft.link) : null;

    const now = new Date();

    date.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );

    const authorString = draft.authors?.map((a) => a.name).join(", ") ?? null;

    const articleRow = {
      slug,
      link: normalisedLink,
      section: draft.section,
      subsection: draft.subsection,
      date_published: date.toISOString(),
      title: draft.title,
      summary: draft.summary || null,
      author: authorString,
      author_thumbnail: authorThumbnailUrl,
      role: draft.role || null,
      image_url: mainImageUrl,
      image_width: imageWidth,
      image_height: imageHeight,
      image_caption: draft.image_caption || null,
      content: processedContent,
      ig_cards: draft.igCards ?? [],
    };

    const query = isEdit
      ? supabase.from("articles").update(articleRow).eq("id", draft.id)
      : supabase.from("articles").insert(articleRow);

    const { data: articleData, error } = await query.select("id").single();
    if (error) throw error;

    const articleId = isEdit ? draft.id : articleData.id;

    // Notify ONLY on insert
    if (!isEdit) {
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ntfy-notify`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "New article published",
            message: `New article: ${draft.title}\nhttps://cheesegratermagazine.org/article/${slug}`,
          }),
        });
      } catch (err) {
        console.error("ntfy failed:", err);
        // don't break publishing if notification fails
      }
    }

    if (isEdit) {
      await supabase
        .from("article_authors")
        .delete()
        .eq("article_id", articleId);
    }

    // Ensure all authors exist in DB
    const resolvedAuthors = [];

    for (const author of draft.authors) {
      if (author.id) {
        resolvedAuthors.push(author);
        continue;
      }

      // New author -> insert
      const normalisedName = normaliseAuthorName(author.name);
      const slug = slugify(normalisedName);

      const { data, error } = await supabase
        .from("authors")
        .insert({
          name: author.name,
          name_normalized: normalisedName,
          slug,
        })
        .select("id, name, slug")
        .single();

      if (error) throw error;

      resolvedAuthors.push(data);
    }

    // Insert joins
    await Promise.all(
      resolvedAuthors.map(author =>
        supabase.from("article_authors").insert({
          article_id: articleId,
          author_id: author.id,
        })
      )
    );

    if (!forArchive) await triggerRedeploy();

    localStorage.removeItem("draft:article:new");
    window.location.href = "/editor";
  } catch (err: any) {
    console.error("Publish error:", err);
    alert(err?.message?? "Failed to publish article.");
  }
}
