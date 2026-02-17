// Turns article titles into slugs. Is not applied if an old Wordpress version
// of the article exists.
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

    const match = path.match(/^\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/([^/]+)$/);

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
