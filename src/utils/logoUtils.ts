/**
 * Static Logo Configuration & Helper
 * Logos are loaded directly from the public `/logos/` folder.
 * Replacing or uploading files with these standard names in `/public/logos/`
 * immediately updates the logos across the entire website without any DB queries.
 *
 * Supported standard filenames in `/public/logos/`:
 *  - kgec-logo-dark.svg  (or .png, .webp, .jpg)
 *  - kgec-logo-light.svg (or .png, .webp, .jpg)
 *  - krs-logo-dark.svg   (or .png, .webp, .jpg)
 *  - krs-logo-light.svg  (or .png, .webp, .jpg)
 */

export const STATIC_LOGOS = {
  kgec: {
    dark: '/logos/kgec-logo-dark.svg',
    light: '/logos/kgec-logo-light.svg',
    fallbackDark: '/logos/kgec-logo-dark.png',
    fallbackLight: '/logos/kgec-logo-light.png',
  },
  krs: {
    dark: '/logos/krs-logo-dark.svg',
    light: '/logos/krs-logo-light.svg',
    fallbackDark: '/logos/krs-logo-dark.png',
    fallbackLight: '/logos/krs-logo-light.png',
  },
} as const;

/**
 * Get the static path for KGEC Emblem based on active theme
 */
export function getKgecLogoPath(isDark: boolean): string {
  return isDark ? STATIC_LOGOS.kgec.dark : STATIC_LOGOS.kgec.light;
}

/**
 * Get the static path for KRS Society Logo based on active theme
 */
export function getKrsLogoPath(isDark: boolean): string {
  return isDark ? STATIC_LOGOS.krs.dark : STATIC_LOGOS.krs.light;
}

/**
 * Primary Society Logo for footer/navbar
 */
export function getMainSocietyLogoPath(isDark: boolean): string {
  return getKrsLogoPath(isDark);
}
