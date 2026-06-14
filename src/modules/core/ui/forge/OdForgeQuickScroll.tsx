import { clsx } from 'clsx';

export type OdForgeChip = {
  id: string;
  label: string;
};

type Props = {
  chips: OdForgeChip[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function OdForgeQuickScroll({ chips, activeId, onSelect }: Props) {
  return (
    <div className="od-forge__chips" role="toolbar" aria-label="Snabbval">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          className={clsx('od-forge__chip', activeId === chip.id && 'od-forge__chip--active')}
          onClick={() => onSelect(chip.id)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
