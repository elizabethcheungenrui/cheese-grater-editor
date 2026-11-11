import type { DraftArticle } from "../types/Article";

export type BulkStatus = "pending" | "published" | "skipped";

export type BulkEntry = {
  id: string;
  batchId: string;
  position: number;
  draft: DraftArticle;
  status: BulkStatus;
  warnings: string[];
  publishedSlug?: string;
  publishedId?: string;
};

export type BulkBatch = {
  id: string;
  label: string;
  date: string;
  importedAt: number;
};

const DB_NAME = "cg-editor-bulk-import";
const DB_VERSION = 1;

function requestResult<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function finished(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted"));
  });
}

async function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const instance = req.result;
      if (!instance.objectStoreNames.contains("entries")) {
        instance.createObjectStore("entries", { keyPath: "id" });
      }
      if (!instance.objectStoreNames.contains("settings")) {
        instance.createObjectStore("settings");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function readBatch(): Promise<BulkBatch | null> {
  const instance = await db();
  try {
    const tx = instance.transaction("settings", "readonly");
    return (await requestResult(tx.objectStore("settings").get("current"))) ?? null;
  } finally {
    instance.close();
  }
}

export async function readEntry(id: string): Promise<BulkEntry | null> {
  const instance = await db();
  try {
    const tx = instance.transaction("entries", "readonly");
    const result = (await requestResult(tx.objectStore("entries").get(id))) ?? null;
    const batch = await readBatch();
    return result && result.batchId === batch?.id ? result : null;
  } finally {
    instance.close();
  }
}

export async function readEntries(): Promise<BulkEntry[]> {
  const batch = await readBatch();
  if (!batch) return [];
  const instance = await db();
  try {
    const tx = instance.transaction("entries", "readonly");
    const entries = await requestResult<BulkEntry[]>(tx.objectStore("entries").getAll());
    return entries.filter((e) => e.batchId === batch.id).sort((a, b) => a.position - b.position);
  } finally {
    instance.close();
  }
}

export async function saveEntry(entry: BulkEntry): Promise<void> {
  const instance = await db();
  try {
    const tx = instance.transaction("entries", "readwrite");
    const done = finished(tx);
    tx.objectStore("entries").put(entry);
    await done;
  } finally {
    instance.close();
  }
}

export async function saveBatch(batch: BulkBatch, entries: BulkEntry[]): Promise<void> {
  const instance = await db();
  try {
    const tx = instance.transaction(["entries", "settings"], "readwrite");
    const done = finished(tx);
    const store = tx.objectStore("entries");
    store.clear();
    for (const entry of entries) store.put(entry);
    tx.objectStore("settings").put(batch, "current");
    await done;
  } finally {
    instance.close();
  }
}

export async function deleteBatch(): Promise<void> {
  const instance = await db();
  try {
    const tx = instance.transaction(["entries", "settings"], "readwrite");
    const done = finished(tx);
    tx.objectStore("entries").clear();
    tx.objectStore("settings").delete("current");
    await done;
  } finally {
    instance.close();
  }
}
