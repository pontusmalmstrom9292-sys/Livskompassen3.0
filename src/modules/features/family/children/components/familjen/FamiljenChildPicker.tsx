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
                ? 'familjen-child-chip familjen-child-chip--active'
                : 'familjen-child-chip familjen-child-chip--idle'
            }
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
