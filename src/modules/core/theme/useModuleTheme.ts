import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { resolveThemeForPath } from './moduleThemeMap';

/** Route-aware theme hook — wraps ThemeProvider + moduleThemeMap. */
export function useModuleTheme() {
  const location = useLocation();
  const { themeId, mode, setTheme, setAutoMode, themes } = useTheme();

  const routeThemeId = useMemo(
    () => resolveThemeForPath(location.pathname),
    [location.pathname],
  );

  return {
    themeId,
    routeThemeId,
    mode,
    setTheme,
    setAutoMode,
    themes,
    isRouteDefault: mode === 'auto' && themeId === routeThemeId,
  };
}
