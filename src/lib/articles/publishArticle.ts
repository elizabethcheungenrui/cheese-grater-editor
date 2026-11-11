import { supabase } from "../../lib/supabase/supabaseClient";
import { triggerRedeploy } from "../../lib/vercel/triggerRedeploy";
import { slugify, normaliseAuthorName, wpLinkToSlug, normaliseWpLink } from "./slugs";
import { uploadImage, processContentImages, blobUrlToFile } from "./imageHandler";
import type { DraftArticle } from "../types/Article";

export async function publishArticle(
  draft: DraftArticle,
  isEdit: boolean,
  forArchive: boolean,
  options: { bulk?: boolean } = {},
): Promise<{ id: string; slug: string } | null> {
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

  let insertedArticleId: string | null = null;
  try {
    // Detect duplicates before any image upload or database write.
    if (options.bulk) {
      const { data: existing, error: lookupError } = await supabase
        .from("articles").select("id").eq("slug", slug).maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) throw new Error(`An article already exists with slug ${slug}. Review the date/title or skip this entry.`);
    }

    // Upload author image (if overridden blob)
    let authorThumbnailUrl = draft.author_thumbnail;

    if (authorThumbnailUrl && /^(blob:|data:)/.test(authorThumbnailUrl)) {
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

    if (draft.image && /^(blob:|data:)/.test(draft.image)) {
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
      date_published: options.bulk ? `${datePrefix}T12:00:00` : date.toISOString(),
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
      liveblog_eid: draft.liveblog_eid || null,
    };

    const query = isEdit
      ? supabase.from("articles").update(articleRow).eq("id", draft.id)
      : supabase.from("articles").insert(articleRow);

    const { data: articleData, error } = await query.select("id").single();
    if (error) throw error;

    const articleId = isEdit ? draft.id : articleData.id;
    if (options.bulk && !isEdit) insertedArticleId = articleId as string;

    // Notify ONLY on insert and not for archive (i.e. published immediately)
    if (!isEdit && !forArchive) {
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
        console.log("ntfy succeeded"); 
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

    // Resolve authors by their unique normalised name to avoid duplicates.
    const resolvedAuthors: { id: string; name: string }[] = [];
    for (const author of draft.authors) {
      if (author.id) {
        resolvedAuthors.push({ id: author.id, name: author.name });
        continue;
      }
      const nameNormalized = normaliseAuthorName(author.name);
      const { data: existing, error: findError } = await supabase
        .from("authors").select("id, name").eq("name_normalized", nameNormalized).maybeSingle();
      if (findError) throw findError;
      if (existing) {
        resolvedAuthors.push(existing);
        continue;
      }
      const { data: created, error: insertError } = await supabase
        .from("authors")
        .insert({ name: author.name, name_normalized: nameNormalized, slug: slugify(nameNormalized) })
        .select("id, name").single();
      if (insertError) {
        // A concurrent import may have inserted this author after lookup.
        if (insertError.code !== "23505") throw insertError;
        const { data: concurrent, error: secondError } = await supabase
          .from("authors").select("id, name").eq("name_normalized", nameNormalized).single();
        if (secondError) throw secondError;
        resolvedAuthors.push(concurrent);
      } else {
        resolvedAuthors.push(created);
      }
    }

    // Check the result of each join insert rather than ignoring its error.
    for (const author of resolvedAuthors) {
      const { error: joinError } = await supabase.from("article_authors").insert({
        article_id: articleId,
        author_id: author.id,
      });
      if (joinError) throw joinError;
    }

    if (!forArchive) await triggerRedeploy();

    if (!options.bulk) {
      localStorage.removeItem("draft:article:new");
      window.location.href = "/editor";
    }
    return { id: articleId as string, slug };
  } catch (err: any) {
    if (options.bulk && insertedArticleId) {
      // Best-effort rollback for an incomplete archival article/author write.
      const { error: joinsDeleteError } = await supabase.from("article_authors")
        .delete().eq("article_id", insertedArticleId);
      const { error: articleDeleteError } = await supabase.from("articles")
        .delete().eq("id", insertedArticleId);
      if (joinsDeleteError || articleDeleteError) {
        console.error("Bulk import rollback incomplete:", joinsDeleteError, articleDeleteError);
        alert("The import failed after creating the article; rollback may be incomplete. Check Supabase before retrying.");
      }
    }
    console.error("Publish error:", err);
    alert(err?.message?? "Failed to publish article.");
    return null;
  }
}
