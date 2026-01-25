import { supabase } from "../lib/supabaseClient";
import type { HomepageArticle, HomepageSection } from "./getHomepageSection";

export async function getHomepageSubsection(
  subsection: string,
  limit?: number,
): Promise<HomepageSection> {
  let query = supabase
    .from("articles")
    .select(
      "slug, title, summary, author, author_thumbnail, image_url, subsection, date_published",
    )
    .eq("subsection", subsection)
    .order("date_published", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;

  return {
    section: subsection,
    articles: data as HomepageArticle[],
  };
}
