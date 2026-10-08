/**
 * Unified Static Logo Configuration & Helper
 * Unified 2-Logo Architecture for both Light and Dark themes:
 *  - KGEC College Emblem: `kgec-logo.[png|jpg|jpeg|svg|webp]` or `kgec.[png|jpg|jpeg|svg|webp]`
 *  - KRS Society Insignia: `krs-logo.[png|jpg|jpeg|svg|webp]` or `krs.[png|jpg|jpeg|svg|webp]`
 *
 * Any upload or replacement of these 2 files inside `/public/logos/` directly updates
 * the logos across the entire website instantly.
 */

export type LogoType = 'kgec' | 'krs';

export const SUPPORTED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'svg', 'webp'] as const;

export function getLogoCandidateUrls(type: LogoType, _isDark?: boolean): string[] {
  const prefix = type === 'kgec' ? 'kgec-logo' : 'krs-logo';
  const shortPrefix = type === 'kgec' ? 'kgec' : 'krs';

  const candidates: string[] = [];

  // 1. Direct verified files first to eliminate network 404s
  if (type === 'kgec') {
    candidates.push('/logos/kgec-logo.svg');
    candidates.push('/logos/kgec-logo.png');
  } else {
    candidates.push('/logos/krs-logo.png');
    candidates.push('/logos/krs-logo.svg');
  }

  // 2. Unified file names with each extension (png, jpg, jpeg, svg, webp)
  SUPPORTED_EXTENSIONS.forEach((ext) => {
    candidates.push(`/logos/${prefix}.${ext}`);
  });

  // 3. Short prefix unified file names (e.g. /logos/kgec.png, /logos/krs.jpg)
  SUPPORTED_EXTENSIONS.forEach((ext) => {
    candidates.push(`/logos/${shortPrefix}.${ext}`);
  });

  // 4. Fallbacks to theme-specific files if unified file isn't uploaded yet
  SUPPORTED_EXTENSIONS.forEach((ext) => {
    candidates.push(`/logos/${prefix}-dark.${ext}`);
    candidates.push(`/logos/${prefix}-light.${ext}`);
  });

  return Array.from(new Set(candidates));
}

export const STATIC_LOGOS = {
  kgec: {
    unified: '/logos/kgec-logo.svg',
    dark: '/logos/kgec-logo.svg',
    light: '/logos/kgec-logo.svg',
  },
  krs: {
    unified: '/logos/krs-logo.png',
    dark: '/logos/krs-logo.png',
    light: '/logos/krs-logo.png',
  },
} as const;

export function getKgecLogoPath(): string {
  return STATIC_LOGOS.kgec.unified;
}

export function getKrsLogoPath(): string {
  return STATIC_LOGOS.krs.unified;
}

export function getMainSocietyLogoPath(): string {
  return getKrsLogoPath();
}
