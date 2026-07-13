import { Camera, CheckSquare, FileText, List, Mail, Mic, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Sheet } from '@/design-system/components/Sheet';

const PICKER_TILES = [
  { id: 'list', label: 'Lista', icon: List },
  { id: 'note', label: 'Anteckning', icon: FileText },
  { id: 'image', label: 'Bild', icon: Camera },
  { id: 'task', label: 'Uppgift', icon: CheckSquare },
  { id: 'email', label: 'Från mejl', icon: Mail },
  { id: 'voice', label: 'Röst', icon: Mic },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  onPick?: (id: (typeof PICKER_TILES)[number]['id']) => void;
};

/** Theme Lab — NYTT PROJEKT picker (mockup v2, ingen routing). */
export function W1ProjektNyPickerPreview({ open, onClose, onPick }: Props) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Nytt projekt"
      panelClassName="w1-lab-picker__panel"
      bodyClassName="w1-lab-picker__body"
      headerAction={
        <button
          type="button"
          className="w1-lab-picker__close"
          aria-label="Stäng"
          onClick={onClose}
        >
          <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </button>
      }
    >
      <div className="w1-lab-picker__handle" aria-hidden />
      <div className="w1-lab-picker__grid">
        {PICKER_TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              type="button"
              className="w1-lab-picker__tile"
              onClick={() => {
                onPick?.(tile.id);
                onClose();
              }}
            >
              <span className="w1-lab-picker__tile-icon" aria-hidden>
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="w1-lab-picker__tile-label">{tile.label}</span>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

export function W1LabPaginationDots({ active = 1, count = 5 }: { active?: number; count?: number }) {
  return (
    <div className="w1-lab-dots" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={clsx('w1-lab-dots__dot', i === active && 'w1-lab-dots__dot--active')}
        />
      ))}
    </div>
  );
}
