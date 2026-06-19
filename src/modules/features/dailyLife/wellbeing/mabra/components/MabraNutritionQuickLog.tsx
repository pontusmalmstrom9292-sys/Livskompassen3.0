import { Coffee, Utensils } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
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

type Props = {
  storageUid: string;
  onLogged?: () => void;
};

const QUALITY_OPTIONS: { value: NutritionQuality; label: string }[] = [
  { value: 'good', label: NUTRITION_QUALITY_LABELS.good },
  { value: 'ok', label: NUTRITION_QUALITY_LABELS.ok },
  { value: 'poor', label: NUTRITION_QUALITY_LABELS.poor },
];

export function MabraNutritionQuickLog({ storageUid, onLogged }: Props) {
  const [kind, setKind] = useState<NutritionIntakeKind>('food');
  const [note, setNote] = useState('');
  const [quality, setQuality] = useState<NutritionQuality>('ok');
  const [savedFlash, setSavedFlash] = useState(false);

  const todayCount = entriesForDate(readNutritionEntries(storageUid), nutritionDateKey()).length;

  const handleSave = () => {
    appendNutritionEntry(storageUid, { kind, note, quality });
    setNote('');
    setQuality('ok');
    setSavedFlash(true);
    onLogged?.();
    window.setTimeout(() => setSavedFlash(false), 1800);
  };

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-text-dim">Snabb logg</p>
        <span className="text-xs text-text-dim">{todayCount} idag</span>
      </div>
      <p className="mt-1 text-xs text-text-dim">Vad åt eller drack du? Ingen kaloriräkning.</p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setKind('food')}
          className={clsx(
            'btn-pill--ghost flex flex-1 items-center justify-center gap-1.5 text-xs',
            kind === 'food' && 'border-success/40 bg-success/10 text-success',
          )}
        >
          <Utensils className="h-3.5 w-3.5" aria-hidden />
          Mat
        </button>
        <button
          type="button"
          onClick={() => setKind('drink')}
          className={clsx(
            'btn-pill--ghost flex flex-1 items-center justify-center gap-1.5 text-xs',
            kind === 'drink' && 'border-accent-secondary/40 bg-accent-secondary/10 text-accent-light',
          )}
        >
          <Coffee className="h-3.5 w-3.5" aria-hidden />
          Dryck
        </button>
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
              'rounded-xl border px-3 py-1.5 text-xs transition-colors',
              quality === opt.value
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border bg-surface/40 text-text-muted hover:border-border-strong',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="btn-pill--secondary mt-3 w-full text-sm"
      >
        {savedFlash ? 'Sparat ✓' : 'Spara intag'}
      </button>
    </div>
  );
}
