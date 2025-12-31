export type DraftArticle = {
  section: string
  subsection: string
  title: string
  summary: string
  author: string
  author_thumbnail: string | null
  role: string
  image: string | null
  image_caption: string
  content: string
  publish_date: string
  updatedAt: number
}

export function validateDraft(draft: DraftArticle) {
  const missing: string[] = []

  if (!draft.section.trim()) missing.push("section")
  if (!draft.subsection.trim()) missing.push("subsection")
  if (!draft.title.trim()) missing.push("title")
  if (!draft.author.trim()) missing.push("author")
  if (!draft.publish_date) missing.push("publish date")

  return {
    valid: missing.length === 0,
    missing,
  }
}
