#!/usr/bin/env python3
import sys
import pandas as pd
from bs4 import BeautifulSoup

# ----------------------------------------------------------------
# IMAGES TO DELETE ANYWHERE IN CONTENT
# ----------------------------------------------------------------
BANNED_IMAGES = {
    "https://cheesegratermagazine.org/wp-content/uploads/2025/01/CG-Yellow.jpg",
    "https://cheesegratermagazine.org/wp-content/uploads/2017/06/Soc-bitch-logo-edit.jpg",
    "https://cheesegratermagazine.org/wp-content/uploads/2024/11/Humour-scaled.jpg",
    "https://cheesegratermagazine.org/wp-content/uploads/2024/11/Investigations-scaled.jpg",
    "https://cheesegratermagazine.org/wp-content/uploads/2024/11/CG-White-Border-PNG.png",
}

# ----------------------------------------------------------------
# CLEANING FUNCTION
# ----------------------------------------------------------------
def process_content(html: str):
    if not isinstance(html, str) or html.strip() == "":
        return "", ""

    soup = BeautifulSoup(html, "lxml")

    # ===============================================================
    # 1) REMOVE BANNED IMAGES FROM ANYWHERE
    # ===============================================================
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if src in BANNED_IMAGES:
            img.decompose()

    return str(soup).strip()


# ----------------------------------------------------------------
# MAIN SCRIPT LOGIC
# ----------------------------------------------------------------
def main():
    if len(sys.argv) != 3:
        print("Usage: python3 cleaning_4.py input.csv output.csv")
        sys.exit(1)

    infile = sys.argv[1]
    outfile = sys.argv[2]

    print(f"Loading CSV: {infile}")
    df = pd.read_csv(infile)

    print("Processing images…")

    new_contents = []

    for content in df["content"]:
        processed = process_content(content)
        new_contents.append(processed)

    df["content"] = new_contents

    print(f"Saving cleaned file to {outfile}")
    df.to_csv(outfile, index=False)
    print("Done.")


if __name__ == "__main__":
    main()
