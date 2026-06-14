import { clsx } from 'clsx';
import type { VitEntryKind } from '@/core/types/firestore';
import { MABRA_PROJECTS, type MabraProjectId } from '@/features/dailyLife/wellbeing/mabra/constants/mabraProjects';
import {
  DISCOVERY_BENTO_CATALOG,
  type DiscoveryCategoryId,
} from '@/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog';
import type { VitEntryFilter, VitKindFilter } from '@/features/dailyLife/wellbeing/mabra/lib/filterVitEntries';

const KIND_OPTIONS: { id: VitKindFilter; label: string }[] = [
  { id: 'all', label: 'Alla' },
  { id: 'card', label: 'Frågekort' },
  { id: 'memory', label: 'Känslominne' },
  { id: 'chat_turn', label: 'Dialog' },
];

type Props = {
  filter: VitEntryFilter;
  kindCounts: Record<VitEntryKind, number>;
  categoryCounts: Partial<Record<DiscoveryCategoryId, number>>;
  totalCount: number;
  filteredCount: number;
  onKindChange: (kind: VitKindFilter) => void;
  onProjectChange: (projectId: MabraProjectId | 'all') => void;
  onCategoryChange: (categoryId: DiscoveryCategoryId | 'all') => void;
  onReset: () => void;
};

export function VitEntryFilterBar({
  filter,
  kindCounts,
  categoryCounts,
  totalCount,
  filteredCount,
  onKindChange,
  onProjectChange,
  onCategoryChange,
  onReset,
}: Props) {
  const hasActiveFilter =
    filter.kind !== 'all' || filter.projectId !== 'all' || filter.categoryId !== 'all';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrera typ">
        {KIND_OPTIONS.map((option) => {
          const count =
            option.id === 'all'
              ? totalCount
              : kindCounts[option.id as VitEntryKind] ?? 0;
          const active = filter.kind === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onKindChange(option.id)}
              className={clsx(
                'rounded-full border px-3 py-1 text-xs transition',
                active
                  ? 'border-accent/45 bg-accent/10 text-accent'
                  : 'border-border-strong text-text-dim hover:border-accent/25',
              )}
              aria-pressed={active}
            >
              {option.label}
              <span className="ml-1 tabular-nums opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <label className="block text-xs text-text-muted">
        Projekt
        <select
          className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
          value={filter.projectId}
          onChange={(e) => onProjectChange(e.target.value as MabraProjectId | 'all')}
          aria-label="Filtrera projekt"
        >
          <option value="all">Alla projekt ({totalCount})</option>
          {MABRA_PROJECTS.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs text-text-muted">
        Kompass-deck
        <select
          className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
          value={filter.categoryId}
          onChange={(e) => onCategoryChange(e.target.value as DiscoveryCategoryId | 'all')}
          aria-label="Filtrera kompass-kategori"
        >
          <option value="all">Alla kategorier</option>
          {DISCOVERY_BENTO_CATALOG.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label_sv} ({categoryCounts[cat.id] ?? 0})
            </option>
          ))}
        </select>
      </label>

      <p className="text-[10px] uppercase tracking-wider text-text-dim">
        Visar {filteredCount} av {totalCount}
        {hasActiveFilter ? (
          <>
            {' '}
            ·{' '}
            <button type="button" onClick={onReset} className="text-accent underline-offset-2 hover:underline">
              Rensa filter
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}
