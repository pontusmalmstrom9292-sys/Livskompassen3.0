import { Wind } from 'lucide-react';
import { Button } from '@/design-system';
import type { BarnfokusBracket } from '@/features/family/children/constants';

type MoodOption = { id: string; label: string; emoji: string };

const TODDLER_MOODS: MoodOption[] = [
  { id: 'glad', label: 'Glad', emoji: '🙂' },
  { id: 'ledsen', label: 'Ledsen', emoji: '😢' },
  { id: 'arg', label: 'Arg', emoji: '😠' },
  { id: 'trött', label: 'Trött', emoji: '😴' },
  { id: 'orolig', label: 'Orolig', emoji: '😟' },
];

type Props = {
  bracket: BarnfokusBracket | undefined;
  childAlias: string;
  disabled?: boolean;
  onMood: (observation: string) => void;
  onBreathing: () => void;
};

/**
 * Våg 29.2 — ålderssegmenterade verktyg (toddler_preschool).
 * Barnporten visar enklare UI; äldre bracket använder standardknappar.
 */
export function BarnportenBracketPanel({
  bracket,
  childAlias,
  disabled,
  onMood,
  onBreathing,
}: Props) {
  if (bracket !== 'toddler_preschool') return null;

  return (
    <div className="mt-4 rounded-2xl border border-border bg-surface-2/80 p-4">
      <p className="text-xs uppercase tracking-widest text-accent/80">
        Småbarnsläge — {childAlias}
      </p>
      <p className="mt-1 text-sm text-text-muted">Peka på humör eller ta en kort andningspaus.</p>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {TODDLER_MOODS.map((mood) => (
          <button
            key={mood.id}
            type="button"
            disabled={disabled}
            className="elongated-module flex min-h-11 flex-col items-center gap-1 p-3 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            onClick={() => onMood(`Humör: ${mood.label}`)}
          >
            <span className="text-2xl" aria-hidden>
              {mood.emoji}
            </span>
            <span className="text-[10px] text-text-muted">{mood.label}</span>
          </button>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        disabled={disabled}
        className="mt-4 flex w-full items-center justify-center gap-2 text-sm"
        onClick={onBreathing}
      >
        <Wind className="h-4 w-4" aria-hidden />
        Andas lugnt (3 andetag)
      </Button>
    </div>
  );
}
