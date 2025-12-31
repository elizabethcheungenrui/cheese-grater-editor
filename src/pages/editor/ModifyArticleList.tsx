import { useAllArticles } from "../../hooks/useAllArticles"
import { formatDate } from "../../methods/formatting"
import { Link } from "react-router-dom"
import "./ModifyArticleList.css"

export default function ModifyArticleList() {
  const { data, loading } = useAllArticles()

  if (loading) return <div>Loading…</div>

  return (
    <div className="modify-article-list">
      <h1>Modify Articles</h1>
      {data?.map(article => (
        <div className="modify-row">
          <div>
            <h3>{article.title}</h3>
            <div className="meta">
              <p>{article.section} / {article.subsection} ·{" "}
              {formatDate(article.date_published)}</p>
            </div>
          </div>

          <Link to={`/editor/edit/${article.id}`}>
            <button className="editor-button"><p>Edit Article</p></button>
          </Link>
        </div>
      ))}
    </div>
  )
}
