import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    __LIVSKOMPASSEN_WIDGET_PENDING__?: string;
  }
  interface WindowEventMap {
    'livskompassen-widget-nav': CustomEvent<{ path: string }>;
  }
}

function navigateWidgetPath(
  navigate: ReturnType<typeof useNavigate>,
  path: string | undefined | null,
): boolean {
  if (!path || !path.startsWith('/')) return false;
  const [pathname, search = ''] = path.split('?');
  navigate({ pathname, search: search ? `?${search}` : '' });
  return true;
}

/** Android native widgets → React Router (Capacitor MainActivity). */
export function WidgetDeepLinkBridge() {
  const navigate = useNavigate();

  useEffect(() => {
    const pending = window.__LIVSKOMPASSEN_WIDGET_PENDING__;
    if (navigateWidgetPath(navigate, pending)) {
      delete window.__LIVSKOMPASSEN_WIDGET_PENDING__;
    }

    const handler = (event: CustomEvent<{ path: string }>) => {
      if (navigateWidgetPath(navigate, event.detail?.path)) {
        delete window.__LIVSKOMPASSEN_WIDGET_PENDING__;
      }
    };

    window.addEventListener('livskompassen-widget-nav', handler as EventListener);
    return () => window.removeEventListener('livskompassen-widget-nav', handler as EventListener);
  }, [navigate]);

  return null;
}
