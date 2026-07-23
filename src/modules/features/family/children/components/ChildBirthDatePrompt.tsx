import { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import { Button } from '@/design-system';
import { mergeEvolutionHub } from '@/core/firebase/evolutionLedgerFirestore';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import type { ChildAgeState, EvolutionHubDoc } from '@/core/types/firestore';
import {
  ageYearsFromBirthDate,
  bracketFromBirthDate,
} from '../../../../../../shared/evolution/childAgeBracket';

type Props = {
  userId: string;
  childAlias: string;
  onSaved?: () => void;
};

const todayIso = (): string => new Date().toISOString().slice(0, 10);

/**
 * Enkel prompt när födelsedatum saknas — aktiverar åldersbracket för Barnfokus.
 */
export function ChildBirthDatePrompt({ userId, childAlias, onSaved }: Props) {
  const [birthDate, setBirthDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const evolutionDoc = useEvolutionStore((s) => s.doc);

  const aliasKey = childAlias.toLowerCase() as 'kasper' | 'arvid';
  const inputId = `child-birthdate-${aliasKey}`;

  const handleSave = async () => {
    if (!birthDate) {
      setError('Välj ett datum.');
      return;
    }
    if (birthDate > todayIso()) {
      setError('Datum kan inte ligga i framtiden.');
      return;
    }
    const bracket = bracketFromBirthDate(birthDate);
    const ageYears = ageYearsFromBirthDate(birthDate);
    if (!bracket || ageYears === null) {
      setError('Ogiltigt datum.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const prevChildren: Partial<EvolutionHubDoc['childrenAgeState']> =
        evolutionDoc?.childrenAgeState ?? {};
      const prevChild: Partial<ChildAgeState> = prevChildren[aliasKey] ?? {};
      await mergeEvolutionHub(userId, {
        childrenAgeState: {
          ...prevChildren,
          [aliasKey]: {
            ...prevChild,
            birthDate,
            currentBracket: bracket,
            ageYears,
            barnportenLevel: prevChild?.barnportenLevel ?? 1,
            lastUpdated: new Date().toISOString(),
          },
        },
      });
      setSaved(true);
      onSaved?.();
    } catch {
      setError('Kunde inte spara. Försök igen.');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div
        className="rounded-2xl border border-success/25 bg-success/5 p-4"
        role="status"
        aria-live="polite"
      >
        <p className="flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          Ålder sparad — frågorna anpassas efter {childAlias}s bracket.
        </p>
      </div>
    );
  }

  return (
    <section
      className="rounded-2xl border border-accent/20 bg-accent/5 p-4 space-y-3"
      aria-labelledby={`${inputId}-label`}
    >
      <p id={`${inputId}-label`} className="flex items-center gap-2 text-sm text-text-muted">
        <Calendar className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        Födelsedatum för {childAlias} — så anpassas frågorna efter ålder.
      </p>
      <label className="block text-xs text-text-muted" htmlFor={inputId}>
        Födelsedatum
        <input
          id={inputId}
          type="date"
          max={todayIso()}
          value={birthDate}
          onChange={(e) => {
            setBirthDate(e.target.value);
            setError(null);
          }}
          className="input-glass mt-1 min-h-[44px] w-full rounded-xl px-3 py-2 text-sm"
        />
      </label>
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        variant="secondary"
        size="sm"
        disabled={saving}
        onClick={() => void handleSave()}
        className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        {saving ? 'Sparar…' : 'Spara ålder'}
      </Button>
      <p className="text-[10px] text-text-muted">Endast för dig — används till Barnfokus och Barnporten.</p>
    </section>
  );
}
