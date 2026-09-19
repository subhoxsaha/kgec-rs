import React from 'react';
import { useThemeStore, Theme } from '../store/useThemeStore';

export type { Theme };

export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useTheme = (): ThemeContextType => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };
};
