import { useState, useEffect } from 'react';
import { X, CheckSquare, FolderPlus, Lock, Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
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

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSummary, setTaskSummary] = useState('');
  const [taskStatus, setTaskStatus] = useState<'todo' | 'waiting' | 'done'>('todo');
  const [taskProjectId, setTaskProjectId] = useState('');

  // Project form state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectStatus, setProjectStatus] = useState<'active' | 'paused' | 'archived'>('active');

  // Vault form state
  const [vaultContent, setVaultContent] = useState('');

  // Get active projects for dropdown
  const { projects, loading: projectsLoading } = useActiveProjects();

  // Reset/populate form fields when item changes
  useEffect(() => {
    if (item) {
      const displayContent = item.content || item.title || '';
      setTaskTitle(displayContent);
      setTaskSummary(item.summary || '');
      setTaskStatus((item.status as any) || 'todo');
      setTaskProjectId(item.projectId || '');

      setProjectTitle(displayContent);
      setProjectStatus('active');

      setVaultContent(displayContent);
      
      // Default tab: if it's already a task, default to 'task' (to update).
      // If it's a vault entry, we default to 'task' to categorize it.
      setActiveTab('task');
      setErrorMsg(null);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSaveTask = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      if (item.type === 'task') {
        // Update existing task doc in planning_tasks
        const taskRef = doc(db, 'planning_tasks', item.id);
        await updateDoc(taskRef, {
          title: taskTitle.trim(),
          status: taskStatus,
          summary: taskSummary.trim() || undefined,
          projectId: taskProjectId || undefined,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new task doc
        await createPlanningTask(userId, {
          title: taskTitle.trim(),
          status: taskStatus,
          source: (item.source as any) || 'voice_to_vault',
          summary: taskSummary.trim() || undefined,
          projectId: taskProjectId || undefined,
        });
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Kunde inte spara uppgiften.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      // Create project doc in projects collection
      const projectRef = await addDoc(collection(db, 'projects'), {
        userId,
        ownerId: userId,
        title: projectTitle.trim(),
        status: projectStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // If the triage item is a task, link the task to this new project
      if (item.type === 'task') {
        const taskRef = doc(db, 'planning_tasks', item.id);
        await updateDoc(taskRef, {
          projectId: projectRef.id,
          updatedAt: serverTimestamp(),
        });
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Kunde inte skapa projektet.');
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
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Kunde inte spara i valvet.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-obsidian-bg/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-surface-1 border border-border-strong shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-accent-ai/5 to-transparent pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent-ai/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-border/30 bg-surface-2/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-accent-ai/10 rounded-xl border border-accent-ai/20">
              <Sparkles className="w-5 h-5 text-accent-ai animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-medium tracking-wide text-white">Triage & Dirigering</h2>
              <p className="text-xs text-text-muted font-light tracking-widest uppercase">Kategorisera rått intag</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-white hover:bg-surface-3 rounded-full transition-colors"
            aria-label="Stäng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-surface-3">
          
          {/* Raw Intake Preview */}
          <div className="bg-surface-2/70 border border-border/30 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-text-dim uppercase tracking-wider font-mono">
              <span>Källa: {item.source === 'voice_to_vault' ? 'Röstagent' : 'Manuell / System'}</span>
              <span>Typ: {item.type === 'task' ? 'Uppgift' : 'Valv-post'}</span>
            </div>
            <div className="text-sm text-white/90 leading-relaxed italic break-words">
              "{item.content}"
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex bg-surface-2/50 border border-border-strong rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('task')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'task'
                  ? 'bg-accent/15 text-accent border border-accent/20'
                  : 'text-text-muted hover:text-white hover:bg-surface-3/50'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Uppgift
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('project')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'project'
                  ? 'bg-accent/15 text-accent border border-accent/20'
                  : 'text-text-muted hover:text-white hover:bg-surface-3/50'
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              Projekt
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'vault'
                  ? 'bg-accent/15 text-accent border border-accent/20'
                  : 'text-text-muted hover:text-white hover:bg-surface-3/50'
              }`}
            >
              <Lock className="w-4 h-4" />
              Valvet
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Forms */}
          {activeTab === 'task' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1.5 block">
                  Titel
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-surface-3/50 border border-border-strong rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                  placeholder="Skriv en titel..."
                />
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1.5 block">
                  Beskrivning / Sammanfattning (Valfritt)
                </label>
                <textarea
                  value={taskSummary}
                  onChange={(e) => setTaskSummary(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-3/50 border border-border-strong rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                  placeholder="Skriv en kort sammanfattning..."
                />
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider mb-2 block">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['todo', 'waiting', 'done'] as const).map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setTaskStatus(statusOption)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-mono uppercase tracking-wider transition-all ${
                        taskStatus === statusOption
                          ? 'bg-accent/15 text-accent border-accent/40 shadow-sm'
                          : 'bg-surface-3/30 text-text-dim border-border-strong hover:text-text-muted'
                      }`}
                    >
                      {statusOption === 'todo' ? 'Att göra' : statusOption === 'waiting' ? 'Väntar' : 'Klar'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1.5 block">
                  Koppla till befintligt projekt (Valfritt)
                </label>
                {projectsLoading ? (
                  <div className="text-xs text-text-dim animate-pulse py-2">Laddar projekt...</div>
                ) : projects.length === 0 ? (
                  <div className="text-xs text-text-dim py-1">Inga aktiva projekt tillgängliga.</div>
                ) : (
                  <select
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    className="w-full bg-surface-3/50 border border-border-strong rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent/50 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-obsidian-bg text-text-dim">-- Inget projekt --</option>
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
                  className="w-full py-3.5 bg-accent hover:bg-accent/90 text-obsidian-bg disabled:bg-accent/40 disabled:text-obsidian-bg/50 rounded-xl font-medium tracking-wide transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckSquare className="w-4 h-4" />
                  )}
                  {item.type === 'task' ? 'Uppdatera Uppgift' : 'Spara som Uppgift'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'project' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1.5 block">
                  Projekttitel
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-surface-3/50 border border-border-strong rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                  placeholder="Skriv projekttitel..."
                />
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium uppercase tracking-wider mb-2 block">
                  Projektstatus
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['active', 'paused', 'archived'] as const).map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setProjectStatus(statusOption)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-mono uppercase tracking-wider transition-all ${
                        projectStatus === statusOption
                          ? 'bg-accent/15 text-accent border-accent/40 shadow-sm'
                          : 'bg-surface-3/30 text-text-dim border-border-strong hover:text-text-muted'
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
                  className="w-full py-3.5 bg-accent hover:bg-accent/90 text-obsidian-bg disabled:bg-accent/40 disabled:text-obsidian-bg/50 rounded-xl font-medium tracking-wide transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FolderPlus className="w-4 h-4" />
                  )}
                  Skapa Projekt
                </button>
              </div>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-4">
              {item.type === 'vault' ? (
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex gap-3 text-sm text-text-muted">
                  <Lock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white">Redan säkrad i Valvet</h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      Detta objekt är redan förseglat i Verklighetsvalvet (WORM) och kan inte skrivas över eller ändras. Du kan fortfarande konvertera det till en uppgift eller ett projekt under de andra flikarna.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex gap-3 text-sm text-yellow-200">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">WORM Dataintegritet</h4>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        Verklighetsvalvet tillämpar <strong>Write Once, Read Many (WORM)</strong>. När denna post väl har förseglats kan den aldrig raderas, redigeras eller skrivas över.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1.5 block">
                      Innehåll att försegla
                    </label>
                    <textarea
                      value={vaultContent}
                      onChange={(e) => setVaultContent(e.target.value)}
                      rows={4}
                      className="w-full bg-surface-3/50 border border-border-strong rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                      placeholder="Skriv det som ska förseglas..."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isSaving || !vaultContent.trim()}
                      onClick={handleSaveVault}
                      className="w-full py-3.5 bg-accent hover:bg-accent/90 text-obsidian-bg disabled:bg-accent/40 disabled:text-obsidian-bg/50 rounded-xl font-medium tracking-wide transition-all flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      Försegla i Valvet (WORM)
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
