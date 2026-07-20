/**
 * 7-dagars tematik från sparade incidenter (children_logs truth [incident_meta]).
 */
import type { ChildrenLogEntry } from '../types';

const META_RE = /\[incident_meta\]\s*tags=([^\s]+)/i;

export function extractIncidentTagIds(truth: string | undefined): string[] {
  if (!truth) return [];
  const m = truth.match(META_RE);
  if (!m?.[1] || m[1] === 'none') return [];
  return m[1].split(',').map((t) => t.trim()).filter(Boolean);
}

export function recentIncidentThemeTagIds(
  logs: ChildrenLogEntry[],
  childAlias: string,
  windowDays = 7,
): string[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const counts = new Map<string, number>();
  for (const log of logs) {
    if (log.childAlias !== childAlias) continue;
    if (log.category !== 'incident' && log.action !== 'incident_analys') continue;
    const day = (log.createdAt ?? '').slice(0, 10);
    if (day && day < cutoffStr) continue;
    for (const id of extractIncidentTagIds(log.truth)) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)
    .slice(0, 5);
}

export function countRecentIncidents(
  logs: ChildrenLogEntry[],
  childAlias: string,
  windowDays = 7,
): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return logs.filter((log) => {
    if (log.childAlias !== childAlias) return false;
    if (log.category !== 'incident' && log.action !== 'incident_analys') return false;
    const day = (log.createdAt ?? '').slice(0, 10);
    return !day || day >= cutoffStr;
  }).length;
}
