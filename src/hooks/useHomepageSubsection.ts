import { useEffect, useState } from "react";
import { getHomepageSubsection } from "../api/getHomepageSubsection";
import type { HomepageSection } from "../api/getHomepageSubsection";

export function useHomepageSubsection(subsection: string, count?: number) {
  const [data, setData] = useState<HomepageSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomepageSubsection(subsection, count)
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [subsection, count]);

  return { data, loading };
}
