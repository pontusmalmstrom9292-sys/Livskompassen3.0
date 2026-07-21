import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '@/core/types/firestore';
import { useStore } from '@/core/store';
import { createPlanningTask } from '../../planning/api/planningTasksApi';
import { uploadProjectMedia } from '@/core/firebase/storage';
import { LayoutTemplate } from 'lucide-react';
import { listenProjectBlocks, createProjectBlock, runProjectBlockOcr } from '../api/projectBlocksApi';
import { updateProjectTitle } from '../api/projectsApi';
import { resolveProjectSaveError } from '../utils/resolveProjectSaveError';
import { ProjectMediaPicker } from './ProjectMediaPicker';
import { ProjektWidgetSheet } from './ProjektWidgetSheet';
import type { Project, ProjectBlock, ProjectBlockType } from '../types';
import { Button, ButtonLink } from '@/design-system';
import { EmptyState } from '@/core/ui/EmptyState';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';

const BLOCK_LABELS: Record<ProjectBlockType, string> = {
  list: 'Lista',
  note: 'Anteckning',
  image: 'Bild',
  video: 'Video',
  task: 'Uppgift',
};

export function ProjektDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const [project, setProject] = useState<Project | null>(null);
  const [blocks, setBlocks] = useState<ProjectBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newListItem, setNewListItem] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [pendingMedia, setPendingMedia] = useState<File | null>(null);
  const [mediaCaption, setMediaCaption] = useState('');
  const [ocrRunningId, setOcrRunningId] = useState<string | null>(null);
  const [isWidgetSheetOpen, setIsWidgetSheetOpen] = useState(false);

  useEffect(() => {
    if (!user || !projectId) {
      setProject(null);
      setLoading(false);
      return;
    }
    const ref = doc(db, FIRESTORE_COLLECTIONS.projects, projectId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setProject(null);
          setLoading(false);
          return;
        }
        const data = snap.data();
        if (data.ownerId !== user.uid) {
          setProject(null);
          setLoading(false);
          return;
        }
        setProject({
          id: snap.id,
          title: data.title as string,
          status: data.status as Project['status'],
          primaryBlockType: data.primaryBlockType as Project['primaryBlockType'],
        });
        setLoading(false);
      },
      () => {
        setProject(null);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [user, projectId]);

  useEffect(() => {
    if (!user || !projectId) {
      setBlocks([]);
      return;
    }
    return listenProjectBlocks(user.uid, projectId, setBlocks);
  }, [user, projectId]);

  const addBlock = async (
    type: ProjectBlockType,
    title: string,
    content?: string,
    media?: { storagePath: string; imageUrl: string },
  ) => {
    if (!user || !projectId) return;
    setSaving(true);
    setError(null);
    try {
      await createProjectBlock(user.uid, {
        projectId,
        type,
        title,
        content,
        order: blocks.length,
        ...(media ? { storagePath: media.storagePath, imageUrl: media.imageUrl } : {}),
      });
    } catch (err) {
      setError(resolveProjectSaveError(err, 'block'));
    } finally {
      setSaving(false);
    }
  };

  const addMediaBlock = async () => {
    if (!user || !projectId || !pendingMedia) return;
    const isVideo = pendingMedia.type.startsWith('video/');
    const title = window.prompt(isVideo ? 'Rubrik för videon:' : 'Rubrik för bilden:', isVideo ? 'Video' : 'Foto') ?? (isVideo ? 'Video' : 'Foto');
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const { storagePath, downloadUrl } = await uploadProjectMedia(
        user.uid,
        projectId,
        pendingMedia,
      );
      await createProjectBlock(user.uid, {
        projectId,
        type: isVideo ? 'video' : 'image',
        title: title.trim(),
        content: mediaCaption.trim() || undefined,
        storagePath,
        imageUrl: downloadUrl,
        order: blocks.length,
      });
      setPendingMedia(null);
      setMediaCaption('');
    } catch (err) {
      setError(resolveProjectSaveError(err, 'upload'));
    } finally {
      setSaving(false);
    }
  };

  const handleOcr = async (blockId: string) => {
    if (!projectId) return;
    setOcrRunningId(blockId);
    setError(null);
    try {
      await runProjectBlockOcr(projectId, blockId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR misslyckades.');
    } finally {
      setOcrRunningId(null);
    }
  };

  const addKanbanTask = async () => {
    if (!user || !projectId || !project) return;
    const title = window.prompt('Uppgiftstitel för Handling:', project.title);
    if (!title?.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const taskId = await createPlanningTask(user.uid, {
        title: title.trim(),
        status: 'todo',
        source: 'manual',
        projectId,
      });
      await createProjectBlock(user.uid, {
        projectId,
        type: 'task',
        title: title.trim(),
        order: blocks.length,
        planningTaskId: taskId,
      });
      navigate(`/planering?projectId=${encodeURIComponent(projectId)}`);
    } catch (err) {
      setError(resolveProjectSaveError(err, 'project'));
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för att öppna projekt.</p>;
  }

  if (loading) {
    return <HubPanelSkeleton label="Laddar projekt…" lines={4} />;
  }

  if (!project || !projectId) {
    return (
      <div className="space-y-3">
        <EmptyState
          title="Saknas"
          message="Projektet hittades inte."
          action={
            <ButtonLink to="/projekt" variant="ghost" className="--ghost min-h-11 text-sm">
              Tillbaka
            </ButtonLink>
          }
        />
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      <header className="px-0.5">
        <div className="flex items-center justify-between">
          <Link
            to="/projekt"
            className="min-h-11 inline-flex items-center text-xs text-text-dim hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            ← Projekt
          </Link>
          <button
            type="button"
            onClick={() => setIsWidgetSheetOpen(true)}
            aria-label="Öppna widget-panel"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border/40 bg-surface-3/40 px-2.5 py-1.5 text-xs text-text-muted transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <LayoutTemplate className="h-3.5 w-3.5" aria-hidden />
            Widgets
          </button>
        </div>
        <input
          className="input-glass mt-2 min-h-11 w-full text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          onBlur={() => void updateProjectTitle(user.uid, projectId, project.title)}
          aria-label="Projekttitel"
        />
        <p className="mt-1 text-xs text-text-muted">
          Uppgifter med status hamnar i{' '}
          <Link to={`/planering?projectId=${projectId}`} className="text-accent">
            Handling
          </Link>
        </p>
      </header>

      {error && (
        <p className="text-sm text-danger" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      
      <ProjektWidgetSheet 
        isOpen={isWidgetSheetOpen}
        onClose={() => setIsWidgetSheetOpen(false)}
        projectId={projectId}
      />

      <div className="home-module-stack">
        {blocks.length === 0 && (
          <EmptyState title="Inga block" message="Inga block än — lägg till nedan." />
        )}
        {blocks.map((block) => (
          <div key={block.id} className="elongated-module p-3 text-sm">
            <p className="text-[10px] uppercase tracking-widest text-text-dim">
              {BLOCK_LABELS[block.type]}
            </p>
            <p className="mt-1 font-medium text-text">{block.title}</p>
            {block.type === 'image' && block.imageUrl && (
              <div className="mt-2 space-y-2">
                <img
                  src={block.imageUrl}
                  alt={block.title}
                  className="max-h-56 w-full rounded-lg border border-white/10 object-cover"
                />
                {!block.content && (
                  <Button type="button" disabled={ocrRunningId === block.id} onClick={() => void handleOcr(block.id)} variant="ghost" className="--ghost text-xs">
                    {ocrRunningId === block.id ? 'Läser text...' : 'Läs ut text (OCR)'}
                  </Button>
                )}
              </div>
            )}
            {block.type === 'video' && block.imageUrl && (
              <video
                src={block.imageUrl}
                controls
                className="mt-2 max-h-60 w-full rounded-lg border border-white/10 bg-black"
              />
            )}
            {block.content && <p className="mt-2 whitespace-pre-wrap text-text-muted">{block.content}</p>}
            {block.type === 'task' && block.planningTaskId && (
              <ButtonLink to={`/planering?tab=handling&picked=1&projectId=${projectId}`} variant="secondary" className="--secondary mt-2 inline-flex text-xs">
                Öppna i kanban
              </ButtonLink>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-xl border border-white/10 p-3">
        <p className="text-[10px] uppercase tracking-widest text-text-dim">Lägg till block</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={saving} variant="secondary" className="--secondary text-xs" onClick={() => { const title = window.prompt('Rubrik för lista:', 'Min lista'); if (title?.trim()) void addBlock('list', title.trim()); }}>
            Lista
          </Button>
          <Button type="button" disabled={saving} variant="secondary" className="--secondary text-xs" onClick={() => void addBlock('note', 'Anteckning', noteDraft || undefined)}>
            Anteckning
          </Button>
          <Button type="button" disabled={saving} variant="secondary" className="--secondary text-xs" onClick={() => void addKanbanTask()}>
            Uppgift → Handling
          </Button>
        </div>
        <div className="mt-3 rounded-lg border border-white/10 p-2">
          <p className="text-[10px] uppercase tracking-widest text-text-dim">Media</p>
          <ProjectMediaPicker disabled={saving} acceptVideo onPick={setPendingMedia} />
          <textarea
            className="input-glass mt-2 w-full text-sm"
            rows={2}
            placeholder="Beskrivning (valfritt)"
            value={mediaCaption}
            onChange={(e) => setMediaCaption(e.target.value)}
          />
          <Button
            type="button"
            disabled={saving || !pendingMedia}
            variant="accent"
            className="--accent mt-2 min-h-11 text-xs"
            aria-busy={saving}
            onClick={() => void addMediaBlock()}
          >
            {saving ? 'Laddar upp…' : 'Ladda upp mediablock'}
          </Button>
        </div>
        <textarea
          className="input-glass mt-2 w-full text-sm"
          rows={3}
          placeholder="Anteckningstext (valfritt före «Anteckning»)…"
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
        />
        <div className="mt-2 flex gap-2">
          <input
            className="input-glass flex-1 text-sm"
            placeholder="Listpunkt…"
            value={newListItem}
            onChange={(e) => setNewListItem(e.target.value)}
          />
          <Button type="button" disabled={saving || !newListItem.trim()} variant="secondary" className="--secondary text-xs" onClick={() => { void addBlock('list', newListItem.trim()); setNewListItem(''); }}>
            + punkt
          </Button>
        </div>
      </div>
    </div>
  );
}
