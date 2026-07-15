import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  parseWidgetDeepLinkPath,
  widgetDeepLinkPathsMatch,
} from './utils/widgetDeepLinkPath';

declare global {
  interface Window {
    __LIVSKOMPASSEN_WIDGET_PENDING__?: string;
  }
  interface WindowEventMap {
    'livskompassen-widget-nav': CustomEvent<{ path: string }>;
    'livskompassen-widget-reactivate': CustomEvent<{ path: string }>;
  }
}

/** Android native widgets → React Router (Capacitor MainActivity). */
export function WidgetDeepLinkBridge() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleWidgetPath = useCallback(
    (path: string | undefined | null): boolean => {
      const parsed = parseWidgetDeepLinkPath(path);
      if (!parsed) return false;

      const current = { pathname: location.pathname, search: location.search };

      if (widgetDeepLinkPathsMatch(current, parsed)) {
        window.dispatchEvent(
          new CustomEvent('livskompassen-widget-reactivate', { detail: { path: path! } }),
        );
        return true;
      }

      navigate({ pathname: parsed.pathname, search: parsed.search });
      return true;
    },
    [location.pathname, location.search, navigate],
  );

  useEffect(() => {
    const pending = window.__LIVSKOMPASSEN_WIDGET_PENDING__;
    if (handleWidgetPath(pending)) {
      delete window.__LIVSKOMPASSEN_WIDGET_PENDING__;
    }

    const handler = (event: CustomEvent<{ path: string }>) => {
      if (handleWidgetPath(event.detail?.path)) {
        delete window.__LIVSKOMPASSEN_WIDGET_PENDING__;
      }
    };

    window.addEventListener('livskompassen-widget-nav', handler as EventListener);
    return () => window.removeEventListener('livskompassen-widget-nav', handler as EventListener);
  }, [handleWidgetPath]);

  return null;
}

export { parseWidgetDeepLinkPath } from './utils/widgetDeepLinkPath';
