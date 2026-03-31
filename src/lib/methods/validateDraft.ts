import type { DraftArticle, PodcastDraftArticle } from "../types/Article";
import { countWords } from "./wordCount"

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

  const coverSummaryWords = countWords(draft.igCover?.summary ?? "");
  if (coverSummaryWords > 20) {
    errors.push(
      `IG cover standfirst exceeds 20 words. (${coverSummaryWords}/20)`,
    );
  }

  for (const [index, card] of (draft.igCards ?? []).entries()) {
    if (card.type === "text") {
      const words = countWords(card.content);
      if (words === 0) {
        errors.push(
          `IG card ${index + 1} has no text.`
        );
      }
      if (words > 140) {
        errors.push(
          `IG card ${index + 1} exceeds 140 words. (${words}/140)`,
        );
      }
    }

    if (card.type === "quote") {
      const words = countWords(card.content);
      if (words === 0) {
        errors.push(
          `IG card ${index + 1} has no text.`
        );
      }
      if (words > 60) {
        errors.push(
          `IG quote card ${index + 1} exceeds 60 words. (${words}/60)`,
        );
      }
      if (!card.quoteAuthor.trim()) errors.push(`IG card ${index + 1} has no quote author.`);  
    }
  }

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
