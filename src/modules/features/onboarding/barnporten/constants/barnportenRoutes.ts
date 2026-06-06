/** Barn-PWA-rutter — dölj förälder-dock/Fyren (BARNPORTEN-SPEC). */
export function isBarnportenChildRoute(pathname: string): boolean {
  return pathname === '/barnporten' || pathname.startsWith('/barnporten/');
}
