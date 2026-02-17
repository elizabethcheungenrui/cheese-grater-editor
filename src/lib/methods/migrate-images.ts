import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function migrate() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, slug, image_url")
    .not("image_url", "is", null);

  if (error) throw error;

  for (const article of articles) {
    try {
      console.log(`Processing ${article.slug}`);

      // 1. Download image
      const res = await fetch(article.image_url);
      if (!res.ok) throw new Error("Failed to download image");

      const buffer = Buffer.from(await res.arrayBuffer());

      // 2. Compress
      const compressed = await sharp(buffer)
        .resize({ width: 2000, withoutEnlargement: true })
        .jpeg({ quality: 75 })
        .toBuffer();

      // 3. Upload
      const path = `article_images/${article.slug}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(path, compressed, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 4. Get public URL
      const { data } = supabase.storage.from("images").getPublicUrl(path);

      // 5. Update DB
      const { error: updateError } = await supabase
        .from("articles")
        .update({ image_url: data.publicUrl })
        .eq("id", article.id);

      if (updateError) throw updateError;

      console.log(`✔ ${article.slug}`);
    } catch (err) {
      console.error(`✖ ${article.slug}`, err);
    }
  }
}

migrate().catch(console.error);
