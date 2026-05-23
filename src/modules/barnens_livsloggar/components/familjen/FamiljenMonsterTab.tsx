import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { CHILD_ALIASES } from '../../constants';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';

type Props = {
  shell: FamiljenShell;
};

function countByCategory(logs: FamiljenShell['logs'], child?: string) {
  const map = new Map<string, number>();
  for (const log of logs) {
    if (log.action !== 'livslogg') continue;
    if (child && log.childAlias !== child) continue;
    const cat = log.category ?? 'vardag';
    map.set(cat, (map.get(cat) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

/** Deterministisk mönsteröversikt — barnsilo + länk till Valv Mönster. */
export function FamiljenMonsterTab({ shell }: Props) {
  const { logs, activeChild } = shell;
  const familyCats = countByCategory(logs);
  const childCats = countByCategory(logs, activeChild);
  const physioCount = logs.filter(
    (l) => l.action === 'fysiologi' && l.childAlias === activeChild,
  ).length;

  return (
    <div className="space-y-4">
      <BentoCard
        title="Mönster i familjen"
        description="Frekvens i livsloggar — ingen LLM, bara räkning"
        icon={<BarChart3 className="h-4 w-4" />}
      >
        <p className="text-xs text-text-dim">
          För SMS, BIFF och juridisk frekvens: använd Valv → Mönster (Pansaret).
        </p>
        <Link
          to="/dagbok?tab=bevis"
          className="mt-2 inline-block text-xs uppercase tracking-widest text-accent hover:underline"
        >
          Öppna Valv → flik Mönster →
        </Link>
      </BentoCard>

      <BentoCard title={`${activeChild} — kategorier`}>
        {childCats.length === 0 ? (
          <p className="text-sm text-text-dim">Inga livsloggar ännu.</p>
        ) : (
          <ul className="space-y-2">
            {childCats.map(([cat, n]) => (
              <li key={cat} className="flex justify-between text-sm">
                <span className="text-text-muted">{cat}</span>
                <span className="font-mono text-accent">{n}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-text-dim">Fysiologi-poster: {physioCount}</p>
      </BentoCard>

      <BentoCard title="Hela familjen">
        <ul className="space-y-2">
          {familyCats.map(([cat, n]) => (
            <li key={cat} className="flex justify-between text-sm">
              <span className="text-text-muted">{cat}</span>
              <span className="font-mono text-text-dim">{n}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-text-dim">
          Per barn:{' '}
          {CHILD_ALIASES.map(
            (c) => `${c} ${logs.filter((l) => l.childAlias === c).length}`,
          ).join(' · ')}
        </p>
      </BentoCard>
    </div>
  );
}
