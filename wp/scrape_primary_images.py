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

# -------- primary image extractor --------

def extract_primary_image(article_soup):
    containers = article_soup.find_all("div", class_="elementor-widget-container")

    for c in containers:
        fig = c.find("figure", class_="wp-caption")
        if fig:
            img = fig.find("img")
            caption = fig.find("figcaption")

            url = img["src"] if img and img.has_attr("src") else ""
            cap = caption.get_text(" ", strip=True) if caption else ""
            return url, cap

    return "", ""

# -------- fetch all posts --------

def fetch_all_posts():
    posts = []
    page = 1

    while True:
        url = f"{POSTS_API}?per_page=100&page={page}&orderby=date&order=desc"
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

# -------- main --------

def main():
    wp_posts = fetch_all_posts()
    rows = []
    skipped_titles = []

    non_elementor_count = 0
    LIMIT = 5   # stop after more than 5 non-elementor posts

    for p in wp_posts:
        try:
            link = p["link"]
            post_id = p["id"]
            print("Processing:", link)

            html = requests.get(link, timeout=15).text
            soup = BeautifulSoup(html, "lxml")
            article = soup.find("article")

            if not article:
                print("  -> Skipped: no <article>")
                skipped_titles.append(p["title"]["rendered"])
                continue

            # early termination logic
            if not soup.find(class_="elementor"):
                non_elementor_count += 1
                print(f"  -> Skipped: non-Elementor [{non_elementor_count}/{LIMIT}]")
                skipped_titles.append(p["title"]["rendered"])

                if non_elementor_count > LIMIT:
                    print("\n=== EARLY STOP: Encountered >5 non-Elementor posts ===\n")
                    break

                continue

            # Elementor → extract
            title = strip_html(p["title"]["rendered"])
            date_published = p["date"]
            slug = build_slug(date_published, title)

            img_url, img_caption = extract_primary_image(article)

            rows.append({
                "id": post_id,
                "slug": slug,
                "link": link,
                "primary_image_url": img_url,
                "primary_image_caption": img_caption,
            })

        except Exception as e:
            print("ERROR on post", p.get("id"), ":", e)
            skipped_titles.append(p["title"]["rendered"])

    # save whatever was collected so far
    df = pd.DataFrame(rows)
    df.to_csv("cg_primary_images_partial.csv", index=False, encoding="utf-8")
    print("Saved", len(rows), "rows to cg_primary_images_partial.csv")

    with open("primary_skipped_non_elementor.txt", "w", encoding="utf-8") as f:
        for t in skipped_titles:
            f.write(t + "\n")

    print("Saved skipped titles.")


if __name__ == "__main__":
    main()
