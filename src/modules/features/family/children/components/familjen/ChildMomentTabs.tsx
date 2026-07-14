import {
  CHILD_MOMENT_TAB_LABELS,
  type ChildMomentViewId,
} from '../../constants/childMomentViews';

type Props = {
  active: ChildMomentViewId;
  childAlias: string;
  onChange: (view: ChildMomentViewId) => void;
};

export function ChildMomentTabs({ active, childAlias, onChange }: Props) {
  const omLabel = `Om ${childAlias}`;

  return (
    <div
      className="flex flex-wrap gap-2 border-b border-border-subtle pb-3"
      role="tablist"
      aria-label={`${childAlias} — stunder och minnen`}
    >
      {(['stunder', 'om', 'favoriter'] as const).map((id) => {
        const label = id === 'om' ? omLabel : CHILD_MOMENT_TAB_LABELS[id];
        const selected = active === id;
        return (
          <button
            key={id}
            id={`child-moment-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="child-moment-panel"
            onClick={() => onChange(id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              selected ? 'chip--active' : 'chip--idle'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
