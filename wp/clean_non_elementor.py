import pandas as pd
import re

INPUT = "./cg_posts_with_sections.csv"
OUTPUT = INPUT


EMPTY_P_RE = re.compile(
    r"<p[^>]*>\s*(?:<br\s*/?>)?\s*</p>", 
    flags=re.IGNORECASE
)

def tighten_content(html: str) -> str:
    if not isinstance(html, str):
        return html

    # 1. Remove all empty paragraphs
    html = EMPTY_P_RE.sub("", html)

    # 2. Split into blocks by blank lines (current format)
    blocks = [b.strip() for b in html.split("\n\n") if b.strip()]

    new_blocks = []

    for b in blocks:
        is_p = b.startswith("<p") and b.endswith("</p>")
        is_head = b.startswith("<h") and b[2].isdigit()

        if is_p:
            # paragraphs stack with no empty line
            new_blocks.append(b)

        else:
            # headings / images / other: ensure spacing before
            if new_blocks:
                # Only add a blank line if previous block wasn't also a heading
                if not (is_head and (new_blocks[-1].startswith("<h"))):
                    new_blocks.append("")
            new_blocks.append(b)

    # 3. Join: paragraphs collapse; headings separated
    cleaned = "\n".join(new_blocks)

    # 4. Collapse multiple newlines (just in case)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)

    return cleaned


def main():
    df = pd.read_csv(INPUT)

    if "content" not in df.columns:
        raise ValueError("CSV must contain a 'content' column.")

    df["content"] = df["content"].apply(tighten_content)

    df.to_csv(OUTPUT, index=False, encoding="utf-8")
    print("Saved tightened file to", OUTPUT)


if __name__ == "__main__":
    main()

