import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { applyTheme, setStoredThemeOverride } from './applyTheme';
import {
  LOCKED_THEME_ID,
  PROD_THEME_REGISTRY,
  THEME_LOCKED,
} from './themeRegistry';
import type { ThemeMode } from './types';

type ThemeContextValue = {
  themeId: string;
  mode: ThemeMode;
  setTheme: (id: string) => void;
  setAutoMode: (auto: boolean) => void;
  themes: typeof PROD_THEME_REGISTRY;
  themeLocked: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function syncLockedTheme(): string {
  if (THEME_LOCKED) {
    setStoredThemeOverride(null);
  }
  applyTheme(LOCKED_THEME_ID);
  return LOCKED_THEME_ID;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState(LOCKED_THEME_ID);
  const [mode] = useState<ThemeMode>('manual');

  useEffect(() => {
    setThemeId(syncLockedTheme());
  }, []);

  const setTheme = useCallback((_id: string) => {
    setThemeId(syncLockedTheme());
  }, []);

  const setAutoMode = useCallback((_auto: boolean) => {
    setThemeId(syncLockedTheme());
  }, []);

  const value = useMemo(
    () => ({
      themeId,
      mode,
      setTheme,
      setAutoMode,
      themes: PROD_THEME_REGISTRY,
      themeLocked: THEME_LOCKED,
    }),
    [themeId, setTheme, setAutoMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
