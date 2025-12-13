#!/usr/bin/env python3
import sys
import pandas as pd
import re
from bs4 import BeautifulSoup

# ---------------------------------------------------------
# Utility: remove tags but preserve media + essential attrs
# ---------------------------------------------------------
ALLOWED_TAGS = {
    "img": ["src", "alt"],
    "a": ["href"],
    "figure": [],
    "figcaption": [],
    "iframe": ["src", "width", "height"],
    "b": [],
    "i": [],
    "strong": [],
    "em": [],
    "p": [],
    "h3": [],
    "h4": [],
    "br": [],
}

def clean_html_keep_media(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")

    # Remove ALL divs at the start
    for div in soup.find_all("div"):
        div.unwrap()

    # Strip attributes except whitelisted ones
    for tag in soup.find_all(True):
        if tag.name not in ALLOWED_TAGS:
            tag.unwrap()
            continue

        allowed_attrs = ALLOWED_TAGS[tag.name]
        for attr in list(tag.attrs):
            if attr not in allowed_attrs:
                del tag.attrs[attr]

    return str(soup)


# ---------------------------------------------------------
# Remove duplicated header elements (title, summary, author…)
# ---------------------------------------------------------
def remove_duplicate_header_text(html, title, summary, author, role, img_url, caption):
    # Normalise ALL inputs first
    def s(x):
        return "" if x is None or pd.isna(x) else str(x)

    html     = s(html)
    title    = s(title)
    summary  = s(summary)
    author   = s(author)
    role     = s(role)
    img_url  = s(img_url)
    caption  = s(caption)

    # Now safe to escape
    patterns = [re.escape(x) for x in [title, summary, author, role, img_url, caption] if x]

    for p in patterns:
        html = re.sub(
            rf"<[^>]*>?[^<]*{p}[^<]*</[^>]*>|{p}",
            "",
            html,
            flags=re.IGNORECASE,
        )

    return html

# ---------------------------------------------------------
# Reformat <p> blocks into single spaced paragraphs
# ---------------------------------------------------------
def normalise_paragraph_spacing(html: str) -> str:
    # closing/opening paragraph → ensure exactly one blank line
    html = re.sub(r"</p>\s*<p>", "</p>\n\n<p>", html)
    return html


# ---------------------------------------------------------
# MAIN CLEANING PIPELINE
# ---------------------------------------------------------
def clean_content(html: str, title: str, summary: str, author: str, role: str, img_url: str, caption: str):
    if not html:
        return ""

    # Ensure html is always a string
    html = "" if html is None or pd.isna(html) else str(html)

    # Convert metadata safely
    def s(x): return "" if x is None or pd.isna(x) else str(x)

    title    = s(title)
    summary  = s(summary)
    author   = s(author)
    role     = s(role)
    img_url  = s(img_url)
    caption  = s(caption)

    # 1. remove duplicate header info
    html = remove_duplicate_header_text(html, title, summary, author, role, img_url, caption)

    # 2. remove divs + clean tags
    html = clean_html_keep_media(html)

    # 3. normal paragraph spacing
    html = normalise_paragraph_spacing(html)

    return html.strip()


# ---------------------------------------------------------
# CLI USAGE
# ---------------------------------------------------------
def main():
    if len(sys.argv) != 3:
        print("Usage: python3 clean_content.py input.csv output.csv")
        sys.exit(1)

    infile = sys.argv[1]
    outfile = sys.argv[2]

    print(f"Loading CSV: {infile}")
    df = pd.read_csv(infile)

    required_cols = ["content", "title", "summary", "author", "role", "image_url", "image_caption"]
    for col in required_cols:
        if col not in df.columns:
            print(f"ERROR: column '{col}' missing from CSV")
            sys.exit(1)

    print("Cleaning content…")

    df["content_clean"] = df.apply(
        lambda row: clean_content(
            row["content"],
            row["title"],
            row["summary"],
            row["author"],
            row["role"],
            row["image_url"],
            row["image_caption"],
        ),
        axis=1
    )

    print(f"Saving to: {outfile}")
    df.to_csv(outfile, index=False)
    print("Done!")


if __name__ == "__main__":
    main()
