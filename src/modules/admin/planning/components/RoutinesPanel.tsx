import { useEffect, useState } from 'react';
import { ChevronDown, Loader2, Route } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  materialEnabled,
  routinesForPreset,
  runRoutine,
  useLifeHubPreset,
  type RoutineTemplate,
} from '../../../core/lifeOs';
import { useStore } from '../../../core/store';

type Props = {
  /** Öppna vid #planering-rutiner (t.ex. från hub-länk). */
  defaultOpen?: boolean;
};

export function RoutinesPanel({ defaultOpen = false }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((s) => s.user);
  const { preset, presetId } = useLifeHubPreset();
  const routines = materialEnabled(preset, 'planering_routines')
    ? routinesForPreset(presetId)
    : [];
  const [open, setOpen] = useState(defaultOpen);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pickedId, setPickedId] = useState('');
  const [lastMsg, setLastMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.hash === '#planering-rutiner') {
      setOpen(true);
      window.requestAnimationFrame(() => {
        document.getElementById('planering-rutiner')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }, [location.hash]);

  useEffect(() => {
    if (routines.length === 0) return;
    setPickedId((prev) => (prev && routines.some((r) => r.id === prev) ? prev : routines[0]!.id));
  }, [routines]);

  if (!materialEnabled(preset, 'planering_routines')) {
    return null;
  }

  if (routines.length === 0) return null;

  const pickedRoutine = routines.find((r) => r.id === pickedId) ?? routines[0];

  const onRun = async (routine: RoutineTemplate) => {
    if (!user) {
      setError('Logga in för att köra rutiner.');
      return;
    }
    setBusyId(routine.id);
    setError(null);
    setLastMsg(null);
    try {
      const result = await runRoutine(user.uid, routine, navigate);
      setLastMsg(
        result.tasksCreated > 0
          ? `${routine.title}: ${result.tasksCreated} uppgift(er) skapad(e).`
          : `${routine.title}: öppnar nästa steg.`,
      );
    } catch {
      setError('Kunde inte köra rutinen. Försök igen.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="routines-panel" aria-label="Snabbstarter">
      <button
        type="button"
        className="routines-panel__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Route className="h-3.5 w-3.5 shrink-0 text-accent/80" strokeWidth={1.75} aria-hidden />
        <span className="routines-panel__toggle-label">Snabbstarter</span>
        <span className="routines-panel__count">{routines.length}</span>
        <ChevronDown
          className={clsx('routines-panel__chevron h-3.5 w-3.5', open && 'routines-panel__chevron--open')}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="routines-panel__body">
          <label className="block text-xs text-text-muted">
            Rutin
            <select
              value={pickedId}
              onChange={(e) => setPickedId(e.target.value)}
              className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
              disabled={busyId !== null}
              aria-label="Välj rutin"
            >
              {routines.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </label>
          {pickedRoutine?.lead ? (
            <p className="mt-2 text-xs text-text-dim">{pickedRoutine.lead}</p>
          ) : null}
          <button
            type="button"
            className="btn-pill--secondary mt-3 w-full text-sm"
            disabled={busyId !== null || !pickedRoutine}
            onClick={() => pickedRoutine && void onRun(pickedRoutine)}
          >
            {busyId ? (
              <>
                <Loader2 className="mr-2 inline h-3 w-3 animate-spin" aria-hidden />
                Kör…
              </>
            ) : (
              'Kör rutin'
            )}
          </button>
          {lastMsg ? <p className="routines-panel__msg routines-panel__msg--ok">{lastMsg}</p> : null}
          {error ? <p className="routines-panel__msg routines-panel__msg--err">{error}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
