import type { VitEntryRow } from '@/core/types/firestore';
import type { MabraProjectId } from '@/features/dailyLife/wellbeing/mabra/constants/mabraProjects';
import type { VitEntryFilter } from '@/features/dailyLife/wellbeing/mabra/lib/filterVitEntries';
import { VIT_HUB_KRAVLOST } from '@/features/dailyLife/wellbeing/mabra/lib/vitHubCopy';
import { VitEntryList } from './VitEntryList';
import { EmptyState } from '@/core/ui/EmptyState';

type Props = {
  entries: VitEntryRow[];
  onOpenEntry: (filter: VitEntryFilter) => void;
};

/** P4 översikt — senaste 3 poster, ingen streak. */
export function VitRecentOverview({ entries, onOpenEntry }: Props) {
  const recent = entries.slice(0, 3);

  if (recent.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-surface/30 p-4" aria-label="Senaste">
        <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">Senaste</h2>
        <EmptyState
          className="mt-2 !border-0 !bg-transparent !p-0 !shadow-none"
          message="Inget sparat ännu — börja i MåBra när du vill."
        />
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-surface/30 p-4" aria-label="Senaste">
      <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">Senaste</h2>
      <p className="mt-1 text-[10px] text-text-dim">{VIT_HUB_KRAVLOST}</p>
      <VitEntryList entries={recent} emptyMessage="" maxHeightClass="max-h-none" />
      <ul className="mt-2 flex flex-wrap gap-2">
        {recent.map((entry) => (
          <li key={`jump-${entry.id}`}>
            <button
              type="button"
              onClick={() =>
                onOpenEntry({
                  kind: entry.kind,
                  projectId: entry.projectId as MabraProjectId,
                  categoryId: 'all',
                })
              }
              className="rounded-full border border-border-strong px-3 py-1 text-[10px] text-text-dim transition hover:border-accent/30 hover:text-accent"
            >
              Visa i listan
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
