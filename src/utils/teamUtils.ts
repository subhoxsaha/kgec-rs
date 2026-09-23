import { TeamMember } from '../types';
import { INITIAL_TEAM_MEMBERS } from '../data/teamData';

/**
 * Static Team Data Fetcher & Utilities
 * Fetches structured team and mentor data directly from `/data/team.json`.
 * Photos can be placed directly in `/public/team/` (e.g. `/team/name.jpg`).
 */

export const STATIC_TEAM_JSON_PATH = '/data/team.json';

export async function fetchStaticTeamMembers(): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${STATIC_TEAM_JSON_PATH}?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return sanitizeTeamMembersList(data);
      }
    }
  } catch (err) {
    console.warn('Could not fetch static team.json, using bundled defaults:', err);
  }

  return INITIAL_TEAM_MEMBERS;
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
    avatarUrl:
      m.avatarUrl ||
      m.image ||
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80`,
    email: m.email || '',
    linkedinUrl: m.linkedinUrl || m.linkedin || '',
    scholarUrl: m.scholarUrl || '',
    githubUrl: m.githubUrl || m.github || '',
    bio: m.bio || '',
    order: typeof m.order === 'number' ? m.order : idx + 1,
  }));
}
