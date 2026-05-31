import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckSquare, FileText, Image, List } from 'lucide-react';
import { HubPageShell } from '../../../core/layout/HubPageShell';
import { GoraHubTabBar } from '../../../core/navigation/GoraHubTabBar';
import { useStore } from '../../../core/store';
import { uploadProjectImage } from '../../../core/firebase/storage';
import { createProject } from '../api/projectsApi';
import { createProjectBlock } from '../api/projectBlocksApi';
import { createPlanningTask } from '../../../admin/planning/api/planningTasksApi';
import { ProjectImagePicker } from './ProjectImagePicker';
import type { ProjectBlockType } from '../types';

const PICKER: { id: ProjectBlockType; label: string; icon: typeof List }[] = [
  { id: 'list', label: 'Lista', icon: List },
  { id: 'note', label: 'Anteckning', icon: FileText },
  { id: 'image', label: 'Bild', icon: Image },
  { id: 'task', label: 'Uppgift → Handling', icon: CheckSquare },
];

function parseBlockType(raw: string | null): ProjectBlockType | null {
  if (raw === 'list' || raw === 'note' || raw === 'image' || raw === 'task') return raw;
  return null;
}

/** Routes: /projekt/ny · /admin/projects/ny */
export function ProjektNyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useStore((s) => s.user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const preselected = parseBlockType(searchParams.get('type'));
  const fromWidget = searchParams.get('from') === 'widget';

  const startProject = useCallback(async (blockType: ProjectBlockType) => {
    if (!user) {
      setError('Logga in för att skapa projekt.');
      return;
    }
    if (blockType === 'image' && !imageFile) {
      setError('Välj en bild först.');
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

      if (blockType === 'image' && imageFile) {
        const { storagePath, downloadUrl } = await uploadProjectImage(user.uid, projectId, imageFile);
        await createProjectBlock(user.uid, {
          projectId,
          type: 'image',
          title: title.trim(),
          content: imageCaption.trim() || undefined,
          storagePath,
          imageUrl: downloadUrl,
          order: 0,
        });
        navigate(`/admin/projects/${projectId}`);
        return;
      }

      await createProjectBlock(user.uid, {
        projectId,
        type: blockType,
        title: blockType === 'list' ? 'Första listan' : title.trim(),
        content: blockType === 'note' ? '' : undefined,
        order: 0,
      });
      navigate(`/admin/projects/${projectId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Kunde inte skapa projekt.';
      setError(
        msg.includes('storage/unauthorized')
          ? 'Uppladdning nekad — logga in igen och försök. (Storage-regler ska vara deployade.)'
          : msg,
      );
    } finally {
      setSaving(false);
    }
  }, [user, imageFile, imageCaption, navigate]);

  useEffect(() => {
    if (!preselected || preselected === 'image') return;
    if (!user || saving) return;
    void startProject(preselected);
  }, [preselected, user, saving, startProject]);

  if (preselected === 'image') {
    return (
      <HubPageShell
        eyebrow="Göra"
        title="Nytt bildprojekt"
        lead={fromWidget ? 'Från widget — välj foto och namnge projektet.' : 'Ladda upp foto till Storage + projektblock.'}
      >
        <GoraHubTabBar />
        {error && <p className="mb-3 text-sm text-danger">{error}</p>}
        <ProjectImagePicker disabled={saving || !user} onPick={setImageFile} />
        <textarea
          className="input-glass mt-3 w-full text-sm"
          rows={2}
          placeholder="Bildtext (valfritt)"
          value={imageCaption}
          onChange={(e) => setImageCaption(e.target.value)}
        />
        <button
          type="button"
          disabled={saving || !user || !imageFile}
          className="btn-pill--accent mt-4 text-sm"
          onClick={() => void startProject('image')}
        >
          Skapa projekt med bild
        </button>
        <Link to="/projekt" className="btn-pill--ghost mt-4 inline-flex text-sm">
          Avbryt
        </Link>
      </HubPageShell>
    );
  }

  return (
    <HubPageShell
      eyebrow="Göra"
      title="Nytt projekt"
      lead="Välj typ. Uppgifter med status hamnar alltid i Handling."
    >
      <GoraHubTabBar />
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
              onClick={() => {
                if (item.id === 'image') {
                  navigate('/projekt/ny?type=image');
                  return;
                }
                void startProject(item.id);
              }}
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
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/projekt/regler" className="btn-pill--ghost text-sm">
          Regler
        </Link>
        <Link to="/projekt" className="btn-pill--ghost text-sm">
          Tillbaka
        </Link>
      </div>
    </HubPageShell>
  );
}
