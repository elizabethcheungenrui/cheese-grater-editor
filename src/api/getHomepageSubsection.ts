import { supabase } from "../lib/supabaseClient";

export interface HomepageArticle {
  slug: string;
  title: string;
  summary: string | null;
  author: string;
  image_url: string | null;
  subsection: string;
  date_published: string;
}

export interface HomepageSection {
  section: string;
  articles: HomepageArticle[];
}

export async function getHomepageSubsection(subsection: string, limit?: number): Promise<HomepageSection> {
  let query = supabase
    .from("articles")
    .select("slug, title, summary, author, image_url, subsection, date_published")
    .eq("subsection", subsection)
    .order("date_published", { ascending: false })

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

