import { create } from 'zustand';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

const THEME_STORAGE_KEY = 'kgec_rs_theme_v1';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {}
  return 'light';
};

const applyThemeToDocument = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  isDark: getInitialTheme() === 'dark',

  toggleTheme: () => {
    const current = get().theme;
    const next: Theme = current === 'light' ? 'dark' : 'light';
    applyThemeToDocument(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
    set({ theme: next, isDark: next === 'dark' });
  },

  setTheme: (newTheme: Theme) => {
    applyThemeToDocument(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {}
    set({ theme: newTheme, isDark: newTheme === 'dark' });
  },

  initTheme: () => {
    const current = get().theme;
    applyThemeToDocument(current);
  },
}));

// Apply theme immediately upon import
if (typeof window !== 'undefined') {
  applyThemeToDocument(getInitialTheme());
}
