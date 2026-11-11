import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../header-footer/Header";
import Footer from "../header-footer/Footer";

import {
  deleteBatch,
  readBatch,
  readEntries,
  saveBatch,
  saveEntry,
  type BulkBatch,
  type BulkEntry,
} from "../../lib/bulk/bulkStore";

import { parseArchiveZip } from "../../lib/bulk/parseArchive";
import { triggerRedeploy } from "../../lib/vercel/triggerRedeploy";

import "./BulkImportPage.css";

export default function BulkImportPage() {
  // IMPORT STATE

  const [batch, setBatch] = useState<BulkBatch | null>(null);
  const [entries, setEntries] = useState<BulkEntry[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // LOAD QUEUE FROM INDEXEDDB

  const refresh = useCallback(async () => {
    const [savedBatch, savedEntries] = await Promise.all([
      readBatch(),
      readEntries(),
    ]);

    setBatch(savedBatch);
    setEntries(savedEntries);
  }, []);

  useEffect(() => {
    refresh()
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : String(err),
        );
      })
      .finally(() => setLoading(false));
  }, [refresh]);

  // IMPORT ZIP

  async function importZip() {
    if (!file || busy) return;

    if (
      batch &&
      !window.confirm(
        "Replace the current bulk queue?\n\n" +
        "This will delete unpublished drafts stored in this browser. " +
        "Articles already published will not be affected.",
      )
    ) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const parsed = await parseArchiveZip(
        file,
        date || undefined,
      );

      await saveBatch(parsed.batch, parsed.entries);
      await refresh();

      setFile(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : String(err),
      );
    } finally {
      setBusy(false);
    }
  }

  // UPDATE ARTICLE STATUS

  async function updateStatus(
    entry: BulkEntry,
    status: BulkEntry["status"],
  ) {
    setWorkingId(entry.id);
    setError("");

    try {
      const updated: BulkEntry = {
        ...entry,
        status,
      };

      await saveEntry(updated);

      setEntries((current) =>
        current.map((item) =>
          item.id === entry.id ? updated : item,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : String(err),
      );
    } finally {
      setWorkingId(null);
    }
  }

  // DISCARD QUEUE

  async function discardQueue() {
    if (
      !window.confirm(
        "Discard the current bulk queue?\n\n" +
        "All unpublished drafts and their images stored " +
        "in this browser will be deleted.\n\n" +
        "Published articles will remain in Supabase.",
      )
    ) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      await deleteBatch();
      await refresh();

      setFile(null);
      setDate("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : String(err),
      );
    } finally {
      setBusy(false);
    }
  }

  // REDEPLOY

  async function redeployArticles() {
    if (
      !window.confirm(
        `Trigger a Vercel rebuild for the ${published} ` +
        "published article(s) in this queue?",
      )
    ) {
      return;
    }

    setBusy(true);

    try {
      await triggerRedeploy();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : String(err),
      );
    } finally {
      setBusy(false);
    }
  }

  // QUEUE STATISTICS

  const total = entries.length;

  const published = entries.filter(
    (entry) => entry.status === "published",
  ).length;

  const pending = entries.filter(
    (entry) => entry.status === "pending",
  ).length;

  const skipped = entries.filter(
    (entry) => entry.status === "skipped",
  ).length;

  const next = entries.find(
    (entry) => entry.status === "pending",
  );

  return (
    <div className="page-desktop">
      <Header />

      <main className="bulk-import">
        {/* PAGE HEADER */}

        <header className="bulk-import-header">
          <h1>Bulk Archive Import</h1>

          <p>
            Upload a ZIP containing <code>articles.md</code> and
            its corresponding PNG/JPEG images. Each article
            will be converted into a prefilled editor draft
            for review before publication.
          </p>

          <p>
            Your review queue is saved locally in this browser.
            You can leave and return without losing progress.
          </p>
        </header>

        {/* ZIP IMPORT */}

        <section className="bulk-import-upload">
          <h2>Import Archive</h2>

          <label htmlFor="bulk-import-file">
            Archive ZIP

            <input
              id="bulk-import-file"
              type="file"
              accept=".zip,application/zip"
              disabled={busy}
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setError("");
              }}
            />
          </label>

          <label htmlFor="bulk-import-date">
            Publication Date (Optional)

            <input
              id="bulk-import-date"
              type="date"
              value={date}
              disabled={busy}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <p>
            If no date is specified, articles will default
            to the first day of the issue's publication month,
            as determined from the archive.
          </p>

          <button
            type="button"
            disabled={!file || busy || loading}
            onClick={() => void importZip()}
          >
            {busy ? "Processing ZIP..." : "Prepare Review Queue"}
          </button>
        </section>

        {/* ERRORS */}

        {error && (
          <div className="bulk-import-error" role="alert">
            {error}
          </div>
        )}

        {/* INITIAL LOADING */}

        {loading && (
          <p role="status">Loading saved review queue...</p>
        )}

        {/* NO ACTIVE BATCH */}

        {!loading && !batch && (
          <section className="bulk-import-empty">
            <h3>No Active Import</h3>

            <p>
              Upload an archive ZIP above to start a new
              review queue.
            </p>
          </section>
        )}

        {/* ACTIVE BATCH */}

        {!loading && batch && (
          <>
            {/* QUEUE SUMMARY */}

            <section className="bulk-import-summary">
              <h2>{batch.label}</h2>

              <div className="bulk-import-stats">
                <div className="bulk-import-stat">
                  <strong>{total}</strong>
                  <span>Total</span>
                </div>

                <div className="bulk-import-stat">
                  <strong>{published}</strong>
                  <span>Published</span>
                </div>

                <div className="bulk-import-stat">
                  <strong>{pending}</strong>
                  <span>Pending</span>
                </div>

                <div className="bulk-import-stat">
                  <strong>{skipped}</strong>
                  <span>Skipped</span>
                </div>
              </div>
            </section>

            {/* QUEUE ACTIONS */}

            <div className="bulk-import-actions">
              {next && (
                <Link
                  className="editor-button"
                  to={`/editor/bulk-import/article/${next.id}`}
                >
                  Review Next Article
                </Link>
              )}

              <button
                type="button"
                disabled={published === 0 || busy}
                onClick={() => void redeployArticles()}
              >
                Redeploy Published Articles
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => void discardQueue()}
              >
                Discard Queue
              </button>
            </div>

            {/* ARTICLE QUEUE */}

            <section className="bulk-import-queue">
              <div className="bulk-import-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Article</th>
                      <th scope="col">Proposed Category</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {entries.map((entry) => {
                      const isPublished =
                        entry.status === "published";

                      const isPending =
                        entry.status === "pending";

                      const isSkipped =
                        entry.status === "skipped";

                      const isWorking =
                        workingId === entry.id;

                      return (
                        <tr key={entry.id}>
                          {/* NUMBER */}

                          <td>{entry.position + 1}</td>

                          {/* TITLE & WARNINGS */}

                          <td>
                            <strong>{entry.draft.title}</strong>

                            {entry.warnings.length > 0 && (
                              <details>
                                <summary>
                                  {entry.warnings.length} review
                                  {" "}
                                  {entry.warnings.length === 1
                                    ? "note"
                                    : "notes"}
                                </summary>

                                <ul>
                                  {entry.warnings.map(
                                    (warning, index) => (
                                      <li key={index}>
                                        {warning}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </details>
                            )}
                          </td>

                          {/* CATEGORY */}

                          <td>
                            {entry.draft.section}
                            {" / "}
                            {entry.draft.subsection}
                          </td>

                          {/* STATUS */}

                          <td>
                            <span
                              className={
                                "bulk-import-status " +
                                `bulk-import-status--${entry.status}`
                              }
                            >
                              {entry.status}
                            </span>
                          </td>

                          {/* ACTIONS */}

                          <td>
                            {!isPublished && (
                              <Link
                                to={
                                  `/editor/bulk-import/article/` +
                                  entry.id
                                }
                              >
                                Edit
                              </Link>
                            )}

                            {isPending && (
                              <button
                                type="button"
                                disabled={isWorking || busy}
                                onClick={() =>
                                  void updateStatus(
                                    entry,
                                    "skipped",
                                  )
                                }
                              >
                                Skip
                              </button>
                            )}

                            {isSkipped && (
                              <button
                                type="button"
                                disabled={isWorking || busy}
                                onClick={() =>
                                  void updateStatus(
                                    entry,
                                    "pending",
                                  )
                                }
                              >
                                Restore
                              </button>
                            )}

                            {isPublished &&
                              entry.publishedSlug && (
                                <a
                                  href={
                                    "https://cheesegratermagazine.org/article/" +
                                    entry.publishedSlug
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </a>
                              )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* COMPLETION MESSAGE */}

            {total > 0 && pending === 0 && (
              <section className="bulk-import-empty">
                <h3>Review Queue Complete</h3>

                <p>
                  All articles have been published or skipped.
                  You can redeploy the published articles above,
                  restore skipped entries, or import another issue.
                </p>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
