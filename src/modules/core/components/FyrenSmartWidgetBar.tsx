import { useLocation } from 'react-router-dom';

/**
 * Tidigare: dubbel kontextrad ovanför dock (samma knappar som DockHubBand).
 * Snabbval («Mer») ligger i sidomenyn — se DrawerQuickActions.
 * Komponenten finns kvar för smoke/layout-koppling; renderar inget UI.
 */
export function FyrenSmartWidgetBar() {
  const location = useLocation();
  if (location.pathname.startsWith('/widget')) return null;
  return null;
}
