#!/usr/bin/env python3
import sys
import pandas as pd

# -------------------------------------------------------------
# Subsection → Section mapping rules
# -------------------------------------------------------------

HUMOUR_SET = {"humour", "satire", "graphics"}
VOICES_SET = {"voices", "editorial", "reviews", "soc bitch"}
PODCAST_SET = {"podcast"}

def map_section(subsection: str) -> str:
    """
    Normalises subsection text and maps to final section.
    """
    if subsection is None or pd.isna(subsection):
        return "News"

    s = str(subsection).strip().lower()

    if s in HUMOUR_SET:
        return "Humour"
    if s in VOICES_SET:
        return "Voices"
    if s in PODCAST_SET:
        return "Podcast"

    return "News"


# -------------------------------------------------------------
# MAIN
# -------------------------------------------------------------

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 cleaning_3.py input.csv output.csv")
        sys.exit(1)

    infile = sys.argv[1]
    outfile = sys.argv[2]

    print(f"Loading CSV: {infile}")
    df = pd.read_csv(infile)

    if "subsection" not in df.columns:
        print("ERROR: CSV requires a 'subsection' column.")
        sys.exit(1)

    print("Mapping subsection → section…")

    df["section"] = df["subsection"].apply(map_section)

    print(f"Saving cleaned CSV → {outfile}")
    df.to_csv(outfile, index=False)
    print("Done!")


if __name__ == "__main__":
    main()
