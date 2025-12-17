import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ArticleContent from "./ArticleContent"
import type { Article } from "../../types/Article.ts";
import Footer from "../header-footer/Footer";

import "./ArticlePage.css";
import { useIsMobile } from "../../hooks/useIsMobile.ts";
import HeaderMobile from "../header-footer/HeaderMobile.tsx";
import HeaderDesktop from "../header-footer/HeaderDesktop.tsx";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

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
    <div className={ isMobile ? "page-mobile" : "page-desktop" }>
      {isMobile ? (<HeaderMobile />) : (<HeaderDesktop />)}
      <ArticleContent article={article} />
      <Footer />
    </div>
  );
}
