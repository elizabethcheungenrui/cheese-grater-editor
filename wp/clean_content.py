import pandas as pd
from bs4 import BeautifulSoup

INPUT_CSV = "cg_posts_api_FINAL.csv"
OUTPUT_CSV = "cg_posts_cleaned.csv"


# --------------------------------------------------------
# UTILITIES
# --------------------------------------------------------

def promote_bold_headings(soup):
    """
    Convert <p><strong>Heading</strong></p> into <h3>Heading</h3>
    Only when standalone bold lines appear.
    """
    for p in soup.find_all("p"):
        # Must contain exactly one child and that child is <strong>/<b>
        if len(p.contents) == 1 and p.find(["strong", "b"]):
            child = p.find(["strong", "b"])
            text = child.get_text(" ", strip=True)
            if text and len(text) < 80:
                new_h = soup.new_tag("h3")
                new_h.string = text
                p.replace_with(new_h)
    return soup


def fix_headings(soup):
    """
    Promote h1/h2/h4 to <h3> to keep consistent internal headings.
    """
    for h in soup.find_all(["h1", "h2", "h4"]):
        new_h = soup.new_tag("h3")
        new_h.string = h.get_text(" ", strip=True)
        h.replace_with(new_h)
    return soup


def clean_flourish_embeds(soup):
    """
    Replace Flourish embeds with thumbnail <img src="..."/>
    """
    for embed in soup.find_all("div", class_="flourish-embed"):
        noscript = embed.find("noscript")
        if noscript:
            img = noscript.find("img")
            if img and img.has_attr("src"):
                src = img["src"]
                new_img = soup.new_tag("img", src=src)
                embed.replace_with(new_img)
            else:
                embed.decompose()
        else:
            embed.decompose()
    return soup


def clean_alert_boxes(soup):
    """
    Convert Elementor alerts into <div class="alert">...</div>
    """
    for alert in soup.find_all("div", class_="elementor-alert"):
        title = alert.find("span", class_="elementor-alert-title")
        desc = alert.find("span", class_="elementor-alert-description")

        title_text = title.get_text(" ", strip=True) if title else ""
        desc_text = desc.get_text(" ", strip=True) if desc else ""

        new_div = soup.new_tag("div", **{"class": "alert"})
        if title_text:
            strong = soup.new_tag("strong")
            strong.string = title_text
            new_div.append(strong)
            new_div.append(soup.new_tag("br"))
        if desc_text:
            new_div.append(desc_text)

        alert.replace_with(new_div)

    return soup


def clean_block_and_inline_tags(soup):
    """
    Keep only allowed tags and strip attributes.
    """
    allowed_inline = ["i", "em", "strong", "b", "u"]
    allowed_block = ["p", "h3", "blockquote", "ul", "ol", "li",
                     "pre", "code", "table", "thead", "tbody", "tr", "td", "hr", "div"]
    allowed_media = ["img", "video", "source"]
    allowed_links = ["a"]

    # Remove scripts and styles outright
    for tag in soup.find_all(["script", "style"]):
        tag.decompose()

    # Clean <img>
    for img in soup.find_all("img"):
        if img.has_attr("src"):
            img.attrs = {"src": img["src"]}
        else:
            img.decompose()

    # Clean <video> and <source>
    for video in soup.find_all("video"):
        if video.has_attr("src"):
            video.attrs = {"src": video["src"]}
        else:
            video.attrs = {}
        for source in video.find_all("source"):
            if source.has_attr("src"):
                source.attrs = {"src": source["src"]}
            else:
                source.decompose()

    # Clean <a>
    for a in soup.find_all("a"):
        if a.has_attr("href"):
            a.attrs = {"href": a["href"]}
        else:
            a.unwrap()

    # Convert <iframe> to placeholder
    for iframe in soup.find_all("iframe"):
        src = iframe.get("src", "")
        placeholder = soup.new_string(f"[EMBED: {src}]")
        iframe.replace_with(placeholder)

    # Unwrap unnecessary structure tags
    unwrap_tags = ["div", "span", "figure", "figcaption"]
    for tagname in unwrap_tags:
        for tag in soup.find_all(tagname):
            if tag.get("class") == ["alert"]:
                continue
            tag.unwrap()

    # Strip unknown tags
    for tag in soup.find_all(True):
        if tag.name in allowed_inline:
            tag.attrs = {}
        elif tag.name in allowed_block:
            if tag.name != "div":
                tag.attrs = {}
        elif tag.name in allowed_media:
            continue
        elif tag.name in allowed_links:
            continue
        elif tag.name == "div" and tag.get("class") == ["alert"]:
            continue
        else:
            tag.unwrap()

    return soup


def insert_extra_titles_and_summaries(blocks):
    """
    Merge multiple Elementor content blocks into a single
    content value with internal headings (Option C).
    """
    merged = []

    for block in blocks:
        soup = BeautifulSoup(block, "lxml")

        soup = clean_flourish_embeds(soup)
        soup = clean_alert_boxes(soup)
        soup = promote_bold_headings(soup)
        soup = fix_headings(soup)

        merged.append(str(soup))

    return "\n\n".join(merged)


# --------------------------------------------------------
# MAIN CLEANING FUNCTION
# --------------------------------------------------------

def clean_content_html(raw_html):
    if not raw_html or not isinstance(raw_html, str):
        return ""

    # Fix paragraph break merging
    fixed_html = raw_html.replace("</p><p>", "</p>\n\n<p>")

    soup = BeautifulSoup(fixed_html, "lxml")

    # Clean tags
    soup = clean_flourish_embeds(soup)
    soup = clean_alert_boxes(soup)
    soup = promote_bold_headings(soup)
    soup = fix_headings(soup)
    soup = clean_block_and_inline_tags(soup)

    cleaned = str(soup)
    cleaned = cleaned.replace("\r", "")
    cleaned = cleaned.replace("\n\n\n", "\n\n")
    cleaned = cleaned.strip()
    return cleaned


# --------------------------------------------------------
# PROCESS FULL CSV
# --------------------------------------------------------

def main():
    df = pd.read_csv(INPUT_CSV)

    if "content" not in df.columns:
        raise ValueError("CSV does not contain a 'content' column")

    new_contents = []
    for raw in df["content"]:
        cleaned = clean_content_html(raw)
        new_contents.append(cleaned)

    df["content"] = new_contents
    df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")

    print(f"Saved cleaned output to {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
