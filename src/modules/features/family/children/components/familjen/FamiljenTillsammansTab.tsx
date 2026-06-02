import { Anchor, Heart, MessageCircle, Users } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { FamiljenFeatureCard } from './FamiljenFeatureCard';
import { CHILD_ALIASES } from '../../constants';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';
import { barnfokusDisplayText } from '../../utils/logFieldUtils';

type Props = {
  shell: FamiljenShell;
};

/** Familjeöversikt — stunder tillsammans, delad vecka. */
export function FamiljenTillsammansTab({ shell }: Props) {
  const { familyWeekStats, logs } = shell;
  const latestBarnfokus = logs.find(
    (l) => l.action === 'livslogg' && (l.category === 'barnfokus' || l.category === 'middag'),
  );
  const anchorText = latestBarnfokus
    ? barnfokusDisplayText(latestBarnfokus.observation ?? latestBarnfokus.truth, 120)
    : '';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FamiljenFeatureCard
          title="Tid tillsammans"
          description="Kvalitetstid utan skärmar — små ritualer som barnen minns."
          icon={<Heart className="h-4 w-4" strokeWidth={1.5} />}
          to="/familj?tab=reflektion"
        />
        <FamiljenFeatureCard
          title="Samtal och lyssnande"
          description="Trygga samtal där barnen får forma sin egen berättelse."
          icon={<MessageCircle className="h-4 w-4" strokeWidth={1.5} />}
          to="/familj?tab=reflektion"
        />
        <FamiljenFeatureCard
          title="Stöd och närvaro"
          description="Närvaro före råd — du behöver inte fixa allt direkt."
          icon={<Users className="h-4 w-4" strokeWidth={1.5} />}
          to="/familj?tab=livslogg"
        />
      </div>

      <div className="familjen-anchor-card glass-card">
        <div className="mb-2 flex items-center gap-2">
          <Anchor className="h-4 w-4 text-accent" />
          <p className="text-[10px] uppercase tracking-widest text-accent/90">Dagens ankare</p>
        </div>
        {anchorText ? (
          <p className="text-sm leading-relaxed text-text-muted">&ldquo;{anchorText}&rdquo;</p>
        ) : (
          <p className="text-sm text-text-dim">
            Inga ankare ännu. Spara ett barnfokus-svar under Reflektion — det blir familjens
            minnesankare.
          </p>
        )}
      </div>

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
                  className="familjen-week-bar w-full max-w-[2rem]"
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
