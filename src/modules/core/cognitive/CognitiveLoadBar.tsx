import { clsx } from 'clsx';
import { Battery, Moon } from 'lucide-react';
import { useStore } from '../store';
import { KASAM_MODES, type CognitiveLoadLevel } from './cognitiveLoadStorage';

const LEVELS: CognitiveLoadLevel[] = [1, 2, 3, 4, 5];

export function CognitiveLoadBar() {
  const load = useStore((s) => s.ui.cognitiveLoad);
  const kasamMode = useStore((s) => s.ui.kasamMode);
  const safeMode = useStore((s) => s.ui.safeMode);
  const setCognitiveLoad = useStore((s) => s.setCognitiveLoad);
  const setKasamMode = useStore((s) => s.setKasamMode);

  return (
    <div
      className={clsx(
        'cognitive-load-bar',
        safeMode && 'cognitive-load-bar--safe',
      )}
      aria-label="Kognitiv laddning och KASAM-läge"
    >
      <div className="cognitive-load-bar__row">
        <Battery
          className={clsx('h-3.5 w-3.5', safeMode ? 'text-amber-300' : 'text-text-dim')}
          strokeWidth={1.75}
        />
        <span className="cognitive-load-bar__label">Belastning</span>
        <div className="cognitive-load-bar__scale" role="group" aria-label="Skala 1 till 5">
          {LEVELS.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={load === n}
              aria-label={`Nivå ${n}`}
              onClick={() => setCognitiveLoad(n)}
              className={clsx(
                'cognitive-load-bar__dot',
                load === n && 'cognitive-load-bar__dot--active',
                load >= 4 && load === n && 'cognitive-load-bar__dot--fatigue',
              )}
            />
          ))}
        </div>
      </div>

      {safeMode && (
        <p className="cognitive-load-bar__safe-hint">
          <Moon className="inline h-3 w-3" /> Extrem trötthet — reducerad vy
        </p>
      )}

      <label className="cognitive-load-bar__kasam">
        <span className="sr-only">KASAM-läge</span>
        <select
          value={kasamMode}
          onChange={(e) => setKasamMode(e.target.value as typeof kasamMode)}
          className="cognitive-load-bar__select"
        >
          {KASAM_MODES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
