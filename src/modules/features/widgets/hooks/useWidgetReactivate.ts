import { useEffect } from 'react';

declare global {
  interface WindowEventMap {
    'livskompassen-widget-reactivate': CustomEvent<{ path: string }>;
  }
}

/** Native widget tap on an already-open route — re-run autostart/stamp without reload. */
export function useWidgetReactivate(onReactivate: (path: string) => void): void {
  useEffect(() => {
    const handler = (event: CustomEvent<{ path: string }>) => {
      const path = event.detail?.path;
      if (path) onReactivate(path);
    };
    window.addEventListener('livskompassen-widget-reactivate', handler as EventListener);
    return () =>
      window.removeEventListener('livskompassen-widget-reactivate', handler as EventListener);
  }, [onReactivate]);
}
