import { supabase } from "../lib/supabaseClient";

export interface HomepageArticle {
  id: string;
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

export async function getHomepageSection(section: string, limit: number = 3): Promise<HomepageSection> {
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, summary, author, image_url, subsection, date_published")
    .eq("section", section)
    .order("date_published", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return {
    section,
    articles: data as HomepageArticle[],
  };
}
