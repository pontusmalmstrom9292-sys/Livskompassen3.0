import { Download, Loader2, Printer, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listMabraSessionsRecent } from '@/core/firebase/firestore';
import { getVitHub, listVitEntries } from '@/core/firebase/vitHubFirestore';
import type { VitEntryRow } from '@/core/types/firestore';
import type { MabraProjectId } from '@/features/dailyLife/wellbeing/mabra/constants/mabraProjects';
import { MABRA_PROJECTS } from '@/features/dailyLife/wellbeing/mabra/constants/mabraProjects';
import {
  buildVitHubExportReport,
  downloadVitHubReportJson,
  printVitHubReport,
} from '@/features/dailyLife/wellbeing/mabra/lib/exportVitHubReport';
import {
  DEFAULT_VIT_ENTRY_FILTER,
  countByKind,
  discoveryCategoryLabel,
  filterVitEntries,
  parseVitCategoryFilter,
  parseVitKindFilter,
  parseVitProjectFilter,
  type VitEntryFilter,
  type VitKindFilter,
} from '@/features/dailyLife/wellbeing/mabra/lib/filterVitEntries';
import {
  computeVitHubStats,
  vitProjectTitle,
  type VitHubStats,
} from '@/features/dailyLife/wellbeing/mabra/lib/vitHubStats';
import {
  VIT_HUB_KRAVLOST,
  VIT_HUB_STAT_DAYS_HINT,
  VIT_HUB_STAT_DAYS_LABEL,
  VIT_HUB_TAGLINE,
} from '@/features/dailyLife/wellbeing/mabra/lib/vitHubCopy';
import { VIT_VAULT_TAB_LABEL } from '@/core/copy/valvNavCopy';
import { VIT_VAULT_TAB } from '../utils/vaultTabs';
import { VitEntryFilterBar } from './VitEntryFilterBar';
import { VitEntryList } from './VitEntryList';
import { VitRecentOverview } from './VitRecentOverview';
import { VitDevelopmentPanel } from './VitDevelopmentPanel';
import { VitMabraPassPanel } from './VitMabraPassPanel';

export { VAULT_VIT_TAB_LINK, vitHubFilteredLink } from '@/features/dailyLife/wellbeing/mabra/lib/vitHubLinks';

type Props = {
  userId: string;
};

const KIND_FILTER_LABELS = {
  all: 'Alla typer',
  card: 'Frågekort',
  memory: 'Känslominne',
  chat_turn: 'Dialog',
} as const;

function filterLabel(filter: VitEntryFilter): string | undefined {
  const parts: string[] = [];
  if (filter.kind !== 'all') parts.push(KIND_FILTER_LABELS[filter.kind]);
  if (filter.projectId !== 'all') parts.push(vitProjectTitle(filter.projectId));
  if (filter.categoryId !== 'all') parts.push(discoveryCategoryLabel(filter.categoryId));
  return parts.length ? parts.join(' · ') : undefined;
}

