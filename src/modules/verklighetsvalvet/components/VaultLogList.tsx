import { FileDown, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { EmptyState } from '../../core/ui/EmptyState';
import type { VaultLog } from '../../core/types/firestore';
import { exportVaultRecordAsPdf } from '../utils/exportVaultRecord';

type VaultLogListProps = {
  logs: (VaultLog & { id: string })[];
  loading: boolean;
};

function formatLogBody(log: VaultLog): string {
  if (log.entryType === 'two_column' && (log.theirVersion || log.myReality)) {
    return `Hens: ${log.theirVersion ?? '—'}\nMin: ${log.myReality ?? '—'}`;
  }
  if (log.entryType === 'three_shield') {
    return [log.shieldWhat, log.shieldFeeling, log.shieldBoundary].filter(Boolean).join(' · ');
  }
  if (log.entryType === 'body_signal' && log.bodySignals?.length) {
    return `${log.bodySignals.join(', ')}${log.truth ? ` — ${log.truth}` : ''}`;
  }
  return log.truth ?? '';
}

function formatLogDate(createdAt: VaultLog['createdAt'] | undefined): string {
  if (typeof createdAt === 'string') return createdAt.slice(0, 10);
  if (createdAt == null) return '—';
  return String(createdAt).slice(0, 10);
}

export function VaultLogList({ logs, loading }: VaultLogListProps) {
  return (
    <BentoCard title="VaultLog">
      {loading && logs.length === 0 ? (
        <p className="text-sm text-text-dim flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar...
        </p>
      ) : logs.length === 0 ? (
        <EmptyState message="Inga poster ännu." />
      ) : (
        <ul className="space-y-3">
          {logs.map((log) => (
            <li key={log.id} className="glass-card p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] uppercase tracking-widest text-text-dim">
                  {log.category ?? 'allmänt'}
                  {log.entryType ? ` · ${log.entryType}` : ''} · {formatLogDate(log.createdAt)}
                </p>
                <button
                  type="button"
                  onClick={() => exportVaultRecordAsPdf(log)}
                  className="btn-pill--ghost shrink-0 py-1 px-2"
                  title="Exportera som PDF (utskrift)"
                >
                  <FileDown className="h-3 w-3" /> PDF
                </button>
              </div>
              <p className="mt-1 text-text-muted whitespace-pre-wrap">{formatLogBody(log)}</p>
              {log.evidenceUrl && (
                <a
                  href={log.evidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-accent-secondary hover:underline"
                >
                  Visa bifogat bevis
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </BentoCard>
  );
}
