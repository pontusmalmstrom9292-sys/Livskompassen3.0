import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, FileText, Image, List } from 'lucide-react';
import { HubPageShell } from '../../core/layout/HubPageShell';

const PICKER = [
  { id: 'list', label: 'Lista', icon: List, status: 'P1' as const },
  { id: 'note', label: 'Anteckning', icon: FileText, status: 'P1' as const },
  { id: 'image', label: 'Bild', icon: Image, status: 'P1' as const },
  { id: 'task', label: 'Uppgift → Handling', icon: CheckSquare, status: 'live' as const },
];

/** Route: /projekt/ny — välj typ för nytt projekt (block + Firestore kommer i full P1). */
export function ProjektNyPage() {
  const navigate = useNavigate();

  return (
    <HubPageShell
      eyebrow="Projekt"
      title="Nytt projekt"
      lead="Välj typ. Uppgifter med status hamnar alltid i Handling."
    >
      <div className="home-module-stack">
        {PICKER.map((item) => {
          const Icon = item.icon;
          if (item.id === 'task') {
            return (
              <button
                key={item.id}
                type="button"
                className="elongated-module elongated-module--gold flex w-full items-center gap-3 p-4 text-left"
                onClick={() => navigate('/planering')}
              >
                <Icon className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium text-accent">{item.label}</p>
                  <p className="text-xs text-text-muted">Öppna kanban</p>
                </div>
              </button>
            );
          }
          return (
            <div
              key={item.id}
              className="elongated-module flex items-center gap-3 border-white/10 p-4 opacity-85"
            >
              <Icon className="h-5 w-5 text-text-dim" />
              <div>
                <p className="text-sm text-text-muted">{item.label}</p>
                <p className="text-[10px] uppercase tracking-widest text-text-dim">
                  Byggs · {item.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Link to="/projekt" className="btn-pill--ghost mt-4 inline-flex text-sm">
        Tillbaka till projekt
      </Link>
    </HubPageShell>
  );
}
