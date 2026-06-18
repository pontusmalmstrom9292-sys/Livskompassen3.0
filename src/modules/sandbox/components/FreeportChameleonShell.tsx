import { clsx } from 'clsx';
import { getFreeportZone, type FreeportZoneId } from '../freeportZones';

type Props = {
  zone: FreeportZoneId;
  activeMode: string;
  onModeChange: (modeId: string) => void;
  status?: string;
};

export function FreeportChameleonShell({ zone, activeMode, onModeChange, status }: Props) {
  const def = getFreeportZone(zone);
  const modeMeta = def.modes.find((m) => m.id === activeMode) ?? def.modes[0];

  return (
    <div className="design-freeport__shell" aria-label="Chameleon Supermodule">
      <p className="design-freeport__section-title">{def.label} — supermodul</p>
      <p className="design-freeport__hint mt-2">
        Mode-byte in-place · morph {350}ms · ingen sidladdning
      </p>

      <div className="design-freeport__mode-row" role="tablist">
        {def.modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={activeMode === mode.id}
            className={clsx(
              'design-freeport__mode-btn',
              activeMode === mode.id && 'design-freeport__mode-btn--on',
            )}
            onClick={() => onModeChange(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-[var(--fp-border)] bg-[var(--fp-surface-3)] p-4">
        <p className="text-sm font-medium text-[var(--fp-text)]">{modeMeta.label}</p>
        <p className="mt-1 text-xs text-[var(--fp-text-muted)]">{modeMeta.description}</p>
        <p className="mt-3 text-xs text-[var(--fp-text-dim)]">
          Delegate: <code className="text-[var(--fp-accent)]">{modeMeta.id}</code>
        </p>
      </div>

      {status ? (
        <p className="design-freeport__status" aria-live="polite">
          {status}
        </p>
      ) : null}
    </div>
  );
}
