import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Header from "../header-footer/Header";
import MoreMenu from "../header-footer/MoreMenu"
import ArticleContent from "./ArticleContent"
import type { Article } from "../../types/Article.ts";
import Footer from "../header-footer/Footer";

import "./ArticlePage.css";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error);
      } else {
        setArticle(data);
      }
      setLoading(false);
    }

    fetchArticle();
  }, [slug]);

  if (loading) return <p>Loading…</p>;
  if (!article) return <p>Article not found</p>;

  return (
    <div className="article">
      <Header onMoreClick={() => setMoreOpen(!moreOpen)} />
      
      <MoreMenu isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
      
      <ArticleContent article={article} />

      <Footer />
    </div>
  );
}
