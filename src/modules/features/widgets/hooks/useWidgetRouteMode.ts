import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Sätter widget-läge på html/body — döljer app-chrome, dock-känsla. */
export function useWidgetRouteMode() {
  const { pathname } = useLocation();
  const isWidget = pathname.startsWith('/widget');

  useEffect(() => {
    document.documentElement.classList.toggle('widget-route-mode', isWidget);
    document.body.classList.toggle('widget-route-mode', isWidget);
    return () => {
      document.documentElement.classList.remove('widget-route-mode');
      document.body.classList.remove('widget-route-mode');
    };
  }, [isWidget]);

  return isWidget;
}
