import type { ChildAlias } from '../../constants';

type Props = {
  activeChild: ChildAlias;
  children: readonly ChildAlias[];
  onChange: (child: ChildAlias) => void;
};

export function FamiljenChildPicker({ activeChild, children, onChange }: Props) {
  return (
    <div className="familjen-child-picker-shell" role="group" aria-label="Välj barn">
      <span className="familjen-child-picker-label">Välj barn</span>
      <div className="flex gap-2">
        {children.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={
              activeChild === name
                ? 'familjen-child-chip familjen-child-chip--active min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55'
                : 'familjen-child-chip familjen-child-chip--idle min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55'
            }
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
