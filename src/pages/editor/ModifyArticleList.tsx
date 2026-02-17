import { useAllArticles } from "../../lib/supabase/useAllArticles";
import { formatDate } from "../../lib/methods/formatting";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase/supabaseClient";
import { useState, useEffect } from "react";
import { triggerRedeploy } from "../../lib/vercel/triggerRedeploy";
import "./ModifyArticleList.css";

export default function ModifyArticleList() {
  const { data, loading } = useAllArticles();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [articles, setArticles] = useState(data);

  useEffect(() => {
    if (data) {
      setArticles(data);
    }
  }, [data]);

  if (loading) return <div>Loading…</div>;
  if (!articles) return null;

  async function deleteArticle(id: string, title: string) {
    const ok = window.confirm(
      `Are you sure you want to delete:\n\n"${title}"\n\nThis cannot be undone.`,
    );

    if (!ok) return;

    setDeletingId(id);

    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);

      if (error) throw error;

      // Optimistically remove from UI
      setArticles((prev) => prev?.filter((a) => a.id !== id) ?? []);

      await triggerRedeploy();
    } catch (err) {
      console.error(err);
      alert("Failed to delete article.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="modify-article-list">
      <h1>Modify/Delete Articles</h1>
      {articles?.map((article) => (
        <div className="modify-row" key={article.id}>
          <div>
            <h3>{article.title}</h3>
            <div className="meta">
              <p>
                {article.section} / {article.subsection} ·{" "}
                {formatDate(article.date_published)}
              </p>
            </div>
          </div>

          <div className="modify-actions">
            <Link to={`/editor/edit/${article.id}`}>
              <button className="editor-button">
                <p>Edit</p>
              </button>
            </Link>

            <button
              className="editor-button danger"
              disabled={deletingId === article.id}
              onClick={() => deleteArticle(article.id, article.title)}
            >
              <p>{deletingId === article.id ? "Deleting…" : "Delete"}</p>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
