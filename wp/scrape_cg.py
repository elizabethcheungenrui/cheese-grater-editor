import requests
import json
import re
import pandas as pd
from bs4 import BeautifulSoup

BASE = "https://cheesegratermagazine.org"
POSTS_API = BASE + "/wp-json/wp/v2/posts"


# -------- utilities --------

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


# -------- main HTML extractors --------

def extract_subsection(article_soup):
    meta = article_soup.find("span", class_="ast-terms-link")
    if not meta: return ""
    a = meta.find("a")
    return strip_html(a.text) if a else ""

def extract_summary(article_soup):
    wrap = article_soup.find("div", class_="elementor-testimonial-wrapper")
    if not wrap: return ""
    content = wrap.find("div", class_="elementor-testimonial-content")
    return strip_html(content.text) if content else ""

def extract_author(article_soup):
    details = article_soup.find("div", class_="elementor-testimonial-details")
    if not details: return ""
    name = details.find("div", class_="elementor-testimonial-name")
    return strip_html(name.text) if name else ""

def extract_image(article_soup):
    img_wrap = article_soup.find("div", class_="elementor-testimonial-image")
    if not img_wrap: return ""
    img = img_wrap.find("img")
    return img["src"] if img and img.has_attr("src") else ""

def extract_figcaption(article_soup):
    cap = article_soup.find("figcaption")
    return strip_html(cap.text) if cap else ""

def extract_content(article_soup):
    blocks = []
    containers = article_soup.find_all("div", class_="elementor-widget-container")
    for c in containers:
        if c.find("p") is not None:
            blocks.append(str(c))
    return "\n\n".join(blocks)


# -------- fetch all posts --------

def fetch_all_posts():
    posts = []
    page = 1
    while True:
        url = f"{POSTS_API}?per_page=100&page={page}"
        print("Fetching:", url)
        r = requests.get(url, timeout=15)
        if r.status_code != 200: break
        batch = r.json()
        if not batch: break
        posts.extend(batch)
        page += 1
    print("TOTAL POSTS:", len(posts))
    return posts


# -------- main --------

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

            # Count non-elementor posts
            if not soup.find(class_="elementor"):
                non_elementor_count += 1
                print(f"  -> Skipped (non-elementor) [{non_elementor_count}/5]")

                skipped_titles.append(p["title"]["rendered"])

                # If more than 5 → EARLY TERMINATION
                if non_elementor_count > NON_ELEMENTOR_LIMIT:
                    print("\n=== EARLY STOP TRIGGERED: More than 5 non-elementor posts ===\n")
                    break

                continue

            # Otherwise: Elementor → extract normally
            title = strip_html(p["title"]["rendered"])
            date_published = p["date"]

            row = {
                "slug": build_slug(date_published, title),
                "section": "",
                "subsection": extract_subsection(article),
                "tag": "",
                "date_published": date_published,
                "title": title,
                "summary": extract_summary(article),
                "author": extract_author(article),
                "image_url": extract_image(article),
                "image_caption": extract_figcaption(article),
                "content": extract_content(article),
                "link": link,
            }

            rows.append(row)

        except Exception as e:
            print("ERROR:", e)
            skipped_titles.append(p["title"]["rendered"])

    # SAVE WHATEVER WE HAVE SO FAR
    df = pd.DataFrame(rows)
    df.to_csv("cg_posts_api_FINAL_partial.csv", index=False, encoding="utf-8")
    print(f"\nSaved {len(rows)} rows to cg_posts_api_FINAL_partial.csv")

    with open("skipped_non_elementor.txt", "w", encoding="utf-8") as f:
        for t in skipped_titles:
            f.write(t + "\n")
    print("Saved skipped titles.")


if __name__ == "__main__":
    main()
