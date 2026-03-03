/**
 * IndexedDB utility for storing raw files between pages.
 * Files are stored as Blobs in an object store keyed by session ID.
 * Entries are cleaned up after use or when a new session starts.
 */

const DB_NAME = "kumpas-files";
const DB_VERSION = 1;
const STORE_NAME = "session-files";

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export interface StoredFile {
    name: string;
    type: string;
    blob: Blob;
}

/** Save an array of files under a session key. */
export async function saveFilesToIDB(
    sessionId: string,
    files: { slotIndex: number; file: File }[],
): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const entries: Record<number, StoredFile> = {};
    for (const { slotIndex, file } of files) {
        entries[slotIndex] = { name: file.name, type: file.type, blob: file };
    }

    store.put(entries, `files-${sessionId}`);

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => {
            db.close();
            resolve();
        };
        tx.onerror = () => {
            db.close();
            reject(tx.error);
        };
    });
}

/** Retrieve stored files for a session. Returns an empty object if none. */
export async function getFilesFromIDB(
    sessionId: string,
): Promise<Record<number, StoredFile>> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(`files-${sessionId}`);

    return new Promise((resolve, reject) => {
        req.onsuccess = () => {
            db.close();
            resolve((req.result as Record<number, StoredFile>) || {});
        };
        req.onerror = () => {
            db.close();
            reject(req.error);
        };
    });
}

/** Delete stored files for a session. Safe to call even if nothing exists. */
export async function deleteFilesFromIDB(sessionId: string): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(`files-${sessionId}`);

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => {
            db.close();
            resolve();
        };
        tx.onerror = () => {
            db.close();
            reject(tx.error);
        };
    });
}

/** Clear ALL stored files (useful on app init or when creating a new session). */
export async function clearAllFilesFromIDB(): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.clear();

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => {
            db.close();
            resolve();
        };
        tx.onerror = () => {
            db.close();
            reject(tx.error);
        };
    });
}
