import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { applyTheme, getStoredThemeOverride, setStoredThemeOverride } from './applyTheme';
import {
  getAutoModuleThemesEnabled,
  resolveThemeForPath,
  setAutoModuleThemesEnabled,
} from './moduleThemeMap';
import { DEFAULT_THEME_ID, THEME_REGISTRY } from './themeRegistry';
import type { ThemeMode } from './types';

type ThemeContextValue = {
  themeId: string;
  mode: ThemeMode;
  setTheme: (id: string) => void;
  setAutoMode: (auto: boolean) => void;
  themes: typeof THEME_REGISTRY;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [mode, setMode] = useState<ThemeMode>(() =>
    getAutoModuleThemesEnabled() ? 'auto' : 'manual',
  );

  const syncTheme = useCallback((pathname: string) => {
    const override = getStoredThemeOverride();
    const auto = getAutoModuleThemesEnabled();
    const next =
      auto && !override ? resolveThemeForPath(pathname) : override ?? resolveThemeForPath(pathname);
    applyTheme(next);
    setThemeId(next);
  }, []);

  useEffect(() => {
    syncTheme(location.pathname);
  }, [location.pathname, syncTheme]);

  const setTheme = useCallback((id: string) => {
    setStoredThemeOverride(id);
    setMode('manual');
    setAutoModuleThemesEnabled(false);
    applyTheme(id);
    setThemeId(id);
  }, []);

  const setAutoMode = useCallback(
    (auto: boolean) => {
      setAutoModuleThemesEnabled(auto);
      setMode(auto ? 'auto' : 'manual');
      if (auto) {
        setStoredThemeOverride(null);
        syncTheme(location.pathname);
      }
    },
    [location.pathname, syncTheme],
  );

  const value = useMemo(
    () => ({ themeId, mode, setTheme, setAutoMode, themes: THEME_REGISTRY }),
    [themeId, mode, setTheme, setAutoMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
