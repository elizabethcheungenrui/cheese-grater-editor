import { supabase } from "../../lib/supabase/supabaseClient";
import type { AuthorRef } from "../../lib/types/Article";
import { useEffect, useState } from "react";
import "./AuthorSelector.css";

export default function AuthorSelector({
  authors,
  setAuthors,
}: {
  authors: AuthorRef[];
  setAuthors: (a: AuthorRef[]) => void;
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

  const normalisedSearch = search.trim().toLowerCase();

  const hasExactMatch = results.some(
    (r) => r.name.trim().toLowerCase() === normalisedSearch
  );

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

        {search && !hasExactMatch && (
          <div
            className="add-new-author"
            onClick={() => {
              const name = window.prompt("Enter new author name:", search);
              if (!name) return;

              if (!authors.find((a) => a.name === name)) {
                setAuthors([
                  ...authors,
                  { name, isNew: true },
                ]);
              }

              setSearch("");
              setResults([]);
            }}
          >
            <p className="option-text">Add new author: "{search}"</p>
          </div>
        )}
      </div>

      <div className="author-list">
        {authors.map((a) => (
          <div key={a.id ?? a.name} className="author">
            <p className="author-text">{a.name}</p>
            <button
              onClick={() => setAuthors(authors.filter((x) => (x.id ?? x.name) !== (a.id ?? a.name)))}
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