/** P2+ Mitt Vit — filter, minneslista, export. */
export function VaultVitHubPanel({ userId }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<VitHubStats | null>(null);
  const [entries, setEntries] = useState<VitEntryRow[]>([]);
  const [filter, setFilter] = useState<VitEntryFilter>(() => ({
    kind: parseVitKindFilter(searchParams.get('vitKind')),
    projectId: parseVitProjectFilter(searchParams.get('vitProject')),
    categoryId: parseVitCategoryFilter(searchParams.get('vitCategory')),
  }));

  const syncFilterToUrl = useCallback(
    (next: VitEntryFilter) => {
      const params = new URLSearchParams(searchParams);
      params.set('vaultTab', VIT_VAULT_TAB);
      if (next.kind === 'all') params.delete('vitKind');
      else params.set('vitKind', next.kind);
      if (next.projectId === 'all') params.delete('vitProject');
      else params.set('vitProject', next.projectId);
      if (next.categoryId === 'all') params.delete('vitCategory');
      else params.set('vitCategory', next.categoryId);
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const applyFilter = useCallback(
    (next: VitEntryFilter) => {
      setFilter(next);
      syncFilterToUrl(next);
    },
    [syncFilterToUrl],
  );

  useEffect(() => {
    setFilter({
      kind: parseVitKindFilter(searchParams.get('vitKind')),
      projectId: parseVitProjectFilter(searchParams.get('vitProject')),
      categoryId: parseVitCategoryFilter(searchParams.get('vitCategory')),
    });
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const [hub, loadedEntries, sessions] = await Promise.all([
          getVitHub(userId),
          listVitEntries(userId, { limit: 50 }),
          listMabraSessionsRecent(userId, 30),
        ]);
        if (cancelled) return;
        setEntries(loadedEntries);
        setStats(
          computeVitHubStats({
            entries: loadedEntries,
            activeProjectIds: hub?.activeProjectIds,
            sessions,
          }),
        );
      } catch {
        if (!cancelled) setError('Kunde inte hämta Vit hub just nu.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const filteredEntries = useMemo(() => filterVitEntries(entries, filter), [entries, filter]);
  const kindCounts = useMemo(() => countByKind(entries), [entries]);
  const activeFilterLabel = filterLabel(filter);

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-text-dim">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Hämtar din Vit hub…
      </p>
    );
  }

  if (error || !stats) {
    return <p className="text-sm text-danger">{error ?? 'Ingen data.'}</p>;
  }

  const mabraHref = '/mabra';
  const exportReport = {
    ...buildVitHubExportReport(filteredEntries, {
      ...stats,
      totalEntries: filteredEntries.length,
      recentEntries: filteredEntries.slice(0, 3),
    }),
    title: activeFilterLabel
      ? `${VIT_VAULT_TAB_LABEL} — ${activeFilterLabel}`
      : `${VIT_VAULT_TAB_LABEL} — personlig export`,
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border-strong border-b-2 border-b-emerald-500/50 bg-surface-2/60 px-4 py-3 shadow-[0_4px_20px_-2px_rgba(16,185,129,0.15)]">
        <p className="flex items-center gap-2 text-sm font-medium text-accent">
          <Sparkles className="h-4 w-4" aria-hidden />
          {VIT_VAULT_TAB_LABEL}
        </p>
        <p className="mt-1 text-xs text-text-dim">{VIT_HUB_TAGLINE}</p>
        <p className="mt-1 text-[10px] text-text-dim">{VIT_HUB_KRAVLOST}</p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Statistik">
        <StatTile label="Sparade svar" value={stats.totalEntries} />
        <StatTile label={VIT_HUB_STAT_DAYS_LABEL} value={stats.activeDays} hint={VIT_HUB_STAT_DAYS_HINT} />
        <StatTile label="MåBra-pass" value={stats.sessionCount} hint="Senaste 30" />
      </section>

      <VitRecentOverview entries={entries} onOpenEntry={applyFilter} />

      <VitDevelopmentPanel stats={stats} />

      <section className="rounded-xl border border-border bg-surface/30 p-4" aria-label="Minneslista">
        <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">Minneslista</h2>
        <VitEntryFilterBar
          filter={filter}
          kindCounts={kindCounts}
          categoryCounts={stats.categoryCounts}
          totalCount={entries.length}
          filteredCount={filteredEntries.length}
          onKindChange={(kind: VitKindFilter) => applyFilter({ ...filter, kind })}
          onProjectChange={(projectId: MabraProjectId | 'all') =>
            applyFilter({ ...filter, projectId })
          }
          onCategoryChange={(categoryId) => applyFilter({ ...filter, categoryId })}
          onReset={() => applyFilter(DEFAULT_VIT_ENTRY_FILTER)}
        />
        {entries.length === 0 ? (
          <p className="mt-2 text-sm text-text-dim">
            Inga sparade svar ännu.{' '}
            <Link to={mabraHref} className="text-accent underline-offset-2 hover:underline">
              Öppna MåBra
            </Link>
          </p>
        ) : (
          <VitEntryList
            entries={filteredEntries}
            emptyMessage="Inget matchar filtret — prova «Alla» eller Rensa filter."
          />
        )}
      </section>

      <section className="rounded-xl border border-border bg-surface/30 p-4" aria-label="Projekt">
        <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">Projekt</h2>
        <ul className="mt-3 space-y-2">
          {MABRA_PROJECTS.map((project) => {
            const count = stats.projectCounts[project.id] ?? 0;
            const active = stats.activeProjectIds.includes(project.id);
            const isFiltered = filter.projectId === project.id;
            return (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() =>
                    applyFilter({
                      ...filter,
                      projectId: isFiltered ? 'all' : project.id,
                    })
                  }
                  className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                    isFiltered
                      ? 'border-accent/40 bg-accent/10 text-accent'
                      : 'border-border-strong/50 text-text hover:border-accent/25'
                  }`}
                >
                  <span>{project.title}</span>
                  <span className="shrink-0 text-xs text-text-dim">
                    {count > 0 ? `${count} svar` : active ? 'Påbörjat' : '—'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <Link to={mabraHref} className="btn-pill--ghost mt-3 inline-flex text-xs">
          Fortsätt i MåBra
        </Link>
      </section>

      <VitMabraPassPanel stats={stats} />

      <section className="rounded-xl border border-border bg-surface/30 p-4" aria-label="Export">
        <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">Export</h2>
        <p className="mt-2 text-xs text-text-dim">
          Till dig själv — inte dossier eller bevis mot ex.
          {activeFilterLabel ? ` Exporterar filter: ${activeFilterLabel}.` : null}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => printVitHubReport(exportReport)}
            className="btn-pill--accent inline-flex items-center gap-2 text-xs"
            disabled={filteredEntries.length === 0}
          >
            <Printer className="h-3.5 w-3.5" aria-hidden />
            Skriv ut / PDF
          </button>
          <button
            type="button"
            onClick={() => downloadVitHubReportJson(exportReport)}
            className="btn-pill--ghost inline-flex items-center gap-2 text-xs"
            disabled={filteredEntries.length === 0}
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Ladda ner JSON
          </button>
        </div>
      </section>
    </div>
  );
}

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border-strong bg-surface-2/50 px-3 py-3 text-center">
      <p className="text-2xl font-medium tabular-nums text-accent">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-text-dim">{label}</p>
      {hint ? <p className="mt-1 text-[10px] text-text-dim">{hint}</p> : null}
    </div>
  );
}
