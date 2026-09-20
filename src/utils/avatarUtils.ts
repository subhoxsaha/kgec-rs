import { UserRole, UserStatus, ROLE_CONFIG } from '../types';

/**
 * Returns a guaranteed email-based or Google profile avatar URL.
 * Falls back to an email-encoded UI Avatar if no Google picture is present.
 */
export function getUserAvatarUrl(user?: { picture?: string; email?: string; name?: string } | null): string {
  if (user?.picture && user.picture.trim().length > 0 && !user.picture.includes('photo-1534528741775')) {
    return user.picture;
  }
  const identifier = user?.email || user?.name || 'Member';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(identifier)}&background=0D9488&color=ffffff&bold=true&size=128`;
}

/**
 * Returns the formatted role label.
 * If status is 'pending', appends or returns Pending Approval status.
 */
export function getUserRoleDisplayLabel(role?: UserRole | string, status?: UserStatus | string): string {
  const roleKey = (role || 'guest') as UserRole;
  const cfg = ROLE_CONFIG[roleKey] || ROLE_CONFIG.guest;
  
  if (status === 'pending') {
    return `⏳ Pending (${cfg.label})`;
  }
  return cfg.label;
}
