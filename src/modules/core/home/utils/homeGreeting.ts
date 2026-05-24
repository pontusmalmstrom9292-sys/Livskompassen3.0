import { useStore } from '../../store';

export function getTimeGreeting(date = new Date()): string {
  const h = date.getHours();
  if (h >= 5 && h < 10) return 'God morgon';
  if (h >= 10 && h < 17) return 'God dag';
  if (h >= 17 && h < 22) return 'God kväll';
  return 'God natt';
}

export function getDisplayName(email?: string | null): string {
  if (!email) return 'du';
  const local = email.split('@')[0]?.trim();
  if (!local) return 'du';
  const first = local.split(/[._-]/)[0];
  if (!first) return 'du';
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function useHomeDisplayName(): string {
  const email = useStore((s) => s.user?.email);
  return getDisplayName(email);
}
