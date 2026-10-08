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
 * Computes an ordered list of candidate URLs for a team member's portrait.
 * Optimized for performance:
 * 1. Exact ID file verified in /team/ (e.g. /team/ld-3.jpg, /team/ld-3.png)
 * 2. Explicit avatarUrl (e.g. /team/treasurer.png)
 * 3. Matched dropped local filenames in /public/team/ (e.g. Anirban_Mukherjee.jpg)
 * 4. General ID patterns in /team/
 * 5. High-fidelity default fallback avatar
 */
export function getTeamMemberImageCandidates(member: Partial<TeamMember>): string[] {
  const candidates: string[] = [];
  const id = (member.id || '').trim().toLowerCase();
  const nameNorm = (member.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const roleNorm = (member.post || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const knownTeamFiles = cachedMediaManifest.team || [];

  // 1. Direct ID matches in manifest (Requested: "images are auto get by name of id 'id': 'ld-3'")
  if (id) {
    const matchedIdFile = knownTeamFiles.find((f) => {
      const stem = f.substring(0, f.lastIndexOf('.')).toLowerCase();
      return stem === id;
    });
    if (matchedIdFile) {
      candidates.push(`/team/${matchedIdFile}`);
    }
  }

  // 2. Explicit avatarUrl if set
  if (member.avatarUrl && typeof member.avatarUrl === 'string' && member.avatarUrl.trim()) {
    candidates.push(member.avatarUrl.trim());
  }

  // 3. Known dropped image mappings in /public/team/
  if (nameNorm.includes('sourav') || nameNorm.includes('sourabh') || roleNorm.includes('principal')) {
    candidates.push('/team/dr-sourabh-kumar-das-principal.webp');
  }
  if (nameNorm.includes('anirban') && nameNorm.includes('mukherjee')) {
    candidates.push('/team/Anirban_Mukherjee.jpg');
  }
  if ((nameNorm.includes('tanmay') || nameNorm.includes('tanmoy')) && nameNorm.includes('debnath')) {
    candidates.push('/team/Tanmoy_Debnath.jpg');
  }
  if (roleNorm.includes('treasurer')) {
    candidates.push('/team/treasurer.png');
  }

  // Check if member name has an exact file in the folder (e.g. "Anirban_Mukherjee.jpg")
  if (member.name) {
    const trimmed = member.name.trim();
    const underscore = trimmed.replace(/\s+/g, '_').toLowerCase();
    const dash = trimmed.replace(/\s+/g, '-').toLowerCase();

    const matchedNameFile = knownTeamFiles.find((f) => {
      const stem = f.substring(0, f.lastIndexOf('.')).toLowerCase();
      return stem === underscore || stem === dash || stem === nameNorm;
    });
    if (matchedNameFile) {
      candidates.push(`/team/${matchedNameFile}`);
    }
  }

  // 4. Prospective ID patterns if not matched in manifest
  if (id) {
    candidates.push(`/team/${id}.jpg`);
    candidates.push(`/team/${id}.png`);
    candidates.push(`/team/${id}.webp`);
    candidates.push(`/team/${id}.jpeg`);
  }

  // 5. Default reliable fallback
  const fallback =
    member.category === 'teacher'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      : member.category === 'lead'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80';

  candidates.push(fallback);

  // Return deduplicated list
  return Array.from(new Set(candidates.filter(Boolean)));
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
