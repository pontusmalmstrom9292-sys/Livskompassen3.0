import { useNavigate } from 'react-router-dom';
import { CheckSquare, FileText, Image, List, X, Film } from 'lucide-react';
import { Button, Sheet } from '@/design-system';
import type { ProjectBlockType } from '../types';

const TILES: { id: ProjectBlockType; label: string; icon: typeof List }[] = [
  { id: 'list', label: 'Lista', icon: List },
  { id: 'note', label: 'Anteckning', icon: FileText },
  { id: 'image', label: 'Bild', icon: Image },
  { id: 'video', label: 'Video', icon: Film },
  { id: 'task', label: 'Uppgift', icon: CheckSquare },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Bottom sheet — samma 4 typer som /projekt/ny (widget/dock genväg, P2). */
export function ProjektPickerSheet({ open, onClose }: Props) {
  const navigate = useNavigate();

  const pick = (type: ProjectBlockType) => {
    onClose();
    navigate(`/projekt/ny?type=${type}&from=widget`);
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Nytt projekt"
      ariaLabel="Nytt projekt"
      headerAction={
        <button type="button" className="header-chrome-btn p-2" aria-label="Stäng" onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-2">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              type="button"
              className="elongated-module overflow-hidden flex flex-col items-center gap-2 p-4"
              onClick={() => pick(tile.id)}
            >
              <Icon className="h-6 w-6 text-accent" />
              <span className="text-sm text-text">{tile.label}</span>
            </button>
          );
        })}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-3 w-full"
        onClick={() => {
          onClose();
          navigate('/projekt/regler');
        }}
      >
        Regler & automation
      </Button>
    </Sheet>
  );
}
