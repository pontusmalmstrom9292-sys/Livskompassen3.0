import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isBarnportenWebManifestRoute } from '../constants/barnportenRoutes';

const DEFAULT_MANIFEST = '/manifest.webmanifest';
const BARNPORTEN_MANIFEST = '/barnporten-manifest.webmanifest';

/** Byt PWA-manifest på barn-rutter så hemskärmsinstall får Barnporten-start_url. */
export function useBarnportenWebManifest(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }

    link.href = isBarnportenWebManifestRoute(pathname) ? BARNPORTEN_MANIFEST : DEFAULT_MANIFEST;

    return () => {
      link!.href = DEFAULT_MANIFEST;
    };
  }, [pathname]);
}
