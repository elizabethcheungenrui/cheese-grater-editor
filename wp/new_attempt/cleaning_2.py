#!/usr/bin/env python3
import sys
import pandas as pd
import re
from bs4 import BeautifulSoup

# ---------------------------------------------------------
# Remove empty tags safely
# ---------------------------------------------------------
def remove_empty_tags(soup):
    removed = True
    while removed:
        removed = False
        for tag in soup.find_all():
            # Remove <p> and <figure> if they contain no text and no media
            if tag.name in ["p", "figure"]:
                if not tag.get_text(strip=True) and not tag.find("img"):
                    tag.decompose()
                    removed = True
                    break

            # Remove empty <img src="">
            if tag.name == "img" and (not tag.get("src") or tag.get("src").strip() == ""):
                tag.decompose()
                removed = True
                break

    return soup


# ---------------------------------------------------------
# Normalize spacing between paragraphs, figures, images
# ---------------------------------------------------------
def normalise_spacing(html):
    html = re.sub(r"\n\s*\n\s*\n+", "\n\n", html)       # collapse many blank lines → 1
    html = re.sub(r"</p>\s*<p>", "</p>\n\n<p>", html)   # spacing between paragraphs
    html = re.sub(r"</figure>\s*<p>", "</figure>\n\n<p>", html)
    html = re.sub(r"</p>\s*<figure>", "</p>\n\n<figure>", html)
    return html.strip()


# ---------------------------------------------------------
# MAIN SECOND-PASS CLEANER
# ---------------------------------------------------------
def clean_pass_two(html):
    if not isinstance(html, str):
        return ""

    soup = BeautifulSoup(html, "lxml")

    # Remove empty structures
    soup = remove_empty_tags(soup)

    # Output cleaned text
    cleaned = str(soup)

    # Normalise spacing rules
    cleaned = normalise_spacing(cleaned)

    # Remove trailing spaces
    cleaned = cleaned.strip()

    return cleaned


# ---------------------------------------------------------
# CLI USAGE
# ---------------------------------------------------------
def main():
    if len(sys.argv) != 3:
        print("Usage: python3 cleaning_2.py input.csv output.csv")
        sys.exit(1)

    infile = sys.argv[1]
    outfile = sys.argv[2]

    print(f"Loading: {infile}")
    df = pd.read_csv(infile)

    if "content_clean" not in df.columns:
        print("ERROR: Expected column 'content_clean' from cleaning_1.py")
        sys.exit(1)

    print("Running second-pass cleaning…")

    df["content_clean2"] = df["content_clean"].apply(clean_pass_two)

    print(f"Saving → {outfile}")
    df.to_csv(outfile, index=False)

    print("Done! Second-pass cleaning complete.")


if __name__ == "__main__":
    main()
