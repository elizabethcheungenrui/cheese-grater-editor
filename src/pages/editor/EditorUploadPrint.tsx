import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import Footer from "../header-footer/Footer";
import Header from "../header-footer/Header";
import { Link, useParams } from "react-router-dom";

import "./EditorUploadPage.css";
const DRAFT_KEY = "draft:print:new";

type DraftPrint = {
  id?: number;
  name: string;
  slug?: string;
  pdf_file: File | null;
  pdf_cover: string | null;
};
  
async function blobUrlToFile(blobUrl: string, name: string) {
  const blob = await fetch(blobUrl).then((r) => r.blob());
  return new File([blob], name, { type: blob.type });
}
  
export default function EditorUploadPrint({ mode }: { mode: string }) {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const [draft, setDraft] = useState<DraftPrint>(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return {
        name: "",
        slug: "",
        pdf_file: null,
        pdf_cover: null,
      };
    }

    try {
      return JSON.parse(raw);
    } catch {
      return {
        name: "",
        slug: "",
        pdf_file: null,
        pdf_cover: null,
      };
    }
  });

  useEffect(() => {
    if (mode !== "edit" || !id) return;

    async function loadPrint() {
      const { data, error } = await supabase
        .from("past-issues")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Failed to load print");
        return;
      }

      setDraft({
        name: data.name,
        slug: data.slug,
        pdf_file: null,
        pdf_cover: `print.cheesegratermagazine.org/${data.slug}.png/`,
      });
    }

    loadPrint();
  }, [mode, id]);

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
    const id = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ ...draft, updatedAt: Date.now() }),
      );
    }, 500);

    return () => clearTimeout(id);
  }, [draft]);

  const canPublish =
    draft.name.trim() !== "" &&
    draft.pdf_cover !== null &&
    (mode === "edit" || draft.pdf_file !== null);

  async function publishPrint() {
    // basic validation guard
    if (!draft.name.trim()) return;

    const isEdit = mode === "edit";

    if (!window.confirm(isEdit ? "Update this print edition?" : "Publish this print edition?")) {
      return;
    }

    // derive slug
    const slug = isEdit && draft.slug
      ? draft.slug
      : draft.pdf_file?.name.split(".")[0];

    if (!slug) {
      throw new Error("Unable to derive slug");
    }

    if (!draft.pdf_file || !draft.pdf_cover) {
      throw new Error("Missing PDF or cover");
    }

    console.log(slug);

    try {
      // 1. Upload cover image if it's a new blob
      if (draft.pdf_cover?.startsWith("blob:")) {
        const coverFile = await blobUrlToFile(draft.pdf_cover, `${slug}.png`);

        const formData = new FormData();
        formData.append("slug", slug);
        formData.append("pdf", draft.pdf_file);
        formData.append("cover", coverFile);

        const res = await fetch("/api/uploadPrint", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Print upload failed");
        }
      } else if (!isEdit) {
        throw new Error("Missing PDF or cover");
      }

      // 3. Insert / update database row
      const row = {
        name: draft.name,
        slug,
      };

      const query = isEdit
        ? supabase
            .from("past-issues")
            .update(row)
            .eq("id", draft.id)
        : supabase
            .from("past-issues")
            .insert(row);

      const { error } = await query;
      if (error) throw error;

      // 4. Cleanup + redirect
      localStorage.removeItem(DRAFT_KEY);
      window.location.href = "/editor";
    } catch (err) {
      console.error(err);
      alert("Failed to publish print edition.");
    }
  }

  return (
    <div className="page-desktop">
      <Header />

      <div className="editor-upload">
        <h1>{mode === "edit" ? "Edit Print Edition" : "Upload Print Edition"}</h1>

        <div className="editor-upload-columns">
          <div className="editor-upload-left">
            <div className="field">
              <h2>Issue Number</h2>

              <p>Issue  <input
                type="number"
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
                placeholder="XX"
                spellCheck={false}
                className="custom-subsection"
              /></p>
            </div>

            <div className="field">
              <h2>Cover Image</h2>
              <p>The first page of the pdf.</p>
              {draft.pdf_cover && (
                <img
                  src={draft.pdf_cover}
                  alt="Cover preview"
                  style={{ marginTop: 12, maxWidth: 260 }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const preview = URL.createObjectURL(file);
                  setDraft((d) => ({
                    ...d,
                    pdf_cover: preview,
                  }));
                }}
              />
            </div>

            <div className="field">
              <h2>Print PDF</h2>
              <p>The pdf file itself.</p>
              <p>Make sure the filename is formatted as <i>CG[Number]-[Month]-[Year].pdf</i>.</p>
              <p>For instance <i>CG01-October-2004.pdf</i>.</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setDraft((d) => ({
                    ...d,
                    pdf_file: file,
                  }));
                }}
              />

              {mode === "edit" && draft.slug && (
                <p style={{ marginTop: 8 }}>
                  Current PDF:{" "}
                  <a
                    href={`https://print.cheesegratermagazine.org/${draft.slug}.pdf`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                </p>
              )}
            </div>
            <button
              className="preview-button"
              disabled={!canPublish}
              onClick={publishPrint}
            >
              Publish
            </button>
          </div>

          <div className="editor-upload-right">
            <button
              className="editor-button"
              onClick={saveDraft}
            >
              Save Draft
            </button>

            <button
              className="editor-button"
              disabled={!canPublish}
              onClick={publishPrint}
            >
              Publish
            </button>

            <Link to="/editor">
              <button className="editor-button">
                Back to Editor Menu
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
