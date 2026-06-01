import { useNavigate } from 'react-router-dom';
import { CheckSquare, FileText, Image, List, X } from 'lucide-react';
import type { ProjectBlockType } from '../types';

const TILES: { id: ProjectBlockType; label: string; icon: typeof List }[] = [
  { id: 'list', label: 'Lista', icon: List },
  { id: 'note', label: 'Anteckning', icon: FileText },
  { id: 'image', label: 'Bild', icon: Image },
  { id: 'task', label: 'Uppgift', icon: CheckSquare },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Bottom sheet — samma 4 typer som /projekt/ny (widget/dock genväg, P2). */
export function ProjektPickerSheet({ open, onClose }: Props) {
  const navigate = useNavigate();
  if (!open) return null;

  const pick = (type: ProjectBlockType) => {
    onClose();
    navigate(`/projekt/ny?type=${type}&from=widget`);
  };

  return (
    <div className="projekt-picker-sheet" role="dialog" aria-label="Nytt projekt">
      <button type="button" className="projekt-picker-sheet__backdrop" aria-label="Stäng" onClick={onClose} />
      <div className="projekt-picker-sheet__panel">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-accent">Nytt projekt</p>
          <button type="button" className="header-chrome-btn p-2" aria-label="Stäng" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.id}
                type="button"
                className="elongated-module flex flex-col items-center gap-2 p-4"
                onClick={() => pick(tile.id)}
              >
                <Icon className="h-6 w-6 text-accent" />
                <span className="text-sm text-text">{tile.label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="btn-pill--ghost mt-3 w-full text-xs"
          onClick={() => {
            onClose();
            navigate('/projekt/regler');
          }}
        >
          Regler & automation
        </button>
      </div>
    </div>
  );
}
