import { Coffee, Utensils } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { Button } from '@/design-system';
import {
  appendNutritionEntry,
  entriesForDate,
  readNutritionEntries,
} from '../lib/mabraNutritionIntakeStorage';
import {
  NUTRITION_QUALITY_LABELS,
  type NutritionIntakeKind,
  type NutritionQuality,
} from '../lib/mabraNutritionIntakeTypes';
import { nutritionDateKey } from '../lib/mabraNutritionDayStorage';
import { sanitizeMacroGrams } from '../lib/mabraNutritionMacroTotals';

type Props = {
  storageUid: string;
  macroTracking?: boolean;
  onLogged?: () => void;
};

const QUALITY_OPTIONS: { value: NutritionQuality; label: string }[] = [
  { value: 'good', label: NUTRITION_QUALITY_LABELS.good },
  { value: 'ok', label: NUTRITION_QUALITY_LABELS.ok },
  { value: 'poor', label: NUTRITION_QUALITY_LABELS.poor },
];

export function MabraNutritionQuickLog({ storageUid, macroTracking = false, onLogged }: Props) {
  const [kind, setKind] = useState<NutritionIntakeKind>('food');
  const [note, setNote] = useState('');
  const [quality, setQuality] = useState<NutritionQuality>('ok');
  const [proteinG, setProteinG] = useState('');
  const [fatG, setFatG] = useState('');
  const [carbsG, setCarbsG] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  const showMacroFields = macroTracking && kind === 'food';

  const todayCount = entriesForDate(readNutritionEntries(storageUid), nutritionDateKey()).length;

  const handleSave = () => {
    appendNutritionEntry(storageUid, {
      kind,
      note,
      quality,
      macros: showMacroFields
        ? {
            proteinG: sanitizeMacroGrams(proteinG),
            fatG: sanitizeMacroGrams(fatG),
            carbsG: sanitizeMacroGrams(carbsG),
          }
        : undefined,
    });
    setNote('');
    setQuality('ok');
    setProteinG('');
    setFatG('');
    setCarbsG('');
    setSavedFlash(true);
    onLogged?.();
    window.setTimeout(() => setSavedFlash(false), 1800);
  };

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Snabb logg</p>
        <span className="text-xs text-text-muted">{todayCount} idag</span>
      </div>
      <p className="mt-1 text-xs text-text-muted">Vad åt eller drack du? Ingen kaloriräkning.</p>

      <div className="mt-3 flex gap-2">
        <Button
          variant="ghost"
          className={clsx(
            'flex min-h-11 flex-1 items-center justify-center gap-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
            kind === 'food' && 'border-success/40 bg-success/10 text-success',
          )}
          onClick={() => setKind('food')}
        >
          <Utensils className="h-3.5 w-3.5" aria-hidden />
          Mat
        </Button>
        <Button
          variant="ghost"
          className={clsx(
            'flex min-h-11 flex-1 items-center justify-center gap-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
            kind === 'drink' && 'border-accent-secondary/40 bg-accent-secondary/10 text-accent-light',
          )}
          onClick={() => setKind('drink')}
        >
          <Coffee className="h-3.5 w-3.5" aria-hidden />
          Dryck
        </Button>
      </div>

      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value.slice(0, 120))}
        placeholder={kind === 'drink' ? 'T.ex. kaffe, vatten, läsk' : 'T.ex. macka, soppa, godis'}
        className="input-glass mt-3 text-sm"
        aria-label="Kort notering om intag"
      />

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Hur kändes det för kroppen">
        {QUALITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setQuality(opt.value)}
            className={clsx(
              'inline-flex min-h-11 items-center rounded-xl border px-3 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
              quality === opt.value
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border bg-surface/40 text-text-muted hover:border-border-strong',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {showMacroFields ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <label className="block text-xs text-text-muted">
            P (g)
            <input
              type="number"
              min={0}
              max={500}
              inputMode="numeric"
              value={proteinG}
              onChange={(e) => setProteinG(e.target.value.slice(0, 3))}
              placeholder="—"
              className="input-glass mt-1 text-sm tabular-nums"
            />
          </label>
          <label className="block text-xs text-text-muted">
            F (g)
            <input
              type="number"
              min={0}
              max={500}
              inputMode="numeric"
              value={fatG}
              onChange={(e) => setFatG(e.target.value.slice(0, 3))}
              placeholder="—"
              className="input-glass mt-1 text-sm tabular-nums"
            />
          </label>
          <label className="block text-xs text-text-muted">
            K (g)
            <input
              type="number"
              min={0}
              max={500}
              inputMode="numeric"
              value={carbsG}
              onChange={(e) => setCarbsG(e.target.value.slice(0, 3))}
              placeholder="—"
              className="input-glass mt-1 text-sm tabular-nums"
            />
          </label>
        </div>
      ) : null}

      <Button
        variant="secondary"
        className="mt-3 min-h-11 w-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        onClick={handleSave}
      >
        {savedFlash ? 'Sparat ✓' : 'Spara intag'}
      </Button>
    </div>
  );
}
