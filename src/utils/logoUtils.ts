/**
 * Static Logo Configuration & Format Support
 * Supports SVG, PNG, JPG, JPEG, and WEBP formats directly from `/logos/` folder.
 * 
 * You can place any of the following filenames in `/public/logos/`:
 *   - kgec-logo-light.[png|jpg|jpeg|svg|webp]
 *   - kgec-logo-dark.[png|jpg|jpeg|svg|webp]
 *   - krs-logo-light.[png|jpg|jpeg|svg|webp]
 *   - krs-logo-dark.[png|jpg|jpeg|svg|webp]
 */

export type LogoType = 'kgec' | 'krs';

export const SUPPORTED_EXTENSIONS = ['svg', 'png', 'jpg', 'jpeg', 'webp'] as const;

export function getLogoCandidateUrls(type: LogoType, isDark: boolean): string[] {
  const theme = isDark ? 'dark' : 'light';
  const altTheme = isDark ? 'light' : 'dark';
  const prefix = type === 'kgec' ? 'kgec-logo' : 'krs-logo';
  const shortPrefix = type === 'kgec' ? 'kgec' : 'krs';

  const candidates: string[] = [];

  // 1. Primary requested theme with each supported extension (.svg, .png, .jpg, .jpeg, .webp)
  SUPPORTED_EXTENSIONS.forEach((ext) => {
    candidates.push(`/logos/${prefix}-${theme}.${ext}`);
  });

  // 2. Short prefix format (e.g. /logos/kgec-dark.png, /logos/krs-dark.jpg)
  SUPPORTED_EXTENSIONS.forEach((ext) => {
    candidates.push(`/logos/${shortPrefix}-${theme}.${ext}`);
  });

  // 3. Generic un-themed format (e.g. /logos/kgec-logo.png, /logos/krs-logo.svg)
  SUPPORTED_EXTENSIONS.forEach((ext) => {
    candidates.push(`/logos/${prefix}.${ext}`);
  });

  // 4. Fallback to alternative theme if primary missing
  SUPPORTED_EXTENSIONS.forEach((ext) => {
    candidates.push(`/logos/${prefix}-${altTheme}.${ext}`);
  });

  return candidates;
}

export const STATIC_LOGOS = {
  kgec: {
    dark: '/logos/kgec-logo-dark.svg',
    light: '/logos/kgec-logo-light.svg',
    darkPng: '/logos/kgec-logo-dark.png',
    lightPng: '/logos/kgec-logo-light.png',
    darkJpg: '/logos/kgec-logo-dark.jpg',
    lightJpg: '/logos/kgec-logo-light.jpg',
  },
  krs: {
    dark: '/logos/krs-logo-dark.svg',
    light: '/logos/krs-logo-light.svg',
    darkPng: '/logos/krs-logo-dark.png',
    lightPng: '/logos/krs-logo-light.png',
    darkJpg: '/logos/krs-logo-dark.jpg',
    lightJpg: '/logos/krs-logo-light.jpg',
  },
} as const;

export function getKgecLogoPath(isDark: boolean): string {
  return isDark ? STATIC_LOGOS.kgec.dark : STATIC_LOGOS.kgec.light;
}

export function getKrsLogoPath(isDark: boolean): string {
  return isDark ? STATIC_LOGOS.krs.dark : STATIC_LOGOS.krs.light;
}

export function getMainSocietyLogoPath(isDark: boolean): string {
  return getKrsLogoPath(isDark);
}
