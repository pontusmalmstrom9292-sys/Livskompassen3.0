const DEVICE_KEY = 'barnporten_device_id';
const CHILD_ALIAS_KEY = 'barnporten_child_alias';

export function getOrCreateBarnportenDeviceId(): string {
  if (typeof localStorage === 'undefined') return 'dev_ephemeral';
  const existing = localStorage.getItem(DEVICE_KEY);
  if (existing) return existing;
  const next =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `dev_${crypto.randomUUID()}`
      : `dev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  localStorage.setItem(DEVICE_KEY, next);
  return next;
}

export function readBarnportenChildAlias(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(CHILD_ALIAS_KEY);
}

export function writeBarnportenChildAlias(alias: string): void {
  localStorage.setItem(CHILD_ALIAS_KEY, alias);
}

export function isBarnportenDeviceLinked(): boolean {
  return readBarnportenChildAlias() != null;
}

const FALLBACK_CHILD = 'Kasper';

export function resolveBarnportenChildAlias(): string {
  return readBarnportenChildAlias() ?? FALLBACK_CHILD;
}
