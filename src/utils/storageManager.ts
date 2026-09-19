/**
 * Resilient multi-tier persistence manager for KGEC Robotics Society CMS.
 * Uses MongoDB database as cloud source of truth,
 * backed by IndexedDB for high-capacity offline caching (no 5MB limit),
 * and a quota-safe localStorage mirror for instant synchronous initial render.
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
    if (!res.ok) {
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
    if (!res.ok) {
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
    if (!res.ok) return null;
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
 * Create a lightweight version of payload for localStorage by trimming huge base64 strings
 */
function createQuotaSafePayload(rawPayload: any): any {
  if (!rawPayload || typeof rawPayload !== 'object') return rawPayload;

  const sanitizeImage = (val: any, fallbackUrl = ''): any => {
    if (typeof val === 'string' && val.startsWith('data:image/') && val.length > 2048) {
      return fallbackUrl || 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80';
    }
    return val;
  };

  const copy = { ...rawPayload };

  if (copy.metadata) {
    const metaCopy = { ...copy.metadata };
    if (metaCopy.kgecLogoDark?.length > 2048) metaCopy.kgecLogoDark = undefined;
    if (metaCopy.kgecLogoLight?.length > 2048) metaCopy.kgecLogoLight = undefined;
    if (metaCopy.krsLogoDark?.length > 2048) metaCopy.krsLogoDark = undefined;
    if (metaCopy.krsLogoLight?.length > 2048) metaCopy.krsLogoLight = undefined;
    if (metaCopy.footerLogoLight?.length > 2048) metaCopy.footerLogoLight = undefined;
    if (metaCopy.footerLogoDark?.length > 2048) metaCopy.footerLogoDark = undefined;
    copy.metadata = metaCopy;
  }

  if (Array.isArray(copy.botProjects)) {
    copy.botProjects = copy.botProjects.map((p: any) => ({
      ...p,
      imageUrl: sanitizeImage(p.imageUrl, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'),
    }));
  }

  if (Array.isArray(copy.techfestPhotos)) {
    copy.techfestPhotos = copy.techfestPhotos.map((p: any) => ({
      ...p,
      imageUrl: sanitizeImage(p.imageUrl),
    }));
  }

  if (Array.isArray(copy.activityPhotos)) {
    copy.activityPhotos = copy.activityPhotos.map((p: any) => ({
      ...p,
      imageUrl: sanitizeImage(p.imageUrl),
    }));
  }

  if (Array.isArray(copy.hackathonPhotos)) {
    copy.hackathonPhotos = copy.hackathonPhotos.map((p: any) => ({
      ...p,
      imageUrl: sanitizeImage(p.imageUrl),
    }));
  }

  if (Array.isArray(copy.teamMembers)) {
    copy.teamMembers = copy.teamMembers.map((m: any) => ({
      ...m,
      avatarUrl: sanitizeImage(m.avatarUrl, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'),
    }));
  }

  return copy;
}

/**
 * Save CMS payload to IndexedDB, localStorage mirror, and background MongoDB API.
 * Guarantees zero unhandled QuotaExceededError exceptions.
 */
let debouncedIdbTimer: NodeJS.Timeout | null = null;
let debouncedMongoTimer: NodeJS.Timeout | null = null;

export function persistCmsState(payload: unknown): void {
  if (typeof window === 'undefined') return;

  // 1. Debounced async persistence to IndexedDB (complete payload with full-res media)
  if (debouncedIdbTimer) clearTimeout(debouncedIdbTimer);
  debouncedIdbTimer = setTimeout(() => {
    saveToIndexedDB(payload);
  }, 100);

  // 2. Debounced background sync to MongoDB API
  if (debouncedMongoTimer) clearTimeout(debouncedMongoTimer);
  debouncedMongoTimer = setTimeout(() => {
    syncCmsToMongoDB(payload);
  }, 600);

  // 3. Safe localStorage write with automatic fallback
  try {
    const rawString = JSON.stringify(payload);
    // Check approximate byte size; if > 1.5MB, proactively sanitize to protect localStorage quota
    if (rawString.length > 1500000) {
      const lightweight = createQuotaSafePayload(payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    } else {
      localStorage.setItem(STORAGE_KEY, rawString);
    }
  } catch (err: any) {
    // QuotaExceededError or security restrictions: fallback to sanitized payload
    try {
      const lightweight = createQuotaSafePayload(payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    } catch {
      // If even lightweight fails because localStorage is completely saturated:
      // Remove stale key to free space, relying on IndexedDB as primary
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }
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
 * Full clean reset across both storage layers
 */
export async function clearAllCmsStorage(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  await clearIndexedDB();
}
