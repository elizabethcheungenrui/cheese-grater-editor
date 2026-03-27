import type { IGCard, IGCoverDraft } from "./IGCard";

export type AuthorRef = {
  id?: string;
  name: string;
  slug?: string;
  isNew?: boolean;
};

export type ArticleAuthorJoin = {
  authors: AuthorRef;
};

export type DbArticle = {
  id: string;
  slug: string;
  link: string | null;
  section: string;
  subsection: string;
  date_published: string;
  title: string;
  summary: string | null;
  author: string | null; // legacy string
  author_thumbnail: string | null;
  role: string | null;
  image_url: string | null;
  image_width: number | null;
  image_height: number | null;
  image_caption: string | null;
  content: string | null;
  ig_cover: IGCoverDraft | null;
  ig_cards: IGCard[] | null;
};

export type Article = {
  id: string;
  slug: string;
  section: string;
  subsection: string;
  date_published: string;
  title: string;
  summary: string | null;
  authors: AuthorRef[];
  author_thumbnail: string | null;
  role: string | null;
  image_url: string | null;
  image_caption: string | null;
  content: string | null;
  igCover: IGCoverDraft;
  igCards: IGCard[];
};

export type DraftArticle = {
  id?: string;
  slug?: string;
  section: string;
  subsection: string;
  title: string;
  summary: string;
  authors: AuthorRef[];
  author_thumbnail: string | null;
  role: string;
  image: string | null;
  image_caption: string;
  content: string;
  publish_date: string;
  link: string;
  updatedAt: number;
  igCover: IGCoverDraft;
  igCards: IGCard[];
};

export type PodcastDraftArticle = {
  title: string;
  content: string;
  spotify_url: string;
  publish_date: string;
  updatedAt: number;
};

export function mapDbToArticle(
  db: DbArticle,
  authorRows: { id: string; name: string; slug: string }[],
): Article {
  return {
    id: db.id,
    slug: db.slug,
    section: db.section,
    subsection: db.subsection,
    date_published: db.date_published,
    title: db.title,
    summary: db.summary,
    authors: authorRows,
    author_thumbnail: db.author_thumbnail,
    role: db.role,
    image_url: db.image_url,
    image_caption: db.image_caption,
    content: db.content,
    igCover: db.ig_cover ?? {
      title: db.title,
      summary: db.summary ?? "",
    },
    igCards: db.ig_cards ?? [],
  };
}

export function mapDraftToPreviewArticle(draft: DraftArticle): Article {
  return {
    id: draft.id ?? "draft",
    slug: draft.slug ?? "preview",
    section: draft.section,
    subsection: draft.subsection,
    date_published: new Date(draft.publish_date).toISOString(),
    title: draft.title,
    summary: draft.summary || null,
    authors: draft.authors,
    author_thumbnail: draft.author_thumbnail,
    role: draft.role || null,
    image_url: draft.image,
    image_caption: draft.image_caption,
    content: draft.content,
    igCover: draft.igCover ?? {
      title: draft.title,
      summary: draft.summary ?? "",
    },
    igCards: draft.igCards ?? [],
  };
}
