import { useEffect, useRef, type RefObject } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { EmptyState } from '../../../core/ui/EmptyState';
import type { VaultLog } from '../../../core/types/firestore';
import { exportVaultRecordAsPdf } from '../utils/exportVaultRecord';
import { scanTechniquesForLog } from '../utils/vaultPatternScan';

type VaultLogListProps = {
  logs: (VaultLog & { id: string })[];
  loading: boolean;
  highlightLogId?: string | null;
};

function asText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return String(value);
}

function formatLogBody(log: VaultLog): string {
  if (log.entryType === 'two_column' && (log.theirVersion || log.myReality)) {
    return `Hens: ${asText(log.theirVersion) || '—'}\nMin: ${asText(log.myReality) || '—'}`;
  }
  if (log.entryType === 'three_shield') {
    return [log.shieldWhat, log.shieldFeeling, log.shieldBoundary]
      .map(asText)
      .filter(Boolean)
      .join(' · ');
  }
  if (log.entryType === 'body_signal' && log.bodySignals?.length) {
    const truth = asText(log.truth);
    return `${log.bodySignals.join(', ')}${truth ? ` — ${truth}` : ''}`;
  }
  return asText(log.truth);
}

function formatLogDate(createdAt: VaultLog['createdAt'] | undefined): string {
  if (typeof createdAt === 'string') return createdAt.slice(0, 10);
  if (createdAt == null) return '—';
  return String(createdAt).slice(0, 10);
}

function formatServerTimestamp(createdAt: VaultLog['createdAt'] | undefined): string {
  if (typeof createdAt === 'string') return createdAt;
  if (createdAt == null) return '—';
  return String(createdAt);
}

function LogRow({
  log,
  highlightLogId,
  highlightRef,
}: {
  log: VaultLog & { id: string };
  highlightLogId?: string | null;
  highlightRef: RefObject<HTMLLIElement | null>;
}) {
  const tags = scanTechniquesForLog(log);
  return (
    <li
      key={log.id}
      ref={log.id === highlightLogId ? highlightRef : undefined}
      className={`glass-card p-3 text-sm ${
        log.id === highlightLogId ? 'ring-2 ring-accent/50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-text-dim">
            SERVER-TIDSSTÄMPEL · {formatServerTimestamp(log.createdAt)}
          </p>
          <p className="text-[10px] text-text-dim">ID · {log.id.slice(0, 12)}…</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-text-dim">
            {log.pinned ? 'Ankare · ' : ''}
            {log.category ?? 'allmänt'}
            {log.entryType ? ` · ${log.entryType}` : ''} · {formatLogDate(log.createdAt)}
          </p>
        </div>
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
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-accent/20 px-2 py-0.5 text-[10px] text-accent/80"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
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
    <BentoCard title="VaultLog">
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
