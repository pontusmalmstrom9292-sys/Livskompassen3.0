import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface WindowEventMap {
    'livskompassen-widget-nav': CustomEvent<{ path: string }>;
  }
}

/** Android native widgets → React Router (Capacitor MainActivity). */
export function WidgetDeepLinkBridge() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event: CustomEvent<{ path: string }>) => {
      const path = event.detail?.path;
      if (!path || !path.startsWith('/')) return;
      const [pathname, search = ''] = path.split('?');
      navigate({ pathname, search: search ? `?${search}` : '' });
    };

    window.addEventListener('livskompassen-widget-nav', handler as EventListener);
    return () => window.removeEventListener('livskompassen-widget-nav', handler as EventListener);
  }, [navigate]);

  return null;
}
