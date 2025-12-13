#!/usr/bin/env python3
import sys
import pandas as pd
import re
import html

# ----------------------------------------
# Fix apostrophes / HTML entities globally
# ----------------------------------------
def clean_entities(text: str) -> str:
    if text is None or pd.isna(text):
        return ""
    # Decode HTML entities (&8217; → ’)
    text = html.unescape(str(text))
    # Replace stray unicode apostrophes with normal ones
    text = text.replace("’", "'").replace("‘", "'")
    text = text.replace("“", '"').replace("”", '"')
    return text


# ----------------------------------------
# Turn slugs like:
#   2025/12/05/ucl-chairman-failed...
# Into:
#   2025-12-05-ucl-chairman-failed...
# ----------------------------------------
def fix_slug(slug: str) -> str:
    if slug is None or pd.isna(slug):
        return ""

    slug = clean_entities(slug)

    # Extract date part if present
    m = re.match(r"(\d{4})[/-](\d{2})[/-](\d{2})[/-]?(.*)", slug)
    if not m:
        # No date → just normalise hyphens
        s = slug.replace("/", "-")
        s = re.sub(r"[^a-zA-Z0-9-]+", "-", s)
        s = re.sub(r"-+", "-", s).strip("-").lower()
        return s

    yyyy, mm, dd, rest = m.groups()

    rest = rest.replace("/", "-")
    rest = re.sub(r"[^a-zA-Z0-9-]+", "-", rest)
    rest = re.sub(r"-+", "-", rest).strip("-").lower()

    return f"{yyyy}-{mm}-{dd}-{rest}"


# ----------------------------------------
# Main
# ----------------------------------------
def main():
    if len(sys.argv) != 3:
        print("Usage: python3 cleaning_6.py input.csv output.csv")
        sys.exit(1)

    infile = sys.argv[1]
    outfile = sys.argv[2]

    print(f"Loading CSV: {infile}")
    df = pd.read_csv(infile, dtype=str)

    # Ensure slug exists
    if "slug" not in df.columns:
        print("ERROR: CSV must contain a 'slug' column.")
        sys.exit(1)

    print("Cleaning slugs and text…")

    # Clean all text-like columns from HTML entities
    for col in df.columns:
        df[col] = df[col].astype(str).apply(clean_entities)

    # Fix slugs
    df["slug"] = df["slug"].apply(fix_slug)

    print(f"Saving to {outfile}")
    df.to_csv(outfile, index=False)
    print("Done.")


if __name__ == "__main__":
    main()
