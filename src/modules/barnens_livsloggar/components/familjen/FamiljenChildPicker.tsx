import type { ChildAlias } from '../../constants';

type Props = {
  activeChild: ChildAlias;
  children: readonly ChildAlias[];
  onChange: (child: ChildAlias) => void;
};

export function FamiljenChildPicker({ activeChild, children, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {children.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          className={`flex-1 rounded-2xl border py-2.5 text-sm font-medium transition ${
            activeChild === name
              ? 'border-accent/50 bg-accent/10 text-accent shadow-[0_0_24px_rgba(45,212,191,0.12)]'
              : 'chip--idle'
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
