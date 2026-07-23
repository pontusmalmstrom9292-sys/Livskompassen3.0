import { useEffect, useState } from 'react';
import { usePlanningTasks } from '@/features/admin/planning/hooks/usePlanningTasks';
import { VaultService, getVaultEntryDate, type VaultHistoryEntry } from '@/core/firebase/VaultService';
import { hasVaultGate } from '@/core/auth/sessionService';
import { useStore } from '@/core/store';
import { CheckSquare, Lock, Mic, Clock, Sparkles } from 'lucide-react';
import { EmptyState } from '@/core/ui/EmptyState';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { IntakeTriageModal } from './IntakeTriageModal';

type VaultDisplayEntry = VaultHistoryEntry & { content: string; timestamp: Date };

type SelectedItem = {
  id: string;
  title?: string;
  content: string;
  summary?: string;
  source?: string;
  type: 'task' | 'vault';
  status?: string;
  projectId?: string;
} | null;

export function RecentIntakeWidget() {
  const { tasks, loading: tasksLoading, user } = usePlanningTasks();
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultSessionOpen = isVaultUnlocked || hasVaultGate();
  const [vaultEntries, setVaultEntries] = useState<VaultDisplayEntry[]>([]);
  const [vaultLoading, setVaultLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  useEffect(() => {
    if (!user?.uid || !vaultSessionOpen) {
      setVaultEntries([]);
      setVaultLoading(false);
      return;
    }

    setVaultLoading(true);
    const unsubscribe = VaultService.initializeVaultListener(user.uid, (data) => {
      const mapped: VaultDisplayEntry[] = data.map((item) => {
        const content = item.content ?? item.text ?? item.observation ?? item.label ?? 'Ingen text';
        const timestamp = getVaultEntryDate(item);
        return { ...item, content, timestamp };
      });
      setVaultEntries(mapped.slice(0, 3));
      setVaultLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, vaultSessionOpen]);

  const unresolvedTasks = tasks
    .filter((task) => task.status === 'todo')
    .slice(0, 5);

  const hasTasks = unresolvedTasks.length > 0;
  const hasVault = vaultSessionOpen && vaultEntries.length > 0;
  const showVaultColumn = vaultSessionOpen;

  if (!user) return null;

  return (
    <div className="dashboard-card w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md transition-[border-color,box-shadow] focus-within:border-accent/35 focus-within:ring-1 focus-within:ring-accent/20">
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <Sparkles className="w-5 h-5 text-accent-ai animate-pulse" />
        <div>
          <h2 className="text-xl font-medium text-white/90">Senaste Intaget</h2>
          <p className="text-xs text-text-muted mt-0.5">Analys och arkivering från röstagenten i realtid</p>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${showVaultColumn ? 'md:grid-cols-2' : ''} gap-8`}>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-text-muted border-b border-white/5 pb-2">
            <CheckSquare className="w-4 h-4 text-accent/80" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Aktiv Planering</h3>
          </div>

          {tasksLoading ? (
            <HubPanelSkeleton label="Hämtar planering…" lines={3} />
          ) : !hasTasks ? (
            <EmptyState
              className="border-dashed border-border/25 bg-surface-2/30 py-6 text-center shadow-none"
              message="Inga aktiva uppgifter just nu."
            />
          ) : (
            <div className="space-y-3">
              {unresolvedTasks.map((task) => {
                const isVoice = task.source === 'voice_to_vault';
                return (
                  <button
                    type="button"
                    key={task.id}
                    onClick={() =>
                      setSelectedItem({
                        id: task.id,
                        title: task.title,
                        content: task.title,
                        summary: task.summary || '',
                        source: task.source,
                        type: 'task',
                        status: task.status,
                        projectId: task.projectId || '',
                      })
                    }
                    className="group flex w-full min-h-11 cursor-pointer items-start justify-between gap-3 rounded-xl border border-border/40 bg-surface-2 p-3 text-left transition-all duration-[var(--ds-duration-fast)] hover:border-border hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {isVoice ? (
                        <Mic className="w-4 h-4 text-accent-ai shrink-0 mt-0.5" />
                      ) : (
                        <CheckSquare className="w-4 h-4 text-text-muted group-hover:text-text-muted shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-white/95 font-medium leading-normal break-words">{task.title}</p>
                        {task.summary && (
                          <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{task.summary}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isVoice && (
                        <span className="text-[10px] bg-accent-ai/10 text-accent-ai border border-accent-ai/20 px-2 py-0.5 rounded-full font-medium">
                          Röst
                        </span>
                      )}
                      {task.createdAt && (
                        <span className="text-[10px] text-text-muted font-mono">
                          {new Date(task.createdAt).toLocaleDateString('sv-SE', {
                            month: 'numeric',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {showVaultColumn && (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-text-muted border-b border-white/5 pb-2">
              <Lock className="w-4 h-4 text-accent/80" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Senaste poster</h3>
            </div>

            {vaultLoading ? (
              <HubPanelSkeleton label="Hämtar poster…" lines={2} />
            ) : !hasVault ? (
              <EmptyState
                className="border-dashed border-border/25 bg-surface-2/30 py-6 text-center shadow-none"
                message="Inga poster än."
              />
            ) : (
              <div className="space-y-3">
                {vaultEntries.map((record) => {
                  const isVoice = record.source === 'voice_to_vault';
                  const confidence = record.confidence != null ? Math.round(record.confidence * 100) : null;

                  return (
                    <button
                      type="button"
                      key={record.id}
                      onClick={() =>
                        setSelectedItem({
                          id: record.id,
                          content: record.content,
                          source: record.source,
                          type: 'vault',
                        })
                      }
                      className="group relative flex w-full min-h-11 cursor-pointer flex-col space-y-2 overflow-hidden rounded-xl border border-border/40 bg-surface-2 p-3.5 text-left transition-all duration-[var(--ds-duration-fast)] hover:border-border hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-muted">
                          <Clock className="w-3 h-3 text-text-muted" />
                          <span>{record.timestamp ? record.timestamp.toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' }) : 'Okänt datum'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isVoice && confidence !== null && (
                            <span className="text-[10px] text-accent-ai bg-accent-ai/10 border border-accent-ai/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              {confidence}% tillförlitlighet
                            </span>
                          )}
                          <Lock size={12} className="text-text-muted group-hover:text-text-muted transition-colors" />
                        </div>
                      </div>

                      <div className="text-sm text-white/90 leading-relaxed font-sans font-normal whitespace-pre-wrap">
                        {record.content}
                      </div>

                      {isVoice && record.truth && record.truth !== record.content && (
                        <div className="pt-2 mt-1 border-t border-white/5">
                          <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Ursprunglig transkription</p>
                          <p className="text-xs text-text-muted italic mt-0.5 break-words">&quot;{record.truth}&quot;</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <IntakeTriageModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        userId={user.uid}
      />
    </div>
  );
}
