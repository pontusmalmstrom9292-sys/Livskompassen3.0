import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { PLANERING_HUB_LAYOUTS } from '../planeringHubLayouts';
import type { PlaneringHubLayoutId } from '../planeringHubLayouts';

type Props = {
  activeId: PlaneringHubLayoutId;
  onSelect: (id: PlaneringHubLayoutId) => void;
  compact?: boolean;
};

/** Hubb-layout — en dropdown istället för chip-rad (ADHD-säkert). */
export function PlaneringHubLayoutPicker({ activeId, onSelect, compact }: Props) {
  const active = PLANERING_HUB_LAYOUTS.find((l) => l.id === activeId);

  return (
    <section
      className={clsx('planering-layout-picker', compact && 'planering-layout-picker--compact')}
      aria-label="Hubb-layout"
    >
      <div className="planering-layout-picker__head">
        <p className="planering-layout-picker__eyebrow">Hubb-layout</p>
        {!compact ? (
          <Link to="/dev/hub-lab" className="planering-layout-picker__lab-link min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
            Hub Lab ↗
          </Link>
        ) : null}
      </div>
      <label className="block text-xs text-text-muted">
        <span className="sr-only">Välj hubb-layout</span>
        <select
          value={activeId}
          onChange={(e) => onSelect(e.target.value as PlaneringHubLayoutId)}
          className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
          aria-label="Välj hubb-layout"
        >
          {PLANERING_HUB_LAYOUTS.map((layout) => (
            <option key={layout.id} value={layout.id}>
              {layout.emoji} {layout.label}
            </option>
          ))}
        </select>
      </label>
      {active ? (
        <p className="planering-layout-picker__active-lead">{active.lead}</p>
      ) : null}
    </section>
  );
}
