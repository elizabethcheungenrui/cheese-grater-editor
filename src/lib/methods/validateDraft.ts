import type { DraftArticle, PodcastDraftArticle } from "../types/Article";

export function validateDraft(draft: DraftArticle) {
  const missing: string[] = [];

  if (!draft.section.trim()) missing.push("section");
  if (!draft.subsection.trim()) missing.push("subsection");
  if (!draft.title.trim()) missing.push("title");
  if (
    !draft.authors ||
    draft.authors.length === 0 ||
    draft.authors.some((a) => !a.name?.trim())
  )
    missing.push("author");
  if (!draft.publish_date) missing.push("publish date");

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function validatePodcastDraft(draft: PodcastDraftArticle) {
  const missing: string[] = [];

  if (!draft.title.trim()) missing.push("title");
  if (!draft.publish_date) missing.push("publish date");
  if (!draft.spotify_url) missing.push("spotify url");

  return {
    valid: missing.length === 0,
    missing,
  };
}
