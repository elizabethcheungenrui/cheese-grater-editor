import JSZip from "jszip";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { DraftArticle } from "../types/Article";
import type { BulkBatch, BulkEntry } from "./bulkStore";

const UNKNOWN = /^(?:not stated|unknown|none|n\/a|)$/i;
const DEFAULT_THUMBNAIL = "https://images.cheesegratermagazine.org/author_thumbnails/cg_author.jpeg";

// Suggestions, not authoritative classifications. Prefer metadata in articles.md.
const LEGACY_ISSUE_22: Record<string, [string, string, string?]> = {
  "Black Woman on Question Time Shock": ["Humour", "Satire", "The Humour Desk"],
  "Down Your Union": ["News", "Union", "A.A."],
  "Cuts Like A Knife": ["News", "Provost"],
  "Gates Installed At UCL": ["News", "Investigations"],
  "Anatomy Blackout": ["News", "University"],
  "Society Bitch": ["Humour", "Soc Bitch"],
  "Spotted: Shit Journalism": ["Humour", "Humour"],
  "Toilet Paper (Part Two)": ["Humour", "Graphics"],
  "More Obama Success!": ["Humour", "Humour"],
  "Drug Driving": ["Humour", "Graphics"],
  "Radovan Karadžić’s Poetry Corner": ["Humour", "Humour"],
  "Climate Crusader?": ["Humour", "Humour"],
  "A Striker Speaks Out": ["Humour", "Humour"],
  "Grater Restaurant Review": ["Humour", "Humour", "The Humour Desk"],
  "Moir: I Know How Wacko Died": ["Humour", "Satire"],
  "Garden Walls of the World": ["Humour", "Humour"],
  "Liz Lecture": ["Humour", "Satire"],
  "Sudoku": ["Humour", "Graphics"],
};

const monthNumbers: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
  july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
};

function inferDate(header: string, filename: string): string | null {
  const match = `${header}\n${filename}`.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)[\s-]+(20\d\d|19\d\d)\b/i);
  return match ? `${match[2]}-${monthNumbers[match[1].toLowerCase()]}-01` : null;
}

function normalizePath(s: string): string {
  return s.replace(/\\/g, "/").replace(/^\.\//, "");
}

function escapeHTML(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function isMissing(s: string): boolean { return UNKNOWN.test(s.trim()); }

function fallbackAuthor(section: string): string {
  return section === "News" ? "The News Desk" : section === "Voices" ? "The Cheese Grater" : "The Humour Desk";
}

function fileAsDataURL(file: Blob, mime: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(new Blob([file], { type: mime }));
  });
}

