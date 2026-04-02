import ArticleContent from "../article/ArticleContent";
import { useEffect, useState } from "react";
import { validatePodcastDraft } from "../../lib/methods/validateDraft";
import { supabase } from "../../lib/supabase/supabaseClient";
import { triggerRedeploy } from "../../lib/vercel/triggerRedeploy";
import "./ArticlePreview.css";

const DRAFT_KEY = "draft:podcast:new";

const PODCAST_THUMBNAIL: string =
  "https://images.cheesegratermagazine.org/logos/cg_podcast.jpeg";

const PODCAST_AUTHOR = {
  id: "grater-insight", // temporary preview id
  name: "Grater Insight",
  slug: "grater-insight",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PodcastPreview() {
  const [draft, setDraft] = useState<any | null>(null);
  const [spotifyEmbedHtml, setSpotifyEmbedHtml] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    try {
      setDraft(JSON.parse(raw));
    } catch {
      setDraft(null);
    }
  }, []);

  useEffect(() => {
    if (!draft?.spotify_url) return;

    let cancelled = false;

    async function fetchEmbed() {
      try {
        const res = await fetch(
          `https://open.spotify.com/oembed?url=${encodeURIComponent(
            draft.spotify_url,
          )}`,
        );

        if (!res.ok) return;

        const data = await res.json();

        if (!cancelled) {
          setSpotifyEmbedHtml(data.html);
        }
      } catch {
        // ignore invalid URL / network issues
      }
    }

    fetchEmbed();

    return () => {
      cancelled = true;
    };
  }, [draft?.spotify_url]);

  if (!draft) {
    return <p>No podcast draft to preview.</p>;
  }

  const isEdit = Boolean(draft.id);

  const combinedContent = [draft.content, spotifyEmbedHtml]
    .filter(Boolean)
    .join("\n\n");

  // Build a fake Article object
  const article = {
    id: "draft",
    link: "preview",
    slug: "preview",
    section: "Podcast",
    subsection: "Podcast",
    title: draft.title || "Untitled",
    summary: null,
    authors: [PODCAST_AUTHOR],
    role: null,
    author_thumbnail: PODCAST_THUMBNAIL,
    image_url: null,
    image_caption: null,
    content: combinedContent,
    date_published: new Date(draft.publish_date).toISOString(),
    igCover: {
      title: draft.title,
      summary: "",
    },
    igCards: [],
  };

  const validation = validatePodcastDraft(draft);

  async function publishPodcast() {
    if (!validation.valid) return;

    if (!window.confirm("Publish this podcast episode?")) return;

    const date = new Date();
    const datePrefix = date.toISOString().slice(0, 10);
    const slug = isEdit ? draft.slug : `${datePrefix}-${slugify(draft.title)}`;

    try {
      const podcastRow = {
        slug,
        section: "Podcast",
        subsection: "Podcast",
        date_published: new Date(draft.publish_date).toISOString(),
        title: draft.title,
        summary: null,
        author: "Grater Insight",
        author_thumbnail: PODCAST_THUMBNAIL,
        role: null,
        image_url: null,
        image_caption: null,
        content: combinedContent,
      };

      const query = isEdit
        ? supabase.from("articles").update(podcastRow).eq("id", draft.id)
        : supabase.from("articles").insert(podcastRow);

      const { data: articleData, error } = await query.select("id").single();
      if (error) throw error;

      const articleId = isEdit ? draft.id : articleData.id;

      const { data: authorRow, error: authorError } = await supabase
        .from("authors")
        .select("id")
        .eq("name_normalized", "grater insight")
        .single();

      if (authorError) throw authorError;

      const { error: linkError } = await supabase
        .from("article_authors")
        .insert({
          article_id: articleId,
          author_id: authorRow.id,
        });

      if (linkError) throw linkError;

      await triggerRedeploy();

      localStorage.removeItem(DRAFT_KEY);
      window.location.href = "/editor";
    } catch (err) {
      console.error(err);
      alert("Failed to publish podcast.");
    }
  }

  return (
    <div className="article-preview">
      <div>
        <ArticleContent article={article} />
        {!validation.valid && (
          <div className="publish-warning">
            <p>Cannot publish. Missing:</p>
            <ul>
              {validation.missing.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="editor-button"
          disabled={!validation.valid}
          onClick={publishPodcast}
        >
          Publish Podcast
        </button>
      </div>
    </div>
  );
}
