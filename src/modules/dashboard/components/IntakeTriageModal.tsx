import { useState, useEffect } from 'react';
import { X, CheckSquare, FolderPlus, Lock, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import { Modal } from '@/design-system';
import { createPlanningTask } from '@/features/admin/planning/api/planningTasksApi';
import { useActiveProjects } from '@/features/admin/projects/hooks/useProjects';
import { VaultService } from '@/core/firebase/VaultService';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';

interface IntakeTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title?: string;
    content: string;
    summary?: string;
    source?: string;
    type: 'task' | 'vault';
    status?: string;
    projectId?: string;
  } | null;
  userId: string;
}

export function IntakeTriageModal({ isOpen, onClose, item, userId }: IntakeTriageModalProps) {
  const [activeTab, setActiveTab] = useState<'task' | 'project' | 'vault'>('task');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskSummary, setTaskSummary] = useState('');
  const [taskStatus, setTaskStatus] = useState<'todo' | 'waiting' | 'done'>('todo');
  const [taskProjectId, setTaskProjectId] = useState('');

  const [projectTitle, setProjectTitle] = useState('');
  const [projectStatus, setProjectStatus] = useState<'active' | 'paused' | 'archived'>('active');

  const [vaultContent, setVaultContent] = useState('');

  const { projects, loading: projectsLoading } = useActiveProjects();

  useEffect(() => {
    if (item) {
      const displayContent = item.content || item.title || '';
      setTaskTitle(displayContent);
      setTaskSummary(item.summary || '');
      setTaskStatus((item.status as 'todo' | 'waiting' | 'done') || 'todo');
      setTaskProjectId(item.projectId || '');

      setProjectTitle(displayContent);
      setProjectStatus('active');

      setVaultContent(displayContent);
      setActiveTab('task');
      setErrorMsg(null);
    }
  }, [item]);

  if (!item) return null;

  const handleSaveTask = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      if (item.type === 'task') {
        const taskRef = doc(db, 'planning_tasks', item.id);
        await updateDoc(taskRef, {
          title: taskTitle.trim(),
          status: taskStatus,
          summary: taskSummary.trim() || undefined,
          projectId: taskProjectId || undefined,
          updatedAt: serverTimestamp(),
        });
      } else {
        await createPlanningTask(userId, {
          title: taskTitle.trim(),
          status: taskStatus,
          source: (item.source as 'voice_to_vault' | 'manual') || 'voice_to_vault',
          summary: taskSummary.trim() || undefined,
          projectId: taskProjectId || undefined,
        });
      }
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Kunde inte spara uppgiften.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const projectRef = await addDoc(collection(db, 'projects'), {
        userId,
        ownerId: userId,
        title: projectTitle.trim(),
        status: projectStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (item.type === 'task') {
        const taskRef = doc(db, 'planning_tasks', item.id);
        await updateDoc(taskRef, {
          projectId: projectRef.id,
          updatedAt: serverTimestamp(),
        });
      }
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Kunde inte skapa projektet.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveVault = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await VaultService.saveRecord(userId, {
        action: 'inkast_triage',
        truth: vaultContent.trim(),
        category: item.source || 'manual',
        entryType: 'simple',
      });
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Kunde inte spara i valvet.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      ariaLabel="Triage och dirigering"
      hideHeader
      className="z-[110]"
      panelClassName="flex max-h-[90vh] max-w-lg flex-col overflow-hidden rounded-3xl border border-border-strong bg-surface p-0 shadow-2xl"
    >
      <div className="relative flex max-h-[90vh] flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent-ai/5 to-transparent" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent-ai/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between border-b border-border/30 bg-surface-2/80 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-accent-ai/20 bg-accent-ai/10 p-2.5">
              <Sparkles className="h-5 w-5 animate-pulse text-accent-ai" />
            </div>
            <div>
              <h2 className="text-xl font-medium tracking-wide text-white">Triage & Dirigering</h2>
              <p className="text-xs font-light uppercase tracking-widest text-text-muted">Kategorisera rått intag</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-muted transition-colors hover:bg-surface-3 hover:text-white"
            aria-label="Stäng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative z-10 flex-1 space-y-6 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-surface-3 md:p-8">
          <div className="space-y-2 rounded-2xl border border-border/30 bg-surface-2/70 p-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-text-dim">
              <span>Källa: {item.source === 'voice_to_vault' ? 'Röstagent' : 'Manuell / System'}</span>
              <span>Typ: {item.type === 'task' ? 'Uppgift' : 'Valv-post'}</span>
            </div>
            <div className="break-words text-sm italic leading-relaxed text-white/90">&quot;{item.content}&quot;</div>
          </div>

          <div className="flex gap-1 rounded-xl border border-border-strong bg-surface-2/50 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('task')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                activeTab === 'task'
                  ? 'border border-accent/20 bg-accent/15 text-accent'
                  : 'text-text-muted hover:bg-surface-3/50 hover:text-white'
              }`}
            >
              <CheckSquare className="h-4 w-4" />
              Uppgift
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('project')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                activeTab === 'project'
                  ? 'border border-accent/20 bg-accent/15 text-accent'
                  : 'text-text-muted hover:bg-surface-3/50 hover:text-white'
              }`}
            >
              <FolderPlus className="h-4 w-4" />
              Projekt
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                activeTab === 'vault'
                  ? 'border border-accent/20 bg-accent/15 text-accent'
                  : 'text-text-muted hover:bg-surface-3/50 hover:text-white'
              }`}
            >
              <Lock className="h-4 w-4" />
              Valvet
            </button>
          </div>

          {errorMsg && (
            <div className="flex gap-2 rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'task' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">Titel</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-border-strong bg-surface-3/50 px-4 py-3 text-sm text-white transition-all focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                  placeholder="Skriv en titel..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                  Beskrivning / Sammanfattning (Valfritt)
                </label>
                <textarea
                  value={taskSummary}
                  onChange={(e) => setTaskSummary(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-border-strong bg-surface-3/50 px-4 py-3 text-sm text-white transition-all focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                  placeholder="Skriv en kort sammanfattning..."
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['todo', 'waiting', 'done'] as const).map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setTaskStatus(statusOption)}
                      className={`rounded-lg border px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition-all ${
                        taskStatus === statusOption
                          ? 'border-accent/40 bg-accent/15 text-accent shadow-sm'
                          : 'border-border-strong bg-surface-3/30 text-text-dim hover:text-text-muted'
                      }`}
                    >
                      {statusOption === 'todo' ? 'Att göra' : statusOption === 'waiting' ? 'Väntar' : 'Klar'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                  Koppla till befintligt projekt (Valfritt)
                </label>
                {projectsLoading ? (
                  <div className="animate-pulse py-2 text-xs text-text-dim">Laddar projekt...</div>
                ) : projects.length === 0 ? (
                  <div className="py-1 text-xs text-text-dim">Inga aktiva projekt tillgängliga.</div>
                ) : (
                  <select
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-border-strong bg-surface-3/50 px-4 py-3 text-sm text-white transition-all focus:border-accent/50 focus:outline-none"
                  >
                    <option value="" className="bg-obsidian-bg text-text-dim">
                      -- Inget projekt --
                    </option>
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id} className="bg-obsidian-bg text-white">
                        {proj.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isSaving || !taskTitle.trim()}
                  onClick={handleSaveTask}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-medium tracking-wide text-obsidian-bg transition-all hover:bg-accent/90 disabled:bg-accent/40 disabled:text-obsidian-bg/50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckSquare className="h-4 w-4" />}
                  {item.type === 'task' ? 'Uppdatera Uppgift' : 'Spara som Uppgift'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'project' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                  Projekttitel
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full rounded-xl border border-border-strong bg-surface-3/50 px-4 py-3 text-sm text-white transition-all focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                  placeholder="Skriv projekttitel..."
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">Projektstatus</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['active', 'paused', 'archived'] as const).map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setProjectStatus(statusOption)}
                      className={`rounded-lg border px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition-all ${
                        projectStatus === statusOption
                          ? 'border-accent/40 bg-accent/15 text-accent shadow-sm'
                          : 'border-border-strong bg-surface-3/30 text-text-dim hover:text-text-muted'
                      }`}
                    >
                      {statusOption === 'active' ? 'Aktivt' : statusOption === 'paused' ? 'Pausat' : 'Arkiverat'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isSaving || !projectTitle.trim()}
                  onClick={handleSaveProject}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-medium tracking-wide text-obsidian-bg transition-all hover:bg-accent/90 disabled:bg-accent/40 disabled:text-obsidian-bg/50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />}
                  Skapa Projekt
                </button>
              </div>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-4">
              {item.type === 'vault' ? (
                <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-text-muted">
                  <Lock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <h4 className="font-medium text-white">Redan säkrad i Valvet</h4>
                    <p className="mt-1 text-xs leading-relaxed text-text-muted">
                      Detta objekt är redan förseglat i Verklighetsvalvet (WORM) och kan inte skrivas över eller ändras.
                      Du kan fortfarande konvertera det till en uppgift eller ett projekt under de andra flikarna.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
                    <div>
                      <h4 className="font-medium">WORM Dataintegritet</h4>
                      <p className="mt-1 text-xs leading-relaxed text-text-muted">
                        Verklighetsvalvet tillämpar <strong>Write Once, Read Many (WORM)</strong>. När denna post väl har
                        förseglats kan den aldrig raderas, redigeras eller skrivas över.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                      Innehåll att försegla
                    </label>
                    <textarea
                      value={vaultContent}
                      onChange={(e) => setVaultContent(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-border-strong bg-surface-3/50 px-4 py-3 text-sm text-white transition-all focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                      placeholder="Skriv det som ska förseglas..."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isSaving || !vaultContent.trim()}
                      onClick={handleSaveVault}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 font-medium tracking-wide text-obsidian-bg transition-all hover:bg-accent/90 disabled:bg-accent/40 disabled:text-obsidian-bg/50"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                      Försegla i Valvet (WORM)
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
