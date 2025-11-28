import re
import json
import pandas as pd
from lxml import etree

NS = {
    "wp": "http://wordpress.org/export/1.2/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
    "dc": "http://purl.org/dc/elements/1.1/"
}

def extract_imgs(html):
    if not html:
        return []
    return re.findall(r"https?://[^\"'>]+\.(?:jpg|jpeg|png|gif|webp|svg)", html, flags=re.I)

def parse_wp_xml(xml_path):
    tree = etree.parse(xml_path)
    root = tree.getroot()

    # Build attachment lookup (post_id => attachment URL)
    attachments = {}
    for item in root.findall(".//item"):
        post_type = item.findtext("wp:post_type", namespaces=NS)
        if post_type == "attachment":
            post_id = item.findtext("wp:post_id", namespaces=NS)
            url = item.findtext("wp:attachment_url", namespaces=NS)
            attachments[post_id] = url

    posts = []
    for item in root.findall(".//item"):

        post_type = item.findtext("wp:post_type", namespaces=NS)

        # Only collect real posts/pages
        if post_type not in ["post", "page"]:
            continue

        post_id = item.findtext("wp:post_id", namespaces=NS)
        title = item.findtext("title")
        slug = item.findtext("wp:post_name", namespaces=NS)
        author = item.findtext("dc:creator", namespaces=NS)
        date = item.findtext("wp:post_date", namespaces=NS)
        content = item.findtext("content:encoded", namespaces=NS)
        excerpt = item.findtext("excerpt:encoded", namespaces=NS)

        # Categories and tags
        cats = [c.text for c in item.findall("category[@domain='category']") if c.text]
        tags  = [c.text for c in item.findall("category[@domain='post_tag']") if c.text]

        # Embedded images inside post HTML
        embedded_images = extract_imgs(content)

        # Featured image via _thumbnail_id
        thumb_id = None
        for meta in item.findall("wp:postmeta", namespaces=NS):
            key = meta.findtext("wp:meta_key", namespaces=NS)
            if key == "_thumbnail_id":
                thumb_id = meta.findtext("wp:meta_value", namespaces=NS)

        featured = attachments.get(thumb_id)

        # Final image list = embedded + featured (if exists)
        all_imgs = set(embedded_images)
        if featured:
            all_imgs.add(featured)

        posts.append({
            "id": post_id,
            "title": title,
            "slug": slug,
            "author": author,
            "date": date,
            "categories": cats,
            "tags": tags,
            "content": content,
            "excerpt": excerpt,
            "featured_image": featured,
            "image_urls": list(all_imgs)
        })

    return posts

def main():
    xml = "./cgwp.xml"   # put your uploaded XML filename here
    posts = parse_wp_xml(xml)

    # JSON
    with open("posts.json", "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    # CSV
    df = pd.DataFrame([
        {
            "id": p["id"],
            "title": p["title"],
            "slug": p["slug"],
            "author": p["author"],
            "date": p["date"],
            "categories": ", ".join(p["categories"]),
            "tags": ", ".join(p["tags"]),
            "featured_image": p["featured_image"] or "",
            "image_urls": ", ".join(p["image_urls"]),
            "content": p["content"],
            "excerpt": p["excerpt"],
        }
        for p in posts
    ])

    df.to_csv("posts.csv", index=False, encoding="utf-8")

    print("Generated posts.csv and posts.json")

if __name__ == "__main__":
    main()

