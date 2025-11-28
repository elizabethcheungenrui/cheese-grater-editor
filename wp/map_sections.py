import pandas as pd

INPUT_CSV = "cg_posts_cleaned.csv"
OUTPUT_CSV = "cg_posts_with_sections.csv"

def map_section(subsection):
    if not isinstance(subsection, str):
        return "News"

    s = subsection.strip().lower()

    humour_set = {"humour", "satire", "soc bitch", "graphics"}
    voices_set = {"voices", "editorial", "reviews"}
    podcast_set = {"podcast"}

    if s in humour_set:
        return "Humour"
    if s in voices_set:
        return "Voices"
    if s in podcast_set:
        return "Podcast"

    return "News"


def main():
    df = pd.read_csv(INPUT_CSV)

    if "subsection" not in df.columns:
        raise ValueError("CSV must contain a 'subsection' column.")

    df["section"] = df["subsection"].apply(map_section)

    df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")
    print(f"Saved with mapped sections → {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
