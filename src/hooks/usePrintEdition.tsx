import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type PastIssue = {
  name: string;
  url: string;
};

export function usePrintEdition() {
  const [data, setData] = useState<PastIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIssues() {
      setLoading(true);

      const { data: files, error } = await supabase.storage
        .from("past-issues")
        .list("", {
          limit: 200,
          sortBy: { column: "name", order: "desc" },
        });
      console.log("FILES:", files);
      console.log("ERROR:", error);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const issues =
        files
          ?.filter((file) => file.name.endsWith(".png"))
          .map((file) => {
            const slug = file.name.replace(".png", "");

            const { data } = supabase.storage
              .from("past-issues")
              .getPublicUrl(file.name);

            return {
              name: slug,
              url: data.publicUrl,
            };
          }) ?? [];

      setData(issues);
      setLoading(false);
    }

    fetchIssues();
  }, []);

  return { data, loading, error };
}
