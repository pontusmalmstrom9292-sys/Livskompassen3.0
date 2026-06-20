import { Droplets, Utensils, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  nutritionDateKey,
  readNutritionDay,
  writeNutritionDay,
  type NutritionDayState,
} from '../lib/mabraNutritionDayStorage';
import {
  getMabraNutritionDay,
  saveMabraNutritionDay,
} from '../api/mabraNutritionLogService';
import { readNutritionEntries } from '../lib/mabraNutritionIntakeStorage';
import { readNutritionPrefs } from '../lib/mabraNutritionPrefs';
import {
  computeNutritionNudges,
  dismissNutritionNudge,
} from '../lib/mabraNutritionNudges';
import { useMabra30Capacity } from '../lib/mabra30Capacity';
import { MabraNutritionCoachPanel } from './MabraNutritionCoachPanel';
import { MabraNutritionQuickLog } from './MabraNutritionQuickLog';
import { MabraNutritionTrendPanel } from './MabraNutritionTrendPanel';
import { MabraNutritionRhythmPanel, MabraNutritionTodayList } from './MabraNutritionRhythmPanel';
import { MabraNutritionMacroPanel } from './MabraNutritionMacroPanel';

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
  savedCloud: 'Synkas till ditt konto — ingen export till Valv.',
  saveError: 'Kunde inte spara — du kan fortsätta lokalt.',
} as const;

type Props = {
  uid?: string;
};

export function MabraNutritionPanel({ uid }: Props) {
  const { capacityLevel } = useMabra30Capacity(uid);
  const dateKey = nutritionDateKey();
  const storageUid = uid ?? 'local';
  const useCloud = Boolean(uid);

  const [state, setState] = useState<NutritionDayState>(() =>
    readNutritionDay(storageUid, dateKey),
  );
  const [prepDone, setPrepDone] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(useCloud);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [intakeVersion, setIntakeVersion] = useState(0);
  const pendingRef = useRef<NutritionDayState | null>(null);

  const prefs = useMemo(() => readNutritionPrefs(storageUid), [storageUid, intakeVersion]);
  const nudges = useMemo(
    () =>
      computeNutritionNudges(
        storageUid,
        readNutritionEntries(storageUid),
        state,
        prefs,
      ),
    [storageUid, state, prefs, intakeVersion],
  );

  useEffect(() => {
    if (!uid) {
      setState(readNutritionDay(storageUid, dateKey));
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const row = await getMabraNutritionDay(uid, dateKey);
        if (cancelled) return;
        if (row) {
          setState(row);
        } else {
          setState(readNutritionDay(storageUid, dateKey));
        }
        setSaveError(null);
      } catch {
        if (!cancelled) {
          setState(readNutritionDay(storageUid, dateKey));
          setSaveError(COPY.saveError);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid, storageUid, dateKey]);

  const persist = useCallback(
    (next: NutritionDayState) => {
      setState(next);
      if (!uid) {
        writeNutritionDay(storageUid, next, dateKey);
        return;
      }
      pendingRef.current = next;
      void saveMabraNutritionDay(uid, dateKey, next).catch(() => {
        setSaveError(COPY.saveError);
        writeNutritionDay(storageUid, next, dateKey);
      });
    },
    [uid, storageUid, dateKey],
  );

  const adjustWater = (delta: number) => {
    persist({
      ...state,
      waterGlasses: Math.min(12, Math.max(0, state.waterGlasses + delta)),
    });
  };

  return (
    <BentoCard title={COPY.eyebrow} icon={<Droplets className="h-4 w-4" />} glow="green">
      <p className="mb-4 text-sm text-text-muted">{COPY.lead}</p>

      {nudges.length > 0 ? (
        <ul className="mb-4 space-y-2">
          {nudges.map((nudge) => (
            <li
              key={nudge.id}
              className="flex items-start gap-2 rounded-xl border border-border bg-surface-2/60 px-3 py-2"
            >
              <p className="flex-1 text-sm leading-relaxed text-text-muted">{nudge.message}</p>
              <button
                type="button"
                aria-label="Stäng påminnelse"
                className="btn-pill--ghost h-8 w-8 shrink-0 rounded-lg p-0"
                onClick={() => {
                  dismissNutritionNudge(storageUid, nudge.id);
                  setIntakeVersion((v) => v + 1);
                }}
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <MabraNutritionQuickLog
        storageUid={storageUid}
        macroTracking={prefs.macroTracking}
        onLogged={() => setIntakeVersion((v) => v + 1)}
      />

      <MabraNutritionTodayList storageUid={storageUid} refreshKey={intakeVersion} />

      {loading ? (
        <p className="mt-4 text-sm text-text-dim">Laddar dagens notering…</p>
      ) : (
        <>
          <div className="mt-4 rounded-xl border border-border bg-surface-2/80 px-4 py-3">
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
        </>
      )}

      {prefs.trendView ? <MabraNutritionTrendPanel storageUid={storageUid} /> : null}

      {prefs.detailedAnalysis ? <MabraNutritionRhythmPanel storageUid={storageUid} /> : null}

      {prefs.macroTracking ? (
        <MabraNutritionMacroPanel storageUid={storageUid} refreshKey={intakeVersion} />
      ) : null}

      {saveError ? <p className="mt-2 text-xs text-text-dim">{saveError}</p> : null}
      <p className="mt-4 text-xs text-text-dim">
        Intagslogg sparas lokalt. {useCloud ? COPY.savedCloud : COPY.savedLocal}
      </p>

      {capacityLevel >= 2 ? (
        <div className="mt-6 border-t border-border pt-4">
          <MabraNutritionCoachPanel uid={uid} />
        </div>
      ) : null}
    </BentoCard>
  );
}
