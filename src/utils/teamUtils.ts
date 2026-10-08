import { TeamMember, BotProject, EventPhoto } from '../types';
import { INITIAL_TEAM_MEMBERS } from '../data/teamData';

/**
 * Static Data Fetchers & Asset Resolvers
 * Fetches structured data directly from `/data/*.json` files.
 * Images can be placed in `/public/team/`, `/public/events/`, `/public/projects/`.
 */

export const STATIC_TEAM_JSON_PATH = '/data/team.json';
export const STATIC_EVENTS_JSON_PATH = '/data/events.json';
export const STATIC_PROJECTS_JSON_PATH = '/data/projects.json';
export const STATIC_SITE_CONTENT_PATH = '/data/site-content.json';

export interface MediaManifest {
  team: string[];
  events: string[];
  projects: string[];
  logos: string[];
}

// In-memory cache of files detected in public directories
let cachedMediaManifest: MediaManifest = {
  team: [
    'tb-1.webp',
    'tb-4.png',
    'sb-2.jpg',
    'sb-3.jpg',
    'Anirban_Mukherjee.jpg',
    'dr-sourabh-kumar-das-principal.webp',
    'IMG_20260921_123259.jpg',
    'Screenshot_20260922_202348.jpg',
    'Screenshot_20260922_202414.jpg',
    'Tanmoy_Debnath.jpg',
    'treasurer.png',
  ],
  events: [],
  projects: [],
  logos: ['kgec-logo.svg', 'krs-logo.png'],
};

const manifestListeners = new Set<(manifest: MediaManifest) => void>();

export function subscribeToMediaManifest(cb: (manifest: MediaManifest) => void) {
  manifestListeners.add(cb);
  return () => {
    manifestListeners.delete(cb);
  };
}

export function getMediaManifest(): MediaManifest {
  return cachedMediaManifest;
}

