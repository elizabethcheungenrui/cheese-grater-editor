import { supabase } from "../../lib/supabase/supabaseClient";
import { useEffect, useState } from "react";
import "./AuthorSelector.css";

export default function AuthorSelector({
  authors,
  setAuthors,
}: {
  authors: { id: string; name: string }[];
  setAuthors: (a: { id: string; name: string }[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!search) return;

    const fetchAuthors = async () => {
      const { data } = await supabase
        .from("authors")
        .select("id, name")
        .ilike("name", `%${search}%`)
        .limit(5);

      setResults(data ?? []);
    };

    fetchAuthors();
  }, [search]);

  return (
    <div className="author-selector">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search author..."
        className="author-text"
      />

      <div>
        {results.map((r) => (
          <div
            key={r.id}
            onClick={() => {
              if (!authors.find((a) => a.id === r.id)) {
                setAuthors([...authors, r]);
              }
              setSearch("");
              setResults([]);
            }}
          >
            <p className="option-text">{r.name}</p>
          </div>
        ))}
      </div>

      <div className="author-list">
        {authors.map((a) => (
          <div key={a.id} className="author">
            <p className="author-text">{a.name}</p>
            <button
              onClick={() => setAuthors(authors.filter((x) => x.id !== a.id))}
              className="x-button"
            >
              <p className="author-text">×</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
