import { useState } from 'react';
import { Calendar } from 'lucide-react';
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

/**
 * Enkel prompt när födelsedatum saknas — aktiverar åldersbracket för Barnfokus.
 */
export function ChildBirthDatePrompt({ userId, childAlias, onSaved }: Props) {
  const [birthDate, setBirthDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const evolutionDoc = useEvolutionStore((s) => s.doc);

  const aliasKey = childAlias.toLowerCase() as 'kasper' | 'arvid';

  const handleSave = async () => {
    if (!birthDate) {
      setError('Välj ett datum.');
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
      onSaved?.();
    } catch {
      setError('Kunde inte spara. Försök igen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 space-y-3">
      <p className="flex items-center gap-2 text-sm text-text-muted">
        <Calendar className="h-4 w-4 text-accent" aria-hidden />
        Födelsedatum för {childAlias} — så anpassas frågorna efter ålder.
      </p>
      <label className="block text-xs text-text-dim">
        Födelsedatum
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
        />
      </label>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
      <Button variant="secondary" size="sm" disabled={saving} onClick={() => void handleSave()}>
        {saving ? 'Sparar…' : 'Spara ålder'}
      </Button>
      <p className="text-[10px] text-text-dim">Endast för dig — används till Barnfokus och Barnporten.</p>
    </div>
  );
}
