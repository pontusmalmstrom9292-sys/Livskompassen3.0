import type { MabraProjectId } from '../constants/mabraProjects';

const STORAGE_PREFIX = 'livskompassen_mabra_vit_last_';

export function formatVitProjectLastSeen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
}

export function readVitProjectLastSeen(projectId: MabraProjectId): string | null {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${projectId}`);
  } catch {
    return null;
  }
}

export function writeVitProjectLastSeen(projectId: MabraProjectId): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${projectId}`, new Date().toISOString());
  } catch {
    /* ignore quota */
  }
}

export function readAllVitProjectLastSeen(): Partial<Record<MabraProjectId, string>> {
  const out: Partial<Record<MabraProjectId, string>> = {};
  const ids: MabraProjectId[] = ['self_esteem', 'emotional_memory', 'learn_together', 'who_am_i'];
  for (const id of ids) {
    const raw = readVitProjectLastSeen(id);
    if (raw) out[id] = raw;
  }
  return out;
}
