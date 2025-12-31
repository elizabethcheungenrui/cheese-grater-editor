import { useEffect, useState } from "react"
import { getAllArticles } from "../api/getAllArticles"
import type { AllArticle } from "../api/getAllArticles"

export function useAllArticles(limit?: number) {
  const [data, setData] = useState<AllArticle[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllArticles(limit)
      .then(setData)
      .finally(() => setLoading(false))
  }, [limit])

  return { data, loading }
}
