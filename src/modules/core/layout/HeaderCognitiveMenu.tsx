import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Battery, ChevronDown, Moon } from 'lucide-react';
import { useStore } from '../store';
import { KASAM_MODES, type CognitiveLoadLevel } from '../cognitive/cognitiveLoadStorage';

const LEVELS: CognitiveLoadLevel[] = [1, 2, 3, 4, 5];

/** Header — kompakt indikator, full kontroll i popover. */
export function HeaderCognitiveMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const load = useStore((s) => s.ui.cognitiveLoad);
  const kasamMode = useStore((s) => s.ui.kasamMode);
  const safeMode = useStore((s) => s.ui.safeMode);
  const setCognitiveLoad = useStore((s) => s.setCognitiveLoad);
  const setKasamMode = useStore((s) => s.setKasamMode);

  const kasamLabel = KASAM_MODES.find((m) => m.id === kasamMode)?.label ?? 'KASAM';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="header-cog-menu">
      <button
        type="button"
        className={clsx('header-cog-menu__trigger', open && 'header-cog-menu__trigger--open')}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        <Battery
          className={clsx('h-3.5 w-3.5', safeMode ? 'text-amber-300' : 'text-text-dim')}
          strokeWidth={1.75}
        />
        <span className="header-cog-menu__dots" aria-hidden>
          {LEVELS.map((n) => (
            <span
              key={n}
              className={clsx(
                'header-cog-menu__dot',
                load >= n && 'header-cog-menu__dot--on',
                load >= 4 && load === n && 'header-cog-menu__dot--fatigue',
              )}
            />
          ))}
        </span>
        <ChevronDown className="header-cog-menu__chev h-3 w-3" aria-hidden />
      </button>

      {open && (
        <div className="header-cog-menu__panel" role="dialog" aria-label="Belastning och KASAM">
          <p className="header-cog-menu__eyebrow">Belastning</p>
          <div className="header-cog-menu__scale" role="group" aria-label="Nivå 1 till 5">
            {LEVELS.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={load === n}
                onClick={() => setCognitiveLoad(n)}
                className={clsx(
                  'header-cog-menu__level',
                  load === n && 'header-cog-menu__level--active',
                  load >= 4 && load === n && 'header-cog-menu__level--fatigue',
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <label className="header-cog-menu__kasam">
            <span className="header-cog-menu__eyebrow">KASAM-läge</span>
            <select
              value={kasamMode}
              onChange={(e) => setKasamMode(e.target.value as typeof kasamMode)}
              className="header-cog-menu__select"
            >
              {KASAM_MODES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          {safeMode && (
            <p className="header-cog-menu__safe">
              <Moon className="inline h-3 w-3" /> Extrem trötthet — reducerad vy
            </p>
          )}
          <p className="header-cog-menu__current text-[10px] text-text-dim">{kasamLabel}</p>
        </div>
      )}
    </div>
  );
}
