import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { PLANERING_HUB_LAYOUTS } from '../planeringHubLayouts';
import type { PlaneringHubLayoutId } from '../planeringHubLayouts';

type Props = {
  activeId: PlaneringHubLayoutId;
  onSelect: (id: PlaneringHubLayoutId) => void;
  compact?: boolean;
};

/** Horisontell väljare — ett val i taget (ADHD-säkert). */
export function PlaneringHubLayoutPicker({
  activeId,
  onSelect,
  compact,
}: Props) {
  return (
    <section
      className={clsx('planering-layout-picker', compact && 'planering-layout-picker--compact')}
      aria-label="Hubb-layout"
    >
      <div className="planering-layout-picker__head">
        <p className="planering-layout-picker__eyebrow">Hubb-layout</p>
        {!compact ? (
          <Link to="/dev/hub-lab" className="planering-layout-picker__lab-link">
            Hub Lab ↗
          </Link>
        ) : null}
      </div>
      <div
        className="planering-layout-picker__track"
        role="listbox"
        aria-label="Välj hubb-layout"
      >
        {PLANERING_HUB_LAYOUTS.map((layout) => {
          const active = layout.id === activeId;
          return (
            <button
              key={layout.id}
              type="button"
              role="option"
              aria-selected={active}
              className={clsx(
                'planering-layout-picker__chip',
                `planering-layout-picker__chip--${layout.shell}`,
                active && 'planering-layout-picker__chip--active',
              )}
              onClick={() => onSelect(layout.id)}
              title={layout.lead}
            >
              <span className="planering-layout-picker__emoji" aria-hidden>
                {layout.emoji}
              </span>
              <span className="planering-layout-picker__label">{layout.label}</span>
            </button>
          );
        })}
      </div>
      <p className="planering-layout-picker__active-lead">
        {PLANERING_HUB_LAYOUTS.find((l) => l.id === activeId)?.lead}
      </p>
    </section>
  );
}
