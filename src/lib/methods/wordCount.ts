export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function countWords(text: string): number {
  const clean = stripHtml(text);
  if (!clean) return 0;
  return clean.split(/\s+/).length;
}

