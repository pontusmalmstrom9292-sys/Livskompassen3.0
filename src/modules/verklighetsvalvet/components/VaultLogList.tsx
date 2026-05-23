import { useEffect, useRef, type RefObject } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { EmptyState } from '../../core/ui/EmptyState';
import type { VaultLog } from '../../core/types/firestore';
import { exportVaultRecordAsPdf } from '../utils/exportVaultRecord';
import { formatVaultLogBody, formatVaultLogDate } from '../utils/formatVaultLogBody';

type VaultLogListProps = {
  logs: (VaultLog & { id: string })[];
  loading: boolean;
  highlightLogId?: string | null;
};

function LogRow({
  log,
  highlightLogId,
  highlightRef,
}: {
  log: VaultLog & { id: string };
  highlightLogId?: string | null;
  highlightRef: RefObject<HTMLLIElement | null>;
}) {
  return (
    <li
      key={log.id}
      ref={log.id === highlightLogId ? highlightRef : undefined}
      className={`glass-card p-3 text-sm ${
        log.id === highlightLogId ? 'ring-2 ring-accent/50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-text-dim">
          {log.pinned && <span className="badge-worm">Ankare</span>}
          <span className="badge-locked">WORM</span>
          <span>
            {log.category ?? 'allmänt'}
            {log.entryType ? ` · ${log.entryType}` : ''} · {formatVaultLogDate(log.createdAt)}
          </span>
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
      <p className="mt-1 text-text-muted whitespace-pre-wrap">{formatVaultLogBody(log)}</p>
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
  );
}

export function VaultLogList({ logs, loading, highlightLogId }: VaultLogListProps) {
  const highlightRef = useRef<HTMLLIElement | null>(null);
  const pinned = logs.filter((l) => l.pinned);
  const rest = logs.filter((l) => !l.pinned);

  useEffect(() => {
    if (highlightLogId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightLogId, logs.length]);

  return (
    <BentoCard title="Säkrade poster" description="Append-only WORM — Sanningens Ankare överst">
      {loading && logs.length === 0 ? (
        <p className="text-sm text-text-dim flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar...
        </p>
      ) : logs.length === 0 ? (
        <EmptyState message="Inga poster ännu." />
      ) : (
        <div className="space-y-4">
          {pinned.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-gold/80">
                Sanningens Ankare
              </p>
              <ul className="space-y-3">
                {pinned.map((log) => (
                  <LogRow key={log.id} log={log} highlightLogId={highlightLogId} highlightRef={highlightRef} />
                ))}
              </ul>
            </div>
          )}
          <ul className="space-y-3">
          {rest.map((log) => (
            <LogRow key={log.id} log={log} highlightLogId={highlightLogId} highlightRef={highlightRef} />
          ))}
        </ul>
        </div>
      )}
    </BentoCard>
  );
}
