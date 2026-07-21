import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckSquare, FileText, Image, List, Film } from 'lucide-react';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { GoraHubTabBar } from '@/core/navigation/GoraHubTabBar';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { useStore } from '@/core/store';
import { uploadProjectMedia } from '@/core/firebase/storage';
import { createProject } from '../api/projectsApi';
import { createProjectBlock } from '../api/projectBlocksApi';
import { createPlanningTask } from '../../planning/api/planningTasksApi';
import { resolveProjectSaveError } from '../utils/resolveProjectSaveError';
import { ProjectMediaPicker } from './ProjectMediaPicker';
import type { ProjectBlockType } from '../types';
import { Button, ButtonLink } from '@/design-system';

const PICKER: { id: ProjectBlockType; label: string; icon: typeof List }[] = [
  { id: 'list', label: 'Lista', icon: List },
  { id: 'note', label: 'Anteckning', icon: FileText },
  { id: 'image', label: 'Bild', icon: Image },
  { id: 'video', label: 'Video', icon: Film },
  { id: 'task', label: 'Uppgift → Handling', icon: CheckSquare },
];

function parseBlockType(raw: string | null): ProjectBlockType | null {
  if (raw === 'list' || raw === 'note' || raw === 'image' || raw === 'video' || raw === 'task') return raw;
  return null;
}

/** Routes: /projekt/ny · /admin/projects/ny */
export function ProjektNyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useStore((s) => s.user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaTouched, setMediaTouched] = useState(false);
  const [autoStarting, setAutoStarting] = useState(false);
  const preselected = parseBlockType(searchParams.get('type'));
  const fromWidget = searchParams.get('from') === 'widget';

  const startProject = useCallback(async (blockType: ProjectBlockType) => {
    if (!user) {
      setError('Logga in för att skapa projekt.');
      return;
    }
    if ((blockType === 'image' || blockType === 'video') && !mediaFile) {
      setError('Välj en fil först.');
      return;
    }

    const defaultTitle =
      blockType === 'list'
        ? 'Min lista'
        : blockType === 'note'
          ? 'Anteckning'
          : blockType === 'image'
            ? 'Bildprojekt'
            : blockType === 'video'
              ? 'Videoprojekt'
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

      if ((blockType === 'image' || blockType === 'video') && mediaFile) {
        const { storagePath, downloadUrl } = await uploadProjectMedia(user.uid, projectId, mediaFile);
        await createProjectBlock(user.uid, {
          projectId,
          type: blockType,
          title: title.trim(),
          content: mediaCaption.trim() || undefined,
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
      const context =
        (blockType === 'image' || blockType === 'video') && mediaFile ? 'upload' : 'project';
      setError(resolveProjectSaveError(err, context));
    } finally {
      setSaving(false);
    }
  }, [user, mediaFile, mediaCaption, navigate]);

  useEffect(() => {
    if (!preselected || preselected === 'image' || preselected === 'video') return;
    if (!user || saving) return;
    setAutoStarting(true);
    void startProject(preselected).finally(() => setAutoStarting(false));
  }, [preselected, user, saving, startProject]);

  const mediaMissing = mediaTouched && !mediaFile;
  const canCreateMediaProject = Boolean(mediaFile) && !saving && Boolean(user);

  if (preselected === 'image' || preselected === 'video') {
    return (
      <HubPageShell
        eyebrow="Göra"
        title={preselected === 'video' ? "Nytt videoprojekt" : "Nytt bildprojekt"}
        lead={fromWidget ? 'Från widget — välj fil och namnge projektet.' : 'Ladda upp fil till Storage + projektblock.'}
      >
        <GoraHubTabBar />
        {error && (
          <p className="mb-3 text-sm text-danger" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        <ProjectMediaPicker
          disabled={saving || !user}
          acceptVideo={preselected === 'video'}
          onPick={(file) => {
            setMediaTouched(true);
            setMediaFile(file);
            if (file) setError(null);
          }}
        />
        {mediaMissing && (
          <p className="mt-2 text-sm text-danger" role="alert" id="projekt-media-error">
            Välj en fil innan du skapar projektet.
          </p>
        )}
        <textarea
          className="input-glass mt-3 min-h-[4.5rem] w-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          rows={2}
          placeholder="Beskrivning (valfritt)"
          value={mediaCaption}
          onChange={(e) => setMediaCaption(e.target.value)}
          aria-label="Beskrivning (valfritt)"
          aria-describedby={mediaMissing ? 'projekt-media-error' : undefined}
          disabled={saving || !user}
        />
        <Button
          type="button"
          disabled={!canCreateMediaProject}
          variant="accent"
          className="--accent mt-4 min-h-11 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-busy={saving}
          onClick={() => {
            setMediaTouched(true);
            if (!mediaFile) return;
            void startProject(preselected);
          }}
        >
          {saving ? 'Skapar…' : 'Skapa projekt med fil'}
        </Button>
        <ButtonLink to="/projekt" variant="ghost" className="--ghost mt-4 inline-flex text-sm">
          Avbryt
        </ButtonLink>
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
      {autoStarting && (
        <div className="mb-3" aria-busy="true" aria-live="polite">
          <HubPanelSkeleton label="Skapar projekt…" lines={2} />
        </div>
      )}
      {error && (
        <p className="mb-3 text-sm text-danger" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      {!user && (
        <p className="mb-3 text-sm text-text-muted" role="status">
          Logga in för att skapa projekt.
        </p>
      )}

      <div className="home-module-stack" role="list" aria-label="Projekttyper" aria-busy={autoStarting || saving}>
        {PICKER.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              disabled={saving || !user || autoStarting}
              aria-label={item.label}
              aria-busy={saving}
              className="elongated-module elongated-module--gold flex min-h-11 w-full items-center gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-60"
              onClick={() => {
                if (item.id === 'image' || item.id === 'video') {
                  navigate(`/projekt/ny?type=${item.id}`);
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
        <ButtonLink to="/projekt/regler" variant="ghost" className="--ghost text-sm">
          Regler
        </ButtonLink>
        <ButtonLink to="/projekt" variant="ghost" className="--ghost text-sm">
          Tillbaka
        </ButtonLink>
      </div>
    </HubPageShell>
  );
}
