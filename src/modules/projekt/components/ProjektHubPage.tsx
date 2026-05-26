import { Link } from 'react-router-dom';
import { FolderKanban, List, Image, FileText, CheckSquare } from 'lucide-react';

const BLOCK_TYPES = [
  { id: 'list', label: 'Lista', icon: List, status: 'P1' as const },
  { id: 'note', label: 'Anteckning', icon: FileText, status: 'P1' as const },
  { id: 'image', label: 'Bild', icon: Image, status: 'P1' as const },
  { id: 'task', label: 'Uppgift → Handling', icon: CheckSquare, status: 'live' as const },
];

/** P0 hub — flexibla projekt (handling/kanban ligger på /planering). */
export function ProjektHubPage() {
  return (
    <div className="space-y-4">
      <header className="px-0.5">
        <p className="home-page__eyebrow">Projekt</p>
        <h1 className="home-page__title text-xl">Egna planeringar</h1>
        <p className="home-page__lead text-xs">
          Listor, anteckningar och bilder — uppgifter med status hamnar alltid i Handling.
        </p>
      </header>

      <div className="home-module-stack">
        {BLOCK_TYPES.map((block) => {
          const Icon = block.icon;
          const live = block.id === 'task';
          return live ? (
            <Link
              key={block.id}
              to="/planering"
              className="elongated-module elongated-module--gold flex items-center gap-3 p-4"
            >
              <Icon className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium text-accent">{block.label}</p>
                <p className="text-xs text-text-muted">Öppna kanban på Planering</p>
              </div>
            </Link>
          ) : (
            <div
              key={block.id}
              className="elongated-module flex items-center gap-3 border-white/10 p-4 opacity-80"
            >
              <Icon className="h-5 w-5 text-text-dim" />
              <div>
                <p className="text-sm text-text-muted">{block.label}</p>
                <p className="text-[10px] uppercase tracking-widest text-text-dim">Byggs · {block.status}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <Link
          to="/projekt/ny"
          className="btn-pill--accent flex w-full items-center justify-center gap-2"
        >
          <FolderKanban className="h-4 w-4" />
          Nytt projekt
        </Link>
        <Link to="/planering" className="btn-pill--secondary flex w-full items-center justify-center gap-2">
          <FolderKanban className="h-4 w-4" />
          Till Handling (kanban)
        </Link>
      </div>
    </div>
  );
}
