#!/usr/bin/env python3
import sys
import pandas as pd
import html

def clean_entities(text):
    """Decode HTML character references like &#8217; and &amp;."""
    if text is None or pd.isna(text):
        return ""
    text = str(text)

    # decode all HTML entities
    text = html.unescape(text)

    return text


def main():
    if len(sys.argv) != 3:
        print("Usage: python3 cleaning_5.py input.csv output.csv")
        sys.exit(1)

    infile = sys.argv[1]
    outfile = sys.argv[2]

    print(f"Loading CSV: {infile}")
    df = pd.read_csv(infile)

    # You want to clean content + any other text columns.
    # Apply to all columns that contain text.
    print("Decoding HTML entities…")

    text_cols = [
        col for col in df.columns
        if df[col].dtype == object
    ]

    for col in text_cols:
        df[col] = df[col].apply(clean_entities)

    print(f"Saving cleaned CSV → {outfile}")
    df.to_csv(outfile, index=False)
    print("Done!")


if __name__ == "__main__":
    main()
