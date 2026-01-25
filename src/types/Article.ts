export interface Article {
  id: string; // uuid
  link: string;
  slug: string;
  section: string;
  subsection: string;
  date_published: string; // ISO date string
  title: string;
  summary: string | null;
  author: string | null;
  author_thumbnail: string | null;
  role: string | null;
  image_url: string | null;
  image_caption: string | null;
  content: string | null;
}
