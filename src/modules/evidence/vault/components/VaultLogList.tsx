import { useEffect, useRef, type RefObject } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { EmptyState } from '../../../core/ui/EmptyState';
import type { VaultLog, WeaverTags } from '../../../core/types/firestore';
import {
  VAVAREN_LOG_CATEGORY_LABEL,
  VAVAREN_LOG_DISCLAIMER,
} from '../constants/vavarenCopy';
import { exportVaultRecordAsPdf } from '../utils/exportVaultRecord';
import { normalizeStringArray } from '../utils/normalizeVaultLog';
import { scanTechniquesForLog } from '../utils/vaultPatternScan';

type VaultLogRow = VaultLog & { id: string; weaverTags?: WeaverTags };

function isVavarenMetadata(log: VaultLog): boolean {
  return log.category === 'vävaren_metadata';
}

type VaultLogListProps = {
  logs: (VaultLog & { id: string })[];
  loading: boolean;
  highlightLogId?: string | null;
  /** Tom lista — scroll till Samla-formuläret ovan. */
  onLogFirstBevis?: () => void;
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
  if (log.entryType === 'body_signal') {
    const signals = normalizeStringArray(log.bodySignals);
    if (signals.length > 0) {
      const truth = asText(log.truth);
      return `${signals.join(', ')}${truth ? ` — ${truth}` : ''}`;
    }
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
  log: VaultLogRow;
  highlightLogId?: string | null;
  highlightRef: RefObject<HTMLLIElement | null>;
}) {
  const vavaren = isVavarenMetadata(log);
  const weaverTags = (log as VaultLogRow).weaverTags;
  const tags = vavaren ? [] : scanTechniquesForLog(log);
  return (
    <li
      key={log.id}
      ref={log.id === highlightLogId ? highlightRef : undefined}
      className={`glass-card p-3 text-sm ${
        log.id === highlightLogId ? 'ring-2 ring-accent/50' : ''
      } ${vavaren ? 'border border-indigo-400/20 bg-indigo-500/5' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-text-dim">
            SERVER-TIDSSTÄMPEL · {formatServerTimestamp(log.createdAt)}
          </p>
          <p className="text-[10px] text-text-dim">ID · {log.id.slice(0, 12)}…</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-text-dim">
            {log.pinned ? 'Ankare · ' : ''}
            {vavaren ? VAVAREN_LOG_CATEGORY_LABEL : (log.category ?? 'allmänt')}
            {!vavaren && log.entryType ? ` · ${log.entryType}` : ''} · {formatLogDate(log.createdAt)}
          </p>
          {vavaren && (
            <p className="mt-1 text-[10px] text-indigo-200/80">{VAVAREN_LOG_DISCLAIMER}</p>
          )}
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
      <p className={`mt-1 whitespace-pre-wrap ${vavaren ? 'text-indigo-100/90' : 'text-text-muted'}`}>
        {formatLogBody(log)}
      </p>
      {vavaren && weaverTags && (
        <div className="mt-2 flex flex-wrap gap-1">
          {normalizeStringArray(weaverTags.emotions).map((e) => (
            <span
              key={`e-${e}`}
              className="rounded-full border border-indigo-400/25 px-2 py-0.5 text-[10px] text-indigo-200/90"
            >
              {e}
            </span>
          ))}
          {normalizeStringArray(weaverTags.actors).map((a) => (
            <span
              key={`a-${a}`}
              className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-text-muted"
            >
              {a}
            </span>
          ))}
          {weaverTags.threatLevel && weaverTags.threatLevel !== 'none' && (
            <span className="rounded-full border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-200/90">
              hot: {weaverTags.threatLevel}
            </span>
          )}
        </div>
      )}
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

export function VaultLogList({ logs, loading, highlightLogId, onLogFirstBevis }: VaultLogListProps) {
  const highlightRef = useRef<HTMLLIElement | null>(null);
  const pinned = logs.filter((l) => l.pinned);
  const rest = logs.filter((l) => !l.pinned);

  useEffect(() => {
    if (highlightLogId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightLogId, logs.length]);

  return (
    <BentoCard title="Bevisarkiv">
      {onLogFirstBevis && (
        <div className="mb-3 flex justify-end">
          <button type="button" onClick={onLogFirstBevis} className="btn-pill--secondary text-sm">
            Logga bevis
          </button>
        </div>
      )}
      {loading && logs.length === 0 ? (
        <p className="text-sm text-text-dim flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar...
        </p>
      ) : logs.length === 0 ? (
        <EmptyState message="Inga poster i arkivet ännu. Tryck «Logga bevis» ovan i panelen — formuläret ligger precis ovanför." />
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
