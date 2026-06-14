import { BentoCard } from '@/shared/ui/BentoCard';
import { CHILD_PROFILES, type ChildAlias } from '../constants';

type Props = {
  selected: ChildAlias;
  onSelect: (alias: ChildAlias) => void;
};

/** D12 — Arvid / Kasper-profilkort. */
export function ChildProfileCards({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {CHILD_PROFILES.map((profile) => {
        const active = selected === profile.alias;
        return (
          <BentoCard
            key={profile.alias}
            glow="blue"
            className={`!p-4 transition ${active ? 'ring-1 ring-accent/40' : ''}`}
          >
            <button
              type="button"
              onClick={() => onSelect(profile.alias)}
              className="w-full text-left"
              aria-pressed={active}
            >
              <p className="font-display text-lg text-accent">{profile.alias}</p>
              <p className="mt-1 text-xs text-text-muted">{profile.focus}</p>
              <ul className="mt-2 space-y-1">
                {profile.traits.map((trait) => (
                  <li key={trait} className="text-xs text-text-muted">
                    · {trait}
                  </li>
                ))}
              </ul>
            </button>
          </BentoCard>
        );
      })}
    </div>
  );
}
