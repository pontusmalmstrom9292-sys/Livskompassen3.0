import { useLocation } from 'react-router-dom';

/**
 * Tidigare: dubbel kontextrad + flytande «Nytt projekt» (skapade kaos över Planering).
 * Snabbval ligger i sidomenyn och Planering-hubben — se CHROME-POLICY.md.
 */
export function FyrenSmartWidgetBar() {
  const location = useLocation();
  if (location.pathname.startsWith('/widget')) return null;
  return null;
}
