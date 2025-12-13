#!/usr/bin/env ts-node

import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

if (process.argv.length < 4) {
  console.error("Usage: ts-node fix_wrapping.ts <input.csv> <output.csv>");
  process.exit(1);
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];

const rawCsv = fs.readFileSync(inputPath, "utf8");
const rows = parse(rawCsv, {
  columns: true,
  skip_empty_lines: false,
});

/**
 * Fixes line wrapping and hyphenation inside a single block of text
 * (no HTML tags assumed inside this helper).
 *
 * - word-<newline>word   ->  wordword
 * - any remaining newlines -> single spaces
 * - collapses multiple spaces
 */
function fixParagraphText(text: string): string {
  if (!text) return text;

  // normalise newlines
  let t = text.replace(/\r\n/g, "\n");

  // Join hyphenated line breaks: e.g. "Gov-\nernance" -> "Governance"
  // (\w)-\s*\n\s*(\w) allows punctuation elsewhere, but requires letters around the hyphen
  t = t.replace(/(\w)-\s*\n\s*(\w)/g, "$1$2");

  // Now any OTHER newline inside this fragment becomes a space
  t = t.replace(/\n+/g, " ");

  // Collapse multiple spaces
  t = t.replace(/[ \t]+/g, " ");

  return t.trim();
}

/**
 * Fixes the "summary" column.
 * Summary is usually short text, sometimes with manual line breaks.
 */
function fixSummary(summary: string): string {
  if (!summary) return summary;

  let t = summary.replace(/\r\n/g, "\n");

  // Same logic as paragraph text: fix hyphenation, then join newlines
  t = t.replace(/(\w)-\s*\n\s*(\w)/g, "$1$2");
  t = t.replace(/\n+/g, " ");
  t = t.replace(/[ \t]+/g, " ");

  return t.trim();
}

/**
 * Fixes the "content" column.
 *
 * Rules:
 * - Keep <p> and </p> tags exactly.
 * - Keep <h3> and </h3> tags exactly.
 * - Only unwrap/join lines inside those tag blocks.
 * - Do NOT touch apostrophes / quotes — we only operate on whitespace and hyphen+newline.
 */
function fixContent(content: string): string {
  if (!content) return content;

  let fixed = content.replace(/\r\n/g, "\n");

  // Process all <p>...</p> blocks
  fixed = fixed.replace(/<p>([\s\S]*?)<\/p>/g, (match, inner) => {
    const cleanedInner = fixParagraphText(inner);
    return `<p>${cleanedInner}</p>`;
  });

  // Process all <h3>...</h3> blocks
  fixed = fixed.replace(/<h3>([\s\S]*?)<\/h3>/g, (match, inner) => {
    const cleanedInner = fixParagraphText(inner);
    return `<h3>${cleanedInner}</h3>`;
  });

  return fixed;
}

// ---- apply to every row ----

for (const row of rows) {
  if (typeof row.summary === "string") {
    row.summary = fixSummary(row.summary);
  }
  if (typeof row.content === "string") {
    row.content = fixContent(row.content);
  }
}

const outCsv = stringify(rows, {
  header: true,
});
fs.writeFileSync(outputPath, outCsv, "utf8");

console.log(`Wrote cleaned CSV to ${outputPath}`);
