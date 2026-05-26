import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../core/firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../../core/types/firestore';
import { useStore } from '../../core/store';
import { createPlanningTask } from '../../planering/api/planningTasksApi';
import { listenProjectBlocks, createProjectBlock } from '../api/projectBlocksApi';
import { updateProjectTitle } from '../api/projectsApi';
import type { Project, ProjectBlock, ProjectBlockType } from '../types';

const BLOCK_LABELS: Record<ProjectBlockType, string> = {
  list: 'Lista',
  note: 'Anteckning',
  image: 'Bild',
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

  const addBlock = async (type: ProjectBlockType, title: string, content?: string) => {
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
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara block.');
    } finally {
      setSaving(false);
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
      setError(err instanceof Error ? err.message : 'Kunde inte skapa uppgift.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för att öppna projekt.</p>;
  }

  if (loading) {
    return <p className="text-sm text-text-dim">Laddar projekt…</p>;
  }

  if (!project || !projectId) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-text-muted">Projektet hittades inte.</p>
        <Link to="/projekt" className="btn-pill--ghost text-sm">
          Tillbaka
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="px-0.5">
        <Link to="/projekt" className="text-xs text-text-dim hover:text-accent">
          ← Projekt
        </Link>
        <input
          className="input-glass mt-2 w-full text-lg font-semibold"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          onBlur={() => void updateProjectTitle(user.uid, projectId, project.title)}
        />
        <p className="mt-1 text-xs text-text-muted">
          Uppgifter med status hamnar i{' '}
          <Link to={`/planering?projectId=${projectId}`} className="text-accent">
            Handling
          </Link>
        </p>
      </header>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="home-module-stack">
        {blocks.length === 0 && (
          <p className="text-sm text-text-dim">Inga block än — lägg till nedan.</p>
        )}
        {blocks.map((block) => (
          <div key={block.id} className="elongated-module p-3 text-sm">
            <p className="text-[10px] uppercase tracking-widest text-text-dim">
              {BLOCK_LABELS[block.type]}
            </p>
            <p className="mt-1 font-medium text-text">{block.title}</p>
            {block.content && <p className="mt-1 whitespace-pre-wrap text-text-muted">{block.content}</p>}
            {block.type === 'task' && block.planningTaskId && (
              <Link
                to={`/planering?projectId=${projectId}`}
                className="btn-pill--secondary mt-2 inline-flex text-xs"
              >
                Öppna i kanban
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-xl border border-white/10 p-3">
        <p className="text-[10px] uppercase tracking-widest text-text-dim">Lägg till block</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            className="btn-pill--secondary text-xs"
            onClick={() => {
              const title = window.prompt('Rubrik för lista:', 'Min lista');
              if (title?.trim()) void addBlock('list', title.trim());
            }}
          >
            Lista
          </button>
          <button
            type="button"
            disabled={saving}
            className="btn-pill--secondary text-xs"
            onClick={() => void addBlock('note', 'Anteckning', noteDraft || undefined)}
          >
            Anteckning
          </button>
          <button
            type="button"
            disabled={saving}
            className="btn-pill--accent text-xs"
            onClick={() => void addKanbanTask()}
          >
            Uppgift → Handling
          </button>
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
          <button
            type="button"
            disabled={saving || !newListItem.trim()}
            className="btn-pill--secondary text-xs"
            onClick={() => {
              void addBlock('list', newListItem.trim());
              setNewListItem('');
            }}
          >
            + punkt
          </button>
        </div>
      </div>
    </div>
  );
}
