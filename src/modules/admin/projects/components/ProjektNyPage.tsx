import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, FileText, Image, List } from 'lucide-react';
import { HubPageShell } from '../../../core/layout/HubPageShell';
import { useStore } from '../../../core/store';
import { createProject } from '../api/projectsApi';
import { createProjectBlock } from '../api/projectBlocksApi';
import { createPlanningTask } from '../../../admin/planning/api/planningTasksApi';
import type { ProjectBlockType } from '../types';

const PICKER: { id: ProjectBlockType; label: string; icon: typeof List }[] = [
  { id: 'list', label: 'Lista', icon: List },
  { id: 'note', label: 'Anteckning', icon: FileText },
  { id: 'image', label: 'Bild', icon: Image },
  { id: 'task', label: 'Uppgift → Handling', icon: CheckSquare },
];

/** Route: /admin/projects/ny — skapa projekt + första block (P1). */
export function ProjektNyPage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startProject = async (blockType: ProjectBlockType) => {
    if (!user) {
      setError('Logga in för att skapa projekt.');
      return;
    }
    const defaultTitle =
      blockType === 'list'
        ? 'Min lista'
        : blockType === 'note'
          ? 'Anteckning'
          : blockType === 'image'
            ? 'Bildprojekt'
            : 'Uppgiftsprojekt';
    const title = window.prompt('Projektnamn:', defaultTitle);
    if (!title?.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const projectId = await createProject(user.uid, {
        title: title.trim(),
        primaryBlockType: blockType,
      });

      if (blockType === 'task') {
        const taskTitle = window.prompt('Uppgiftstitel för Handling:', title.trim()) ?? title.trim();
        const taskId = await createPlanningTask(user.uid, {
          title: taskTitle.trim(),
          status: 'todo',
          source: 'manual',
          projectId,
        });
        await createProjectBlock(user.uid, {
          projectId,
          type: 'task',
          title: taskTitle.trim(),
          order: 0,
          planningTaskId: taskId,
        });
        navigate(`/planering?projectId=${encodeURIComponent(projectId)}`);
        return;
      }

      await createProjectBlock(user.uid, {
        projectId,
        type: blockType,
        title: blockType === 'list' ? 'Första listan' : title.trim(),
        content: blockType === 'note' ? '' : blockType === 'image' ? 'Bildblock — uppladdning senare.' : undefined,
        order: 0,
      });
      navigate(`/admin/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skapa projekt.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <HubPageShell
      eyebrow="Projekt"
      title="Nytt projekt"
      lead="Välj typ. Uppgifter med status hamnar alltid i Handling."
    >
      {error && <p className="mb-3 text-sm text-danger">{error}</p>}
      {!user && <p className="mb-3 text-sm text-text-muted">Logga in för att skapa projekt.</p>}

      <div className="home-module-stack">
        {PICKER.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              disabled={saving || !user}
              className="elongated-module elongated-module--gold flex w-full items-center gap-3 p-4 text-left disabled:opacity-60"
              onClick={() => void startProject(item.id)}
            >
              <Icon className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium text-accent">{item.label}</p>
                <p className="text-xs text-text-muted">
                  {item.id === 'task' ? 'Skapar kanban-kort med projectId' : 'Skapar projekt + block'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <Link to="/projekt" className="btn-pill--ghost mt-4 inline-flex text-sm">
        Tillbaka till projekt
      </Link>
    </HubPageShell>
  );
}
