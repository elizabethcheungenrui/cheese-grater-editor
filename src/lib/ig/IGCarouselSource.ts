import DOMPurify from "dompurify";
import { marked } from "marked";

import type { IGCard } from "../types/IGCard";

/* TYPES */

export type IGCarouselDocument = {
  articleId: string;
  cover: {
    title: string;
    summary: string;
  };
  cards: IGCard[];
};

/* MARKDOWN RENDERING */

/**
 * Converts Markdown to sanitised HTML.
 *
 * The IGText, IGQuote and IGCover components
 * can then render this HTML directly.
 */
export function renderIGMarkdown(source: string): string {
  const html = marked.parse(source, {
    async: false,
    breaks: true,
    gfm: true,
  });

  if (typeof html !== "string") {
    throw new Error("Expected synchronous Markdown rendering.");
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
    ],
    ALLOWED_ATTR: ["href", "title"],
  });
}

/* DIRECTIVE HELPERS */

/**
 * Uses JSON strings to preserve quotation marks,
 * newlines and other special characters.
 */
function writeField(name: string, value: string): string {
  return `@${name} ${JSON.stringify(value)}`;
}

/**
 * Reads a directive such as:
 *
 * @title "An example headline"
 *
 * Also accepts unquoted values for easier
 * manual editing.
 */
function readField(line: string, name: string): string {
  const prefix = `@${name} `;

  if (!line.startsWith(prefix)) {
    throw new Error(`Expected @${name} directive.`);
  }

  const value = line.slice(prefix.length).trim();

  if (!value.startsWith('"')) {
    return value;
  }

  const decoded: unknown = JSON.parse(value);

  if (typeof decoded !== "string") {
    throw new Error(`@${name} must contain text.`);
  }

  return decoded;
}

/* SERIALISER */

/**
 * Converts carousel data into a single
 * portable Markdown-style string.
 */
export function serializeIGCarousel(
  document: IGCarouselDocument,
): string {
  const header = [
    writeField("article", document.articleId),
    "@cover",
    writeField("title", document.cover.title),
    writeField("summary", document.cover.summary),
  ].join("\n");

  const blocks = document.cards.map((card) => {
    if (card.type === "quote") {
      return [
        "@quote",
        writeField("author", card.quoteAuthor),
        writeField("author-role", card.quoteAuthorRole),
        "",
        card.content.trim(),
      ].join("\n");
    }

    return [
      "@text",
      "",
      card.content.trim(),
    ].join("\n");
  });

  return [header, ...blocks].join("\n\n---\n\n") + "\n";
}

/* PARSER */

/**
 * Converts the Markdown-style source
 * back into structured carousel data.
 *
 * The generated card IDs are local identifiers
 * used by React, not database records.
 */
export function parseIGCarousel(
  source: string,
): IGCarouselDocument {
  const blocks = source
    .replace(/\r\n?/g, "\n")
    .trim()
    .split(/^[ \t]*---[ \t]*$/gm)
    .map((block) => block.trim())
    .filter(Boolean);

  /* COVER */

  const header = blocks.shift();

  if (!header) {
    throw new Error("The carousel source is empty.");
  }

  const lines = header
    .split("\n")
    .map((line) => line.trim());

  if (!lines.includes("@cover")) {
    throw new Error("Expected @cover in the first block.");
  }

  const articleLine = lines.find((line) =>
    line.startsWith("@article "),
  );

  if (!articleLine) {
    throw new Error("Missing @article directive.");
  }

  const articleId = readField(articleLine, "article");

  if (!articleId) {
    throw new Error("Article ID cannot be empty.");
  }

  const titleLine = lines.find((line) =>
    line.startsWith("@title "),
  );

  const summaryLine = lines.find((line) =>
    line.startsWith("@summary "),
  );

  if (!titleLine || !summaryLine) {
    throw new Error(
      "The cover needs @title and @summary directives.",
    );
  }

  const cover = {
    title: readField(titleLine, "title"),
    summary: readField(summaryLine, "summary"),
  };

  /* TEXT AND QUOTE CARDS */

  const cards: IGCard[] = blocks.map((block, index) => {
    const [directive, ...remainingLines] =
      block.split("\n");

    const id = crypto.randomUUID();

    if (directive === "@text") {
      return {
        id,
        type: "text",
        content: remainingLines.join("\n").trim(),
      };
    }

    if (directive === "@quote") {
      const authorIndex = remainingLines.findIndex(
        (line) => line.trim() !== "",
      );

      if (
        authorIndex < 0 ||
        !remainingLines[authorIndex]
          .trim()
          .startsWith("@author ")
      ) {
        throw new Error(
          `Quote card ${index + 1} needs an @author directive.`,
        );
      }

      const quoteAuthor = readField(
        remainingLines[authorIndex].trim(),
        "author",
      );

      const afterAuthor = remainingLines.slice(authorIndex + 1);

      const roleIndex = afterAuthor.findIndex(
        (line) => line.trim() !== "",
      );

      let quoteAuthorRole = "";

      if (
        roleIndex !== -1 &&
        afterAuthor[roleIndex].trim().startsWith("@author-role ")
      ) {
        quoteAuthorRole = readField(
          afterAuthor[roleIndex].trim(),
          "author-role",
        );

        afterAuthor.splice(roleIndex, 1);
      }

      const content = afterAuthor.join("\n").trim();

      return {
        id,
        type: "quote",
        content,
        quoteAuthor,
        quoteAuthorRole,
      };
    }

    throw new Error(
      `Unknown card directive: ${directive ?? "(empty)"}`,
    );
  });

  return {
    articleId,
    cover,
    cards,
  };
}
