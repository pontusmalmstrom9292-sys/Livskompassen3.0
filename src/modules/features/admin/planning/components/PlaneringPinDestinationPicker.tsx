import { clsx } from 'clsx';
import {
  PLANNING_PIN_CHILD_OPTIONS,
  PLANNING_PIN_LAYOUTS,
  PLANNING_PIN_TARGETS,
  type PlaneringPinLayoutId,
  type PlaneringPinTargetId,
} from '../planningPinRegistry';

type Props = {
  targetId: PlaneringPinTargetId;
  layout: PlaneringPinLayoutId;
  contextKey: string;
  onTargetChange: (id: PlaneringPinTargetId) => void;
  onLayoutChange: (id: PlaneringPinLayoutId) => void;
  onContextKeyChange: (key: string) => void;
  compact?: boolean;
};

export function PlaneringPinDestinationPicker({
  targetId,
  layout,
  contextKey,
  onTargetChange,
  onLayoutChange,
  onContextKeyChange,
  compact,
}: Props) {
  const targetDef = PLANNING_PIN_TARGETS.find((t) => t.id === targetId);
  const needsChild = targetDef?.contextKind === 'child';

  const groups = [...new Set(PLANNING_PIN_TARGETS.map((t) => t.group))];

  return (
    <div className={clsx('planering-pin-picker space-y-3', compact && 'planering-pin-picker--compact')}>
      <div>
        <p className="text-xs uppercase tracking-wider text-text-muted">Fäst på skärm</p>
        <select
          className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
          value={targetId}
          onChange={(e) => onTargetChange(e.target.value as PlaneringPinTargetId)}
          aria-label="Välj skärm"
        >
          {groups.map((group) => (
            <optgroup key={group} label={group}>
              {PLANNING_PIN_TARGETS.filter((t) => t.group === group).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {targetDef ? <p className="mt-1 text-xs text-text-muted">{targetDef.lead}</p> : null}
      </div>

      {needsChild ? (
        <div>
          <p className="text-xs uppercase tracking-wider text-text-muted">Barn</p>
          <select
            className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
            value={contextKey}
            onChange={(e) => onContextKeyChange(e.target.value)}
            aria-label="Välj barn"
          >
            <option value="">Välj barn …</option>
            {PLANNING_PIN_CHILD_OPTIONS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <p className="text-xs uppercase tracking-wider text-text-muted">Modulform</p>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {PLANNING_PIN_LAYOUTS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(
                'planering-pin-picker__layout-btn inline-flex min-h-11 flex-col rounded-xl border px-2.5 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55',
                layout === l.id
                  ? 'border-accent/50 bg-surface-3 text-accent'
                  : 'border-border/40 bg-surface-2/50 text-text-muted hover:border-accent/25',
              )}
              onClick={() => onLayoutChange(l.id)}
            >
              <span className="block text-xs font-medium">{l.label}</span>
              <span className="block text-[10px] leading-snug opacity-80">{l.lead}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
