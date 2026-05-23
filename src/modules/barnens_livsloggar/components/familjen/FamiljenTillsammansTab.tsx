import { Anchor, Users } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { CHILD_ALIASES } from '../../constants';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';

type Props = {
  shell: FamiljenShell;
};

/** Familjeöversikt — stunder tillsammans, delad vecka. */
export function FamiljenTillsammansTab({ shell }: Props) {
  const { familyWeekStats, logs } = shell;
  const latestBarnfokus = logs.find(
    (l) => l.action === 'livslogg' && (l.category === 'barnfokus' || l.category === 'middag'),
  );
  const anchorText = latestBarnfokus?.observation?.replace(/^\[[\w_]+\]\s*/, '').slice(0, 120);

  return (
    <div className="space-y-4">
      <BentoCard
        title="Dagens ankare"
        description="Senaste positiva minnet i familjen"
        icon={<Anchor className="h-4 w-4" />}
      >
        {anchorText ? (
          <p className="text-sm leading-relaxed text-text-muted">&ldquo;{anchorText}&rdquo;</p>
        ) : (
          <p className="text-sm text-text-dim">
            Inga ankare ännu. Spara ett barnfokus-svar under Reflektion — det blir familjens
            minnesankare.
          </p>
        )}
      </BentoCard>

      <BentoCard
        title="Familjeöversikt"
        description="Små steg. Stora minnen. Tillsammans."
        icon={<Users className="h-4 w-4" />}
      >
        <p className="text-sm text-text-muted">
          {familyWeekStats.total === 0
            ? 'Inga stunder loggade denna vecka ännu.'
            : `${familyWeekStats.total} stunder tillsammans denna vecka`}
        </p>
        <div className="mt-4 flex items-end justify-between gap-1 px-1">
          {familyWeekStats.byDay.map((count, i) => {
            const max = Math.max(1, ...familyWeekStats.byDay);
            const h = Math.round((count / max) * 72) || 4;
            return (
              <div key={familyWeekStats.labels[i]} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full max-w-[2rem] rounded-t-md bg-accent/70"
                  style={{ height: `${h}px` }}
                  title={`${count} stunder`}
                />
                <span className="text-[10px] text-text-dim">{familyWeekStats.labels[i]}</span>
              </div>
            );
          })}
        </div>
        <ul className="mt-4 space-y-2 border-t border-border-subtle pt-3">
          {CHILD_ALIASES.map((name) => {
            const count = logs.filter(
              (l) =>
                l.childAlias === name &&
                l.action === 'livslogg' &&
                Date.now() - Date.parse(l.createdAt ?? '') < 7 * 86_400_000,
            ).length;
            return (
              <li key={name} className="flex justify-between text-sm">
                <span className="text-text-muted">{name}</span>
                <span className="text-text-dim">{count} stunder · 7 d</span>
              </li>
            );
          })}
        </ul>
      </BentoCard>
    </div>
  );
}
