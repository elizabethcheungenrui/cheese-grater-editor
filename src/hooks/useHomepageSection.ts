import { useEffect, useState } from "react";
import { getHomepageSection } from "../api/getHomepageSection";
import type { HomepageSection } from "../api/getHomepageSection";

export function useHomepageSection(section: string, count: number) {
  const [data, setData] = useState<HomepageSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomepageSection(section, count)
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [section, count]);

  console.log("HOOK RUNNING FOR", section);
  console.log("SUPABASE QUERY RESULT:", data);
  return { data, loading };
}