export async function fetchMediaManifest(): Promise<MediaManifest> {
  try {
    const res = await fetch(`/api/media/files?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.team)) {
        cachedMediaManifest = {
          team: data.team || [],
          events: data.events || [],
          projects: data.projects || [],
          logos: data.logos || [],
        };
        manifestListeners.forEach((cb) => cb(cachedMediaManifest));
      }
    }
  } catch {
    // Keep existing manifest
  }
  return cachedMediaManifest;
}

// Background startup initialization
if (typeof window !== 'undefined') {
  fetchMediaManifest();
}

/**
 * Helper to safely parse JSON strings that may contain single quotes or trailing commas
 */
function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text);
  } catch {
    try {
      // Fix single-quoted strings into double-quoted JSON strings
      const cleaned = text
        .replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"')
        .replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(cleaned);
    } catch {
      return fallback;
    }
  }
}

/**
 * Computes image candidate URLs for a team member's portrait.
 * REQUIREMENT: "in team section pfp keep only auto get by id no other method, proper that method"
 *
 * Exclusively retrieves profile pictures by member ID:
 * 1. Matches file stem in /public/team/ directly against member ID (case-insensitive)
 * 2. Generates prospective file extension paths (/team/{id}.webp, .jpg, .png, .jpeg, .svg)
 * 3. Falls back to neutral SVG default placeholder (/team/default-avatar.svg)
 *
 * Absolutely NO name matching, NO role matching, and NO external random stock photos.
 */
export function getTeamMemberImageCandidates(memberOrId?: Partial<TeamMember> | string | null): string[] {
  const candidates: string[] = [];
  const rawId = typeof memberOrId === 'string' ? memberOrId : memberOrId?.id;
  const cleanId = (rawId || '').trim().toLowerCase();

  const knownTeamFiles = cachedMediaManifest.team || [];

  if (cleanId) {
    // 1. Exact ID file verified in /team/ manifest (e.g. /team/ld-3.jpg, /team/tb-1.webp, /team/sb-2.jpg)
    const matchedIdFiles = knownTeamFiles.filter((f) => {
      const stem = f.substring(0, f.lastIndexOf('.')).trim().toLowerCase();
      return stem === cleanId;
    });

    matchedIdFiles.forEach((file) => {
      candidates.push(`/team/${file}`);
    });

    // 2. Prospective ID patterns in /team/ if manifest is still loading or static
    candidates.push(`/team/${cleanId}.webp`);
    candidates.push(`/team/${cleanId}.jpg`);
    candidates.push(`/team/${cleanId}.png`);
    candidates.push(`/team/${cleanId}.jpeg`);
    candidates.push(`/team/${cleanId}.svg`);
  }

  // 3. Fallback placeholder (clean default vector silhouette avatar)
  candidates.push('/team/default-avatar.svg');

  // Deduplicate and filter empty strings
  return Array.from(new Set(candidates.filter(Boolean)));
}

/**
 * Convenience helper to get the primary photo URL for a team member ID.
 */
export function getTeamMemberImageUrl(id: string): string {
  const candidates = getTeamMemberImageCandidates(id);
  return candidates[0] || '/team/default-avatar.svg';
}

/**
 * Computes candidate image URLs for events / fest items
 */
export function getEventImageCandidates(id: string, defaultUrl?: string): string[] {
  const candidates: string[] = [];
  const cleanId = (id || '').trim().toLowerCase();

  const knownEventsFiles = cachedMediaManifest.events || [];

  // Check manifest first
  if (cleanId) {
    const matched = knownEventsFiles.find((f) => {
      const stem = f.substring(0, f.lastIndexOf('.')).toLowerCase();
      return stem === cleanId;
    });
    if (matched) {
      candidates.push(`/events/${matched}`);
    }
  }

  if (defaultUrl) {
    candidates.push(defaultUrl);
  }

  if (cleanId) {
    candidates.push(`/events/${cleanId}.jpg`);
    candidates.push(`/events/${cleanId}.png`);
    candidates.push(`/events/${cleanId}.webp`);
  }

  return Array.from(new Set(candidates.filter(Boolean)));
}

/**
 * Computes candidate image URLs for projects / robots
 */
export function getProjectImageCandidates(id: string, defaultUrl?: string): string[] {
  const candidates: string[] = [];
  const cleanId = (id || '').trim().toLowerCase();

  const knownProjectsFiles = cachedMediaManifest.projects || [];

  // Check manifest first
  if (cleanId) {
    const matched = knownProjectsFiles.find((f) => {
      const stem = f.substring(0, f.lastIndexOf('.')).toLowerCase();
      return stem === cleanId;
    });
    if (matched) {
      candidates.push(`/projects/${matched}`);
    }
  }

  if (defaultUrl) {
    candidates.push(defaultUrl);
  }

  if (cleanId) {
    candidates.push(`/projects/${cleanId}.jpg`);
    candidates.push(`/projects/${cleanId}.png`);
    candidates.push(`/projects/${cleanId}.webp`);
  }

  return Array.from(new Set(candidates.filter(Boolean)));
}

export async function fetchStaticTeamMembers(): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${STATIC_TEAM_JSON_PATH}?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (res.ok) {
      const text = await res.text();
      const data = safeJsonParse<any[]>(text, []);
      if (Array.isArray(data) && data.length > 0) {
        return sanitizeTeamMembersList(data);
      }
    }
  } catch (err) {
    console.warn('Could not fetch static team.json, using bundled defaults:', err);
  }

  return INITIAL_TEAM_MEMBERS;
}

export async function fetchStaticEventsData(): Promise<any | null> {
  try {
    const res = await fetch(`${STATIC_EVENTS_JSON_PATH}?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (res.ok) {
      const text = await res.text();
      return safeJsonParse<any>(text, null);
    }
  } catch {
    // fallback
  }
  return null;
}

export async function fetchStaticProjectsData(): Promise<BotProject[] | null> {
  try {
    const res = await fetch(`${STATIC_PROJECTS_JSON_PATH}?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (res.ok) {
      const text = await res.text();
      const list = safeJsonParse<BotProject[]>(text, []);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch {
    // fallback
  }
  return null;
}

export async function fetchStaticSiteContent(): Promise<any | null> {
  try {
    const res = await fetch(`${STATIC_SITE_CONTENT_PATH}?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (res.ok) {
      const text = await res.text();
      return safeJsonParse<any>(text, null);
    }
  } catch {
    // fallback
  }
  return null;
}

export function sanitizeTeamMembersList(members: any[]): TeamMember[] {
  if (!Array.isArray(members) || members.length === 0) {
    return INITIAL_TEAM_MEMBERS;
  }

  return members.map((m, idx) => ({
    id: m.id || `member-${idx + 1}`,
    category: (m.category || 'student') as 'teacher' | 'student' | 'lead' | 'alumni',
    name: m.name || 'KGEC Member',
    post: m.post || m.role || m.designation || 'Robotics Member',
    departmentOrBatch: m.departmentOrBatch || m.department || m.batch || '',
    avatarUrl: m.avatarUrl || m.image || '',
    email: m.email || '',
    linkedinUrl: m.linkedinUrl || m.linkedin || '',
    scholarUrl: m.scholarUrl || '',
    githubUrl: m.githubUrl || m.github || '',
    bio: m.bio || '',
    order: typeof m.order === 'number' ? m.order : idx + 1,
  }));
}
