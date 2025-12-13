import requests
import re
import pandas as pd
from bs4 import BeautifulSoup, NavigableString, Tag

BASE = "https://cheesegratermagazine.org"
POSTS_API = BASE + "/wp-json/wp/v2/posts"


# -----------------------------
# Utilities
# -----------------------------

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

def strip_text(text):
    return text.strip() if text else ""


# -----------------------------
# Extractors
# -----------------------------

def extract_subsection(article_soup):
    meta = article_soup.find("span", class_="ast-terms-link")
    if not meta:
        return ""
    a = meta.find("a")
    return strip_text(a.text) if a else ""


def extract_summary(article_soup):
    wrap = article_soup.find("div", class_="elementor-testimonial-content")
    return strip_text(wrap.text) if wrap else ""


def extract_author(article_soup):
    name = article_soup.find("div", class_="elementor-testimonial-name")
    return strip_text(name.text) if name else ""


def extract_role(article_soup):
    """NEW: Extracts editor role, e.g. 'Editor-in-Chief'"""
    role = article_soup.find("div", class_="elementor-testimonial-job")
    return strip_text(role.text) if role else ""


def extract_primary_image(article_soup):
    fig = article_soup.find("figure", class_="wp-caption")
    if not fig:
        return "", ""
    img = fig.find("img")
    cap = fig.find("figcaption")

    return (
        img["src"] if img and img.has_attr("src") else "",
        cap.get_text(" ", strip=True) if cap else ""
    )


# -------- Clean content but keep images, figures, links --------

TAGS_TO_REMOVE = {"div", "span"}  # remove structure, keep visible elements

def clean_content_html(container: Tag) -> str:
    """
    Remove <div>, <span> tags ONLY, but preserve:
    - <img>, <figure>, <a>, <p>, <h2> etc.
    """
    c = container.__copy__()

    for tag in c.find_all(True):
        if tag.name in TAGS_TO_REMOVE:
            tag.unwrap()  # removes tag but keeps children

    return str(c)


def extract_content(article_soup):
    """Get all Elementor content blocks but clean formatting."""
    output_blocks = []

    containers = article_soup.find_all("div", class_="elementor-widget-container")
    for c in containers:
        if c.find(["p", "h2", "h3", "img", "figure"]):
            cleaned = clean_content_html(c)
            output_blocks.append(cleaned)

    return "\n\n".join(output_blocks)


# -----------------------------
# Fetch posts
# -----------------------------

def fetch_all_posts():
    posts = []
    page = 1

    while True:
        url = f"{POSTS_API}?per_page=100&page={page}"
        print("Fetching:", url)
        r = requests.get(url, timeout=15)

        if r.status_code != 200:
            break

        batch = r.json()
        if not batch:
            break

        posts.extend(batch)
        page += 1

    print("TOTAL POSTS:", len(posts))
    return posts


# -----------------------------
# MAIN
# -----------------------------

def main():
    wp_posts = fetch_all_posts()
    rows = []
    skipped_titles = []

    non_elementor_count = 0
    NON_ELEMENTOR_LIMIT = 5

    for p in wp_posts:
        try:
            link = p["link"]
            print("Processing:", link)

            html = requests.get(link, timeout=15).text
            soup = BeautifulSoup(html, "lxml")
            article = soup.find("article")

            if not article:
                print("  -> Skipped: no <article>")
                skipped_titles.append(p["title"]["rendered"])
                continue

            if not soup.find(class_="elementor"):
                non_elementor_count += 1
                print(f"  -> Non-elementor {non_elementor_count}/{NON_ELEMENTOR_LIMIT}")

                skipped_titles.append(p["title"]["rendered"])
                if non_elementor_count > NON_ELEMENTOR_LIMIT:
                    print("\n=== EARLY STOP: too many non-elementor posts ===\n")
                    break

                continue

            # Extract fields
            title = strip_text(p["title"]["rendered"])
            date_published = p["date"]

            subsection = extract_subsection(article)
            summary = extract_summary(article)
            author = extract_author(article)
            role = extract_role(article)

            img_url, img_caption = extract_primary_image(article)
            content = extract_content(article)

            rows.append({
                "slug": build_slug(date_published, title),
                "section": "",
                "subsection": subsection,
                "role": role,                     # NEW FIELD
                "summary": summary,
                "author": author,
                "image_url": img_url,
                "image_caption": img_caption,
                "content": content,
                "date_published": date_published,
                "title": title,
                "link": link
            })

        except Exception as e:
            print("ERROR:", e)
            skipped_titles.append(p["title"]["rendered"])

    # Save
    df = pd.DataFrame(rows)
    df.to_csv("cg_scrape_with_roles.csv", index=False, encoding="utf-8")
    print("Saved", len(rows), "rows → cg_scrape_with_roles.csv")

    with open("skipped_posts.txt", "w") as f:
        for t in skipped_titles:
            f.write(t + "\n")


if __name__ == "__main__":
    main()