export async function parseArchiveZip(file: File, preferredDate?: string): Promise<{ batch: BulkBatch; entries: BulkEntry[] }> {
  const zip = await JSZip.loadAsync(file);
  const candidates = Object.values(zip.files).filter((f) => !f.dir && /(?:^|\/)articles\.md$/i.test(f.name));
  if (candidates.length !== 1) throw new Error("ZIP must contain exactly one articles.md");
  const markdown = await candidates[0].async("string");
  const date = preferredDate || inferDate(markdown.slice(0, 220), file.name);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Could not determine issue date: choose it before importing");

  const matches = [...markdown.matchAll(/^## (.+?)\s*$/gm)];
  if (!matches.length) throw new Error("No article headings found (expected '## Title')");

  const batchId = crypto.randomUUID();
  const batch: BulkBatch = { id: batchId, label: file.name, date, importedAt: Date.now() };
  const entries: BulkEntry[] = [];
  const allImageFiles = Object.values(zip.files).filter((f) => !f.dir && /\.(?:png|jpe?g)$/i.test(f.name));

  for (let n = 0; n < matches.length; n++) {
    const title = matches[n][1].trim();
    const text = markdown.slice(matches[n].index! + matches[n][0].length, matches[n + 1]?.index ?? markdown.length)
      .replace(/\n\s*---\s*$/, "").trim();
    const lines = text.split(/\r?\n/);
    const metadata: Record<string, string> = {};
    let cursor = 0;
    while (cursor < lines.length) {
      if (!lines[cursor].trim()) { cursor++; continue; }
      const m = lines[cursor].match(/^\*\*(Standfirst|Author|Online Author|Section|Subsection|Date):\*\*\s*(.*?)\s*$/i);
      if (!m) break;
      metadata[m[1].toLowerCase()] = m[2].trim();
      cursor++;
    }
    const warnings: string[] = [];
    const isIssue22 = /CG22(?:-|\b)|Issue 22\b/i.test(`${file.name} ${markdown.slice(0, 120)}`);
    const mapped = isIssue22 ? LEGACY_ISSUE_22[title] : undefined;
    const section = metadata.section || mapped?.[0] || "News";
    const subsection = metadata.subsection || mapped?.[1] || "News";
    if (!metadata.section && !mapped) warnings.push("Section/subsection are suggestions only — review classification.");
    if (!metadata.subsection && !mapped) warnings.push("No explicitly supplied subsection.");
    const rawAuthor = metadata.author || "";
    // Facetious pseudonyms cannot be detected reliably in a browser. Future exports
    // should contain **Online Author:**; the legacy issue mapping covers known examples.
    const author = metadata["online author"] || mapped?.[2] || (isMissing(rawAuthor) ? fallbackAuthor(section) : rawAuthor);
    if (!metadata["online author"] && !mapped?.[2] && !isMissing(rawAuthor) && section === "Humour") {
      warnings.push("Check whether the listed byline is a genuine author or a facetious pseudonym.");
    }
    const standfirst = isMissing(metadata.standfirst || "") ? "" : DOMPurify.sanitize(metadata.standfirst, {
      ALLOWED_TAGS: ["em", "i", "strong", "b"], ALLOWED_ATTR: [],
    });
    if (/\[blank in original\]|\[missing|\[illegible/i.test(standfirst)) warnings.push("Standfirst includes a source-extraction uncertainty.");
    if (/\bnow out in\s*$/i.test(text)) warnings.push("Article may end mid-sentence; proofread against PDF.");
    if (title === "Drug Driving" && file.name.includes("CG22")) warnings.push("This appears to be a reproduced public-service advert; consider skipping it.");

    const imageRegex = /^\*\*\(IMAGE:\s*(.+?)\)\*\*\s*$/;
    const bodyLines = lines.slice(cursor);
    const htmlSource: string[] = [];
    let mainImage: string | null = null;
    let mainCaption = "";
    let substantiveSeen = false;
    let imageCount = 0;

    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i];
      const imgMatch = line.trim().match(imageRegex);
      if (!imgMatch) {
        if (line.trim() && !/^---$/.test(line.trim())) substantiveSeen = true;
        htmlSource.push(line);
        continue;
      }
      const filename = imgMatch[1].trim();
      const basename = filename.split(/[\\/]/).pop()!;
      const found = allImageFiles.filter((f) => normalizePath(f.name).split("/").pop() === basename);
      if (found.length !== 1) {
        warnings.push(`Missing or ambiguous image: ${filename}`);
        htmlSource.push(`**(MISSING IMAGE: ${filename})**`);
        continue;
      }
      const actual = found[0];
      const mime = /\.png$/i.test(actual.name) ? "image/png" : "image/jpeg";
      const data = await fileAsDataURL(await actual.async("blob"), mime);
      imageCount++;

      // Captions appear immediately under the placeholder, separated by a hard line break.
      // Only treat the next line as caption if the original placeholder ends with
      // two Markdown hard-break spaces and the next line is non-empty.
      let caption = "";
      if (/ {2,}$/.test(line) && bodyLines[i + 1]?.trim()) {
        i++;
        caption = bodyLines[i].trim();
        // Some extracted captions contain multiple lines, each with a hard break.
        while (/ {2,}$/.test(bodyLines[i]) && bodyLines[i + 1]?.trim()) {
          i++;
          caption += " " + bodyLines[i].trim();
        }
      }
      const cleanedCaption = caption.replace(/\s{2,}/g, " ");
      if (imageCount === 1 && !substantiveSeen) {
        mainImage = data;
        mainCaption = cleanedCaption;
      } else {
        htmlSource.push("", `<figure><img src="${escapeHTML(data)}" alt="" />${cleanedCaption ? `<figcaption>${escapeHTML(cleanedCaption)}</figcaption>` : ""}</figure>`, "");
      }
    }

    const html = DOMPurify.sanitize(String(marked.parse(htmlSource.join("\n").trim())), {
      ADD_TAGS: ["figure", "figcaption"],
      ADD_ATTR: ["src", "alt"],
    });
    const draft: DraftArticle = {
      section, subsection, title, summary: standfirst,
      authors: [{ name: author }],
      author_thumbnail: DEFAULT_THUMBNAIL,
      role: "", image: mainImage, image_caption: mainCaption,
      content: html, liveblog_eid: "", publish_date: metadata.date || date,
      updatedAt: Date.now(), link: "",
    };
    if (!imageCount && /graphics?/i.test(subsection)) warnings.push("Graphic has no attached image.");
    entries.push({ id: crypto.randomUUID(), batchId, position: n, draft, status: "pending", warnings });
  }

  return { batch, entries };
}
