import { Droplets, Utensils } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  nutritionDateKey,
  readNutritionDay,
  writeNutritionDay,
  type NutritionDayState,
} from '../lib/mabraNutritionDayStorage';
} from '../lib/mabraNutritionDayStorage';
import { useMabra30Capacity } from '../lib/mabra30Capacity';
import { MabraNutritionCoachPanel } from './MabraNutritionCoachPanel';

const PREP_ITEMS = [
  'Koka ägg eller lägg fram kvarg',
  'Fyll vattenflaska',
  'Lägg fram en frukt eller nötter',
] as const;

const COPY = {
  eyebrow: 'Näring & vätska',
  lead: 'Kognitiv avlastning — ingen kaloriräkning, ingen skuld.',
  water: 'Glas vatten idag',
  protein: 'Protein markerad',
  omega3: 'Omega-3 / fett markerat',
  meal: 'En måltid räknad — symboliskt',
  prepTitle: 'Enkel prepp (valfritt)',
  savedLocal: 'Sparas lokalt på enheten — ingen export till Valv.',
} as const;

type Props = {
  uid?: string;
};

export function MabraNutritionPanel({ uid }: Props) {
  const { capacityLevel } = useMabra30Capacity(uid);
  const dateKey = nutritionDateKey();
  const storageUid = uid ?? 'local';

  const [state, setState] = useState<NutritionDayState>(() =>
    readNutritionDay(storageUid, dateKey),
  );
  const [prepDone, setPrepDone] = useState<Record<string, boolean>>({});

  const persist = useCallback(
    (next: NutritionDayState) => {
      setState(next);
      writeNutritionDay(storageUid, next, dateKey);
    },
    [storageUid, dateKey],
  );

  useEffect(() => {
    setState(readNutritionDay(storageUid, dateKey));
  }, [storageUid, dateKey]);

  const adjustWater = (delta: number) => {
    persist({
      ...state,
      waterGlasses: Math.min(12, Math.max(0, state.waterGlasses + delta)),
    });
  };

  return (
    <BentoCard title={COPY.eyebrow} icon={<Droplets className="h-4 w-4" />} glow="green">
      <p className="mb-4 text-sm text-text-muted">{COPY.lead}</p>

      <div className="rounded-xl border border-border bg-surface-2/80 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-text-dim">{COPY.water}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label="Minska glas vatten"
            className="btn-pill--ghost h-10 w-10 rounded-xl text-lg"
            onClick={() => adjustWater(-1)}
          >
            −
          </button>
          <span className="font-display-serif text-2xl text-accent">{state.waterGlasses}</span>
          <button
            type="button"
            aria-label="Öka glas vatten"
            className="btn-pill--secondary h-10 w-10 rounded-xl text-lg"
            onClick={() => adjustWater(1)}
          >
            +
          </button>
        </div>
      </div>

      {capacityLevel >= 2 ? (
        <div className="mt-3 space-y-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface-2/60 px-4 py-3">
            <input
              type="checkbox"
              checked={state.proteinMarked}
              onChange={(e) => persist({ ...state, proteinMarked: e.target.checked })}
              className="h-4 w-4 accent-success"
            />
            <span className="text-sm text-text-muted">{COPY.protein}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface-2/60 px-4 py-3">
            <input
              type="checkbox"
              checked={state.omega3Marked}
              onChange={(e) => persist({ ...state, omega3Marked: e.target.checked })}
              className="h-4 w-4 accent-success"
            />
            <span className="text-sm text-text-muted">{COPY.omega3}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface-2/60 px-4 py-3">
            <input
              type="checkbox"
              checked={state.mealMarked}
              onChange={(e) => persist({ ...state, mealMarked: e.target.checked })}
              className="h-4 w-4 accent-success"
            />
            <Utensils className="h-4 w-4 text-success" aria-hidden />
            <span className="text-sm text-text-muted">{COPY.meal}</span>
          </label>
        </div>
      ) : null}

      {capacityLevel >= 3 ? (
        <div className="mt-4 rounded-xl border border-border-strong bg-surface/40 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-text-dim">{COPY.prepTitle}</p>
          <ul className="mt-2 space-y-2">
            {PREP_ITEMS.map((item) => (
              <li key={item}>
                <label className="flex cursor-pointer items-start gap-2 text-sm text-text-muted">
                  <input
                    type="checkbox"
                    checked={prepDone[item] === true}
                    onChange={(e) =>
                      setPrepDone((prev) => ({ ...prev, [item]: e.target.checked }))
                    }
                    className="mt-0.5 h-4 w-4 accent-success"
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-4 text-xs text-text-dim">{COPY.savedLocal}</p>

      {capacityLevel >= 2 ? (
        <div className="mt-6 border-t border-border pt-4">
          <MabraNutritionCoachPanel uid={uid} />
        </div>
      ) : null}
    </BentoCard>
  );
}
