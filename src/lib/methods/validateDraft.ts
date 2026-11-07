import type { DraftArticle, PodcastDraftArticle } from "../types/Article";

type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateDraft(draft: DraftArticle): ValidationResult {
  const errors: string[] = [];

  if (!draft.section.trim()) errors.push("Missing section.");
  if (!draft.subsection.trim()) errors.push("Missing subsection.");
  if (!draft.title.trim()) errors.push("Missing title.");

  if (
    !draft.authors ||
    draft.authors.length === 0 ||
    draft.authors.some((a) => !a.name?.trim())
  ) {
    errors.push("Missing author.");
  }

  if (!draft.publish_date) errors.push("Missing publish date.");

  return {
    valid: errors.length === 0,
    errors,
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
