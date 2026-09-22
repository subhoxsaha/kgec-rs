/**
 * Resilient multi-tier persistence manager for KGEC Robotics Society CMS.
 * Uses MongoDB database as cloud source of truth,
 * backed by IndexedDB for high-capacity offline caching (no 5MB limit),
 * and a synchronized localStorage mirror for instant initial render.
 */

export const STORAGE_KEY = 'kgec_robotics_society_cms_v1';
export const AUTH_STORAGE_KEY = 'kgec_krs_admin_auth_v1';
export const GOOGLE_USER_STORAGE_KEY = 'krs_gcp_google_user_v1';

const IDB_NAME = 'kgec_robotics_cms_db';
const IDB_VERSION = 1;
const IDB_STORE = 'cms_store';
const IDB_KEY = 'current_cms_state';

export interface MongoDbStatus {
  connected: boolean;
  uriConfigured: boolean;
  dbName: string;
  collections: string[];
  documentCounts?: Record<string, number>;
  lastChecked?: string;
  error?: string;
  storageMode?: 'mongodb_cloud' | 'local_resilient_disk';
}

/**
 * Check live MongoDB connection status from backend
 */
export async function fetchMongoDbStatus(force = false): Promise<MongoDbStatus> {
  try {
    const res = await fetch(`/api/db/status${force ? '?force=true' : ''}`);
    const ct = res.headers.get('content-type') || '';
    if (!res.ok || !ct.includes('application/json')) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      connected: false,
      uriConfigured: false,
      dbName: 'kgec_robotics',
      collections: [],
      error: err?.message || 'Failed to reach MongoDB backend API',
    };
  }
}

/**
 * Sync CMS State to MongoDB API
 */
export async function syncCmsToMongoDB(payload: unknown): Promise<{ success: boolean; target?: string; error?: string }> {
  try {
    const res = await fetch('/api/cms/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const ct = res.headers.get('content-type') || '';
    if (!res.ok || !ct.includes('application/json')) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    const result = await res.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to sync to MongoDB API' };
  }
}

/**
 * Fetch latest CMS State from MongoDB API
 */
export async function fetchCmsFromMongoDB(): Promise<any | null> {
  try {
    const res = await fetch('/api/cms/state');
    const ct = res.headers.get('content-type') || '';
    if (!res.ok || !ct.includes('application/json')) return null;
    const json = await res.json();
    if (json && json.state) {
      return json.state;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Open or upgrade native IndexedDB connection safely
 */
function openIndexedDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(IDB_NAME, IDB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Save state to IndexedDB (asynchronous, virtually unlimited storage capacity)
 */
export async function saveToIndexedDB(payload: unknown): Promise<boolean> {
  try {
    const db = await openIndexedDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        const req = store.put(payload, IDB_KEY);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

/**
 * Load state from IndexedDB
 */
export async function loadFromIndexedDB<T>(): Promise<T | null> {
  try {
    const db = await openIndexedDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const req = store.get(IDB_KEY);
        req.onsuccess = () => resolve((req.result as T) || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

/**
 * Clear data from IndexedDB
 */
export async function clearIndexedDB(): Promise<boolean> {
  try {
    const db = await openIndexedDB();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        const req = store.delete(IDB_KEY);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

/**
 * Save CMS payload across all storage layers (localStorage, IndexedDB, and MongoDB API).
 * Never strips or deletes uploaded images.
 */
let debouncedIdbTimer: NodeJS.Timeout | null = null;
let debouncedMongoTimer: NodeJS.Timeout | null = null;

export function persistCmsState(payload: any): void {
  if (typeof window === 'undefined' || !payload) return;

  // Ensure payload has timestamp
  if (!payload.lastUpdated) {
    payload.lastUpdated = Date.now();
  }

  // 1. Synchronous localStorage write for zero-delay refresh persistence
  try {
    const serialized = JSON.stringify(payload);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err: any) {
    // If browser localStorage quota is reached, rely on high-capacity IndexedDB
    try {
      console.warn('localStorage write failed, relying on IndexedDB:', err?.message);
    } catch {}
  }

  // 2. Debounced async persistence to IndexedDB (complete payload)
  if (debouncedIdbTimer) clearTimeout(debouncedIdbTimer);
  debouncedIdbTimer = setTimeout(() => {
    saveToIndexedDB(payload);
  }, 50);

  // 3. Debounced background sync to MongoDB API
  if (debouncedMongoTimer) clearTimeout(debouncedMongoTimer);
  debouncedMongoTimer = setTimeout(() => {
    syncCmsToMongoDB(payload);
  }, 400);
}

/**
 * Synchronous initial read from localStorage
 */
export function getStoredStateSync<T>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Full clean reset across all storage layers
 */
export async function clearAllCmsStorage(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  await clearIndexedDB();
}

