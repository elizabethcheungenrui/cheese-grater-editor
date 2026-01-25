import { supabase } from "../lib/supabaseClient";

export interface AllArticle {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  author: string;
  author_thumbnail: string;
  image_url: string | null;
  section: string;
  subsection: string;
  date_published: string;
}

export interface AllSection {
  articles: AllArticle[];
}

export async function getAllArticles(limit?: number): Promise<AllArticle[]> {
  let query = supabase
    .from("articles")
    .select(
      "id, slug, title, summary, author, author_thumbnail, image_url, section, subsection, date_published",
    )
    .order("date_published", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data as AllArticle[];
}
