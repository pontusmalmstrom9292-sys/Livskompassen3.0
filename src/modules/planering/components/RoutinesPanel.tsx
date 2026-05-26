import { useState } from 'react';
import { Loader2, Route } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  materialEnabled,
  routinesForPreset,
  runRoutine,
  useLifeHubPreset,
  type RoutineTemplate,
} from '../../core/lifeOs';
import { useStore } from '../../core/store';

export function RoutinesPanel() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const { preset, presetId } = useLifeHubPreset();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [lastMsg, setLastMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!materialEnabled(preset, 'planering_routines')) {
    return null;
  }

  const routines = routinesForPreset(presetId);
  if (routines.length === 0) return null;

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
    <section className="routines-panel elongated-module border-white/10 p-4" aria-label="Rutiner">
      <div className="mb-3 flex items-center gap-2">
        <Route className="h-4 w-4 text-gold" strokeWidth={1.5} />
        <h2 className="text-sm font-medium text-accent">Rutiner</h2>
      </div>
      <p className="mb-3 text-xs text-text-muted">
        Ett tryck — uppgift i Handling och rätt sida öppnas. Kopplat till din hub.
      </p>
      <ul className="space-y-2">
        {routines.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              className="w-full rounded-xl border border-white/10 px-3 py-2.5 text-left transition-colors hover:border-accent/30 disabled:opacity-60"
              style={{ background: 'rgba(15, 23, 42, 0.5)' }}
              disabled={busyId !== null}
              onClick={() => onRun(r)}
            >
              <span className="block text-sm font-medium text-text">{r.title}</span>
              <span className="mt-0.5 block text-[11px] text-text-muted">{r.lead}</span>
              {busyId === r.id && (
                <span className="mt-2 flex items-center gap-1 text-xs text-text-dim">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Kör…
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {lastMsg && <p className="mt-2 text-xs text-accent">{lastMsg}</p>}
      {error && <p className="mt-2 text-xs text-rose-300/90">{error}</p>}
    </section>
  );
}
