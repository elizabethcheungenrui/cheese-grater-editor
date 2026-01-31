import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import Footer from "../header-footer/Footer";
import Header from "../header-footer/Header";
import EditorUpload from "./EditorUpload";
import { Link, useParams } from "react-router-dom";
import { validatePodcastDraft } from "./validateDraft";

import "./EditorUploadPage.css";

type PodcastDraftArticle = {
  id?: string;
  slug?: string;
  title: string;
  author: string;
  author_thumbnail: string | null;
  content: string;
  spotify_url: string;
  spotify_embed_html?: string;
  publish_date: string;
  updatedAt: number;
};

const PODCAST_THUMBNAIL: string =
  "https://images.cheesegratermagazine.org/logos/cg_podcast.jpeg";

const DRAFT_KEY = "draft:podcast:new";

export default function EditorUploadPodcast({ mode }: { mode: string }) {
  const { id } = useParams<{ id: string }>();

  const [draft, setDraft] = useState<PodcastDraftArticle>(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return {
        title: "Episode",
        author: "Grater Insight",
        author_thumbnail: PODCAST_THUMBNAIL,
        content: "",
        spotify_url: "",
        publish_date: new Date().toISOString().slice(0, 10),
        updatedAt: Date.now(),
      };
    }

    try {
      return JSON.parse(raw);
    } catch {
      return {
        title: "Episode",
        author: "Grater Insight",
        author_thumbnail: PODCAST_THUMBNAIL,
        content: "",
        spotify_url: "",
        publish_date: new Date().toISOString().slice(0, 10),
        updatedAt: Date.now(),
      };
    }
  });

  useEffect(() => {
    if (mode !== "edit" || !id) return;

    async function loadPodcast() {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Failed to load podcast");
        return;
      }

      setDraft({
        id: data.id,
        slug: data.slug,
        title: data.title,
        author: data.author,
        author_thumbnail: data.author_thumbnail,
        content: data.content ?? "",
        spotify_url: data.spotify_url ?? "",
        spotify_embed_html: data.spotify_embed_html ?? undefined,
        publish_date: data.date_published.slice(0, 10),
        updatedAt: Date.now(),
      });
    }

    loadPodcast();
  }, [mode, id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ ...draft, updatedAt: Date.now() }),
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [draft]);

  function saveDraft() {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        ...draft,
        updatedAt: Date.now(),
      }),
    );
  }

  useEffect(() => {
    if (!draft.spotify_url) return;

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
          setDraft((d) => ({
            ...d,
            spotify_embed_html: data.html,
          }));
        }
      } catch {
        // silently ignore
      }
    }

    fetchEmbed();

    return () => {
      cancelled = true;
    };
  }, [draft.spotify_url]);

  const validation = validatePodcastDraft(draft);
  const canProceed = validation.valid;

  return (
    <div className="page-desktop">
      <Header />

      <div className="editor-upload">
        <h1>{mode == "create" ? "Podcast Upload" : "Edit Podcast"}</h1>

        <div className="editor-upload-columns">
          <div className="editor-upload-left">
            <div className="field">
              <h2>Publish Date</h2>
              <div className="date-fields">
                <input
                  type="date"
                  value={draft.publish_date}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, publish_date: e.target.value }))
                  }
                  className="date-field"
                />

                <button
                  type="button"
                  className="editor-button"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      publish_date: new Date().toISOString().slice(0, 10),
                    }))
                  }
                >
                  Today
                </button>
              </div>
            </div>

            <div className="field">
              <h2>Episode Title</h2>
              <textarea
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
                placeholder="Enter episode title"
                className="editor-title-textarea"
                spellCheck="false"
                rows={3}
              />
            </div>

            <div className="field">
              <h2>Podcast Content</h2>
              <EditorUpload
                initialContent={draft.content}
                onChange={(html) => setDraft((d) => ({ ...d, content: html }))}
              />
            </div>

            <div className="field">
              <h2>Spotify Episode Link</h2>
              <input
                type="url"
                value={draft.spotify_url}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, spotify_url: e.target.value }))
                }
                placeholder="https://open.spotify.com/episode/…"
                spellCheck={false}
                className="custom-subsection"
              />
            </div>

            <button
              className="preview-button"
              disabled={!canProceed}
              onClick={() => window.open("/editor/preview-podcast")}
            >
              Preview Article
            </button>
          </div>

          <div className="editor-upload-right">
            <button className="editor-button" onClick={saveDraft}>
              Save
            </button>
            <button
              className="editor-button"
              disabled={!canProceed}
              onClick={() => window.open("/editor/preview-podcast")}
            >
              Preview Article
            </button>

            <Link to="/editor">
              <button className="editor-button">Back to Editor Menu</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
