import { memo, useEffect, useRef, type Ref } from 'react';
import { FileDown, Loader2, Lock } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import './valv.css';
import { EmptyState } from '@/core/ui/EmptyState';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { useVaultStore } from '@/core/store/useVaultStore';
import type { VaultLog, WeaverTags } from '@/core/types/firestore';
import {
  VAVAREN_LOG_CATEGORY_LABEL,
  VAVAREN_LOG_DISCLAIMER,
} from '../constants/vavarenCopy';
import { exportVaultRecordAsPdf } from '../utils/exportVaultRecord';
import { normalizeStringArray } from '../utils/normalizeVaultLog';
import { scanTechniquesForLog, logHasTechnique } from '../utils/vaultPatternScan';
import { highlightPatterns } from '../utils/vaultPatternHighlight';

type VaultLogRow = VaultLog & { id: string; weaverTags?: WeaverTags };

function resolveLogTechniques(
  log: VaultLogRow,
  persistedTechniquesByLogId?: ReadonlyMap<string, readonly string[]>,
): string[] {
  const persisted = persistedTechniquesByLogId?.get(log.id);
  if (persisted && persisted.length > 0) return [...persisted];
  return scanTechniquesForLog(log);
}

function isVavarenMetadata(log: VaultLog): boolean {
  return log.category === 'vävaren_metadata';
}

type VaultLogListProps = {
  highlightLogId?: string | null;
  /** Tom lista — scroll till Samla-formuläret ovan. */
  onLogFirstBevis?: () => void;
  /** V2 — visa endast Sanningens Ankare (`pinned`). */
  anchorsOnly?: boolean;
  /** Sidecar-taktik från pattern_scan_metadata (prioriteras framför live-regex). */
  persistedTechniquesByLogId?: ReadonlyMap<string, readonly string[]>;
  /** Filtrera arkiv efter taktik (från Mönster drill-down). */
  techniqueFilter?: string | null;
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

const LogRow = memo(function LogRow({
  log,
  highlightLogId,
  highlightRef,
  persistedTechniquesByLogId,
}: {
  log: VaultLogRow;
  highlightLogId?: string | null;
  highlightRef: Ref<HTMLLIElement>;
  persistedTechniquesByLogId?: ReadonlyMap<string, readonly string[]>;
}) {
  const vavaren = isVavarenMetadata(log);
  const weaverTags = (log as VaultLogRow).weaverTags;
  const tags = vavaren ? [] : resolveLogTechniques(log, persistedTechniquesByLogId);
  
  return (
    <li
      key={log.id}
      ref={log.id === highlightLogId ? highlightRef : undefined}
      className={`valv-log-row ${
        log.pinned ? 'valv-log-row--anchor' : ''
      } ${log.id === highlightLogId ? 'valv-log-row--highlight' : ''} ${
        vavaren ? 'valv-log-row--vavaren' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="valv-log-stamp mb-1">
            <Lock className="text-indigo-400/60" size={12} />
            <p>SERVER-TIDSSTÄMPEL · {formatServerTimestamp(log.createdAt)}</p>
          </div>
          <p className="valv-log-meta font-mono">ID · {log.id.slice(0, 12)}…</p>
          <p className="valv-log-meta mt-1">
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
          className="ds-btn ds-btn--ghost shrink-0 py-1 px-2"
          title="Exportera som PDF (utskrift)"
        >
          <FileDown className="h-3 w-3" /> PDF
        </button>
      </div>
      <p className={`mt-2 whitespace-pre-wrap ${vavaren ? 'text-indigo-100/90' : 'text-text-muted'}`}>
        {vavaren
          ? formatLogBody(log)
          : highlightPatterns(formatLogBody(log)).map((span, i) =>
              span.className ? (
                <span
                  key={i}
                  className={span.className}
                  title={span.category}
                >
                  {span.text}
                </span>
              ) : (
                span.text
              ),
            )}
      </p>
      {vavaren && weaverTags && (
        <div className="mt-3 flex flex-wrap gap-1">
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
              className="rounded-full border border-border px-2 py-0.5 text-[10px] text-text-muted"
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
        <div className="mt-3 flex flex-wrap gap-1">
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
          className="mt-3 inline-block text-xs text-accent-secondary hover:underline"
        >
          Visa bifogat bevis
        </a>
      )}
    </li>
  );
});

export const VaultLogList = memo(function VaultLogList({
  highlightLogId,
  onLogFirstBevis,
  anchorsOnly = false,
  persistedTechniquesByLogId,
  techniqueFilter = null,
}: VaultLogListProps) {
  const { logs, loading, hasMore, loadingMore, loadMoreLogs } = useVaultStore();
  const highlightRef = useRef<HTMLLIElement>(null);
  let visible = anchorsOnly ? logs.filter((l) => l.pinned) : logs;
  if (techniqueFilter) {
    visible = visible.filter((log) =>
      logHasTechnique(log, techniqueFilter, persistedTechniquesByLogId),
    );
  }
  const pinned = visible.filter((l) => l.pinned);
  const rest = anchorsOnly ? [] : visible.filter((l) => !l.pinned);

  useEffect(() => {
    if (!highlightLogId) return;
    const timer = window.setTimeout(() => {
      highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [highlightLogId, logs.length]);

  return (
    <BentoCard
      title="Bevisarkiv"
      glow="blue"
      depth
      noHover
      className="mt-4"
    >
      {onLogFirstBevis && (
        <div className="mb-3 flex justify-end">
          <button type="button" onClick={onLogFirstBevis} className="ds-btn ds-btn--secondary text-sm">
            Logga bevis
          </button>
        </div>
      )}
      {loading && visible.length === 0 ? (
        <HubPanelSkeleton label="Laddar bevisarkiv…" lines={4} />
      ) : visible.length === 0 ? (
        <EmptyState
          message={
            techniqueFilter
              ? `Inga poster med #${techniqueFilter} i arkivet.`
              : anchorsOnly
                ? 'Inga ankare markerade ännu. Kryssa i «Sanningens Ankare» när du loggar bevis.'
                : 'Inga poster i arkivet ännu. Öppna «Manuell post» ovan eller tryck «Logga bevis».'
          }
        />
      ) : (
        <div className="space-y-4">
          {pinned.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-accent/80">
                <Lock size={10} className="text-accent/60" /> Sanningens Ankare
              </p>
              <ul className="valv-log-list">
                {pinned.map((log) => (
                  <LogRow
                    key={log.id}
                    log={log}
                    highlightLogId={highlightLogId}
                    highlightRef={highlightRef}
                    persistedTechniquesByLogId={persistedTechniquesByLogId}
                  />
                ))}
              </ul>
            </div>
          )}
          <ul className="valv-log-list">
          {rest.map((log) => (
            <LogRow
              key={log.id}
              log={log}
              highlightLogId={highlightLogId}
              highlightRef={highlightRef}
              persistedTechniquesByLogId={persistedTechniquesByLogId}
            />
          ))}
        </ul>
          {hasMore && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  const uid = logs[0]?.ownerId;
                  if (uid) {
                    void loadMoreLogs(uid);
                  }
                }}
                disabled={loadingMore}
                className="ds-btn ds-btn--ghost text-sm"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
                    Laddar fler…
                  </>
                ) : (
                  'Visa fler'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </BentoCard>
  );
});
