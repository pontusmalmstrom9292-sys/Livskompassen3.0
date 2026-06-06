/** Barn-PWA-rutter — dölj förälder-dock/Fyren (BARNPORTEN-SPEC). */
export function isBarnportenChildRoute(pathname: string): boolean {
  return pathname === '/barnporten' || pathname.startsWith('/barnporten/');
}

/** Rutter som ska använda barnporten-manifest (PWA install). */
export function isBarnportenWebManifestRoute(pathname: string): boolean {
  return (
    isBarnportenChildRoute(pathname) ||
    pathname === '/widget/barnporten' ||
    pathname.startsWith('/widget/barnporten/')
  );
}
