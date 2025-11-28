import requests
import re
import pandas as pd
from bs4 import BeautifulSoup, Tag

BASE = "https://cheesegratermagazine.org"
POSTS_API = BASE + "/wp-json/wp/v2/posts"

# ---------- utilities ----------

def slugify_title(title: str) -> str:
    t = title.lower()
    t = re.sub(r"[^a-z0-9]+", " ", t)
    t = t.strip()
    return re.sub(r"\s+", "-", t)

def build_slug(date_published: str, title: str) -> str:
    yyyy = date_published[0:4]
    mm = date_published[5:7]
    dd = date_published[8:10]
    return f"{yyyy}/{mm}/{dd}/{slugify_title(title)}"

def strip_html(text: str) -> str:
    return BeautifulSoup(text, "lxml").get_text(" ", strip=True) if text else ""


# =====================================================================
#   SECTION + SUBSECTION
# =====================================================================

def extract_subsection(article_soup):
    """
    Subsection from the category link in:
    <span class="ast-terms-link"><a>...</a></span>
    """
    meta = article_soup.find("span", class_="ast-terms-link")
    if not meta:
        return ""
    a = meta.find("a")
    return strip_html(a.text) if a else ""


def map_section(subsection: str) -> str:
    if not isinstance(subsection, str):
        return "News"
    s = subsection.strip().lower()

    humour_set = {"humour", "satire", "soc bitch", "graphics"}
    voices_set = {"voices", "editorial", "reviews"}
    podcast_set = {"podcast"}
    zine_set = {"zine"}

    if s in humour_set:
        return "Humour"
    if s in voices_set:
        return "Voices"
    if s in podcast_set:
        return "Podcast"
    if s in zine_set:
        return "Zine"

    return "News"


# =====================================================================
#   AUTHOR EXTRACTION
# =====================================================================

NAME_PATTERN = re.compile(r"^[A-Z][a-zA-Z’'\-]+(?: [A-Z][a-zA-Z’'\-]+){0,3}$")

def looks_like_name(text: str) -> bool:
    text = text.strip()
    if len(text.split()) > 4:
        return False
    if any(c in text for c in ["!", "?", ".", ":"]):
        return False
    return bool(NAME_PATTERN.match(text))


def extract_author_non_elementor(article_soup):
    body = article_soup.find("div", class_="entry-content")
    if not body:
        return ""

    paragraphs = body.find_all("p")
    texts = [strip_html(str(p)).strip() for p in paragraphs]

    # RULE 1: italic/bold short name
    for p, pure in zip(paragraphs, texts):
        if not pure or len(pure.split()) > 6:
            continue
        if p.find("em") or p.find("i") or p.find("strong") or p.find("b"):
            if looks_like_name(pure):
                return pure

    # RULE 2: "By X"
    for pure in texts:
        if pure.lower().startswith("by "):
            name = pure[3:].strip()
            if looks_like_name(name):
                return name

    # RULE 3: short name-like paragraph near top/bottom
    candidates = texts[:2] + texts[-3:]
    for pure in candidates:
        if looks_like_name(pure):
            return pure

    return ""


# =====================================================================
#   CONTENT CLEANING
# =====================================================================

ALLOWED_BLOCKS = {"p", "h2", "h3", "h4"}
ALLOWED_INLINE = {"em", "i", "strong", "b", "a"}

def clean_tag(tag: Tag) -> Tag:
    # unwrap spans entirely
    if tag.name == "span":
        tag.unwrap()
        return tag

    # block tags: strip attributes
    if tag.name in ALLOWED_BLOCKS:
        tag.attrs = {}

    # inline tags
    elif tag.name in ALLOWED_INLINE:
        if tag.name == "a":
            href = tag.get("href", "")
            tag.attrs = {"href": href} if href else {}
        else:
            tag.attrs = {}

    else:
        # unwrap anything else
        tag.unwrap()
        return tag

    # recurse into children
    for child in tag.children:
        if isinstance(child, Tag):
            clean_tag(child)

    return tag


def extract_content_non_elementor(article_soup):
    body = article_soup.find("div", class_="entry-content")
    if not body:
        return ""

    blocks = []
    for elem in body.find_all(list(ALLOWED_BLOCKS)):
        cleaned = clean_tag(elem)
        blocks.append(str(cleaned))

    return "\n\n".join(blocks)


# =====================================================================
#   MAIN IMAGE
# =====================================================================

def extract_old_main_image(article_soup):
    thumb = article_soup.find("div", class_="post-thumb-img-content")
    if not thumb:
        return "", ""
    img = thumb.find("img")
    url = img["src"] if img and img.has_attr("src") else ""
    return url, ""


# =====================================================================
#   FETCH POSTS
# =====================================================================

def fetch_all_posts():
    posts = []
    page = 1

    while True:
        url = f"{POSTS_API}?per_page=100&page={page}&orderby=date&order=desc"
        print("Fetching:", url)
        r = requests.get(url, timeout=20)
        if r.status_code != 200:
            break

        batch = r.json()
        if not batch:
            break

        posts.extend(batch)
        page += 1

    print("TOTAL POSTS:", len(posts))
    return posts


# =====================================================================
#   MAIN
# =====================================================================

def main():
    wp_posts = fetch_all_posts()
    rows = []
    skipped = []

    for p in wp_posts:
        link = p["link"]
        post_id = p["id"]
        print("Processing:", link)

        try:
            html = requests.get(link, timeout=20).text
            soup = BeautifulSoup(html, "lxml")
            article = soup.find("article")

            if not article:
                print("  -> Skipped: no <article>")
                skipped.append(p["title"]["rendered"])
                continue

            # ONLY non-elementor
            if soup.find(class_="elementor"):
                print("  -> Skipped: Elementor post")
                skipped.append(p["title"]["rendered"])
                continue

            title = strip_html(p["title"]["rendered"])
            date_published = p["date"]
            slug = build_slug(date_published, title)

            subsection = extract_subsection(article)
            section = map_section(subsection)
            tag = ""

            author = extract_author_non_elementor(article)
            image_url, image_caption = extract_old_main_image(article)
            content = extract_content_non_elementor(article)

            rows.append({
                "id": post_id,
                "slug": slug,
                "section": section,
                "subsection": subsection,
                "tag": tag,
                "date_published": date_published,
                "title": title,
                "author": author,
                "image_url": image_url,
                "image_caption": image_caption,
                "content": content,
                "link": link,
            })

        except Exception as e:
            print("ERROR:", e)
            skipped.append(p["title"]["rendered"])

    df = pd.DataFrame(rows)
    df.to_csv("cg_non_elementor_posts.csv", index=False, encoding="utf-8")
    print("Saved", len(rows), "rows.")

    with open("non_elementor_skipped.txt", "w", encoding="utf-8") as f:
        for t in skipped:
            f.write(t + "\n")

    print("Skipped count:", len(skipped))


if __name__ == "__main__":
    main()
