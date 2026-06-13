import { useEffect, useState } from 'react';
import { usePlanningTasks } from '@/features/admin/planning/hooks/usePlanningTasks';
import { VaultService } from '@/core/firebase/VaultService';
import { CheckSquare, Lock, Mic, Clock, Sparkles } from 'lucide-react';

export function RecentIntakeWidget() {
  const { tasks, loading: tasksLoading, user } = usePlanningTasks();
  const [vaultEntries, setVaultEntries] = useState<any[]>([]);
  const [vaultLoading, setVaultLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setVaultEntries([]);
      setVaultLoading(false);
      return;
    }

    setVaultLoading(true);
    const unsubscribe = VaultService.initializeVaultListener(user.uid, (data) => {
      // Mappa datan för att säkerställa fältnamn och datum
      const mapped = data.map((item) => {
        const content = item.content || item.text || item.observation || item.label || 'Ingen text';
        const timestamp = item.timestamp
          ? (item.timestamp.toDate ? item.timestamp.toDate() : new Date(item.timestamp))
          : (item.createdAt ? new Date(item.createdAt) : new Date());
        return {
          ...item,
          content,
          timestamp,
        };
      });
      setVaultEntries(mapped.slice(0, 3));
      setVaultLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Filtrera fram de 3-5 senaste olösta uppgifterna (todo/pending)
  const unresolvedTasks = tasks
    .filter((task) => task.status === 'todo')
    .slice(0, 5);

  const hasTasks = unresolvedTasks.length > 0;
  const hasVault = vaultEntries.length > 0;

  if (!user) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg w-full">
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <Sparkles className="w-5 h-5 text-accent-ai animate-pulse" />
        <div>
          <h2 className="text-xl font-medium text-white/90">Senaste Intaget</h2>
          <p className="text-xs text-text-dim mt-0.5">Analys och arkivering från röstagenten i realtid</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vänster spalt: Planeringsuppgifter */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-text-muted border-b border-white/5 pb-2">
            <CheckSquare className="w-4 h-4 text-accent/80" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Aktiv Planering</h3>
          </div>

          {tasksLoading ? (
            <div className="space-y-3 flex-1 justify-center py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !hasTasks ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-white/5 rounded-xl border border-white/5 border-dashed">
              <p className="text-sm text-text-dim">Inga aktiva uppgifter just nu.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unresolvedTasks.map((task) => {
                const isVoice = task.source === 'voice_to_vault';
                return (
                  <div
                    key={task.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-surface-2 border border-border/40 hover:border-border transition-all hover:bg-surface-3 group"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {isVoice ? (
                        <Mic className="w-4 h-4 text-accent-ai shrink-0 mt-0.5" />
                      ) : (
                        <CheckSquare className="w-4 h-4 text-text-dim group-hover:text-text-muted shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm text-white/95 font-medium leading-normal break-words">{task.title}</p>
                        {task.summary && (
                          <p className="text-xs text-text-dim mt-0.5 line-clamp-1">{task.summary}</p>
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
                        <span className="text-[10px] text-text-dim font-mono">
                          {new Date(task.createdAt).toLocaleDateString('sv-SE', {
                            month: 'numeric',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Höger spalt: Valvet */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-text-muted border-b border-white/5 pb-2">
            <Lock className="w-4 h-4 text-accent/80" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Verklighetsvalvet (WORM)</h3>
          </div>

          {vaultLoading ? (
            <div className="space-y-3 flex-1 justify-center py-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !hasVault ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-white/5 rounded-xl border border-white/5 border-dashed">
              <p className="text-sm text-text-dim">Valvet är tomt. Inga förseglade poster än.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vaultEntries.map((record) => {
                const isVoice = record.source === 'voice_to_vault';
                const confidence = record.confidence != null ? Math.round(record.confidence * 100) : null;
                
                return (
                  <div
                    key={record.id}
                    className="p-3.5 rounded-xl bg-surface-2 border border-border/40 hover:border-border transition-all hover:bg-surface-3 flex flex-col space-y-2 relative overflow-hidden group"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-dim">
                        <Clock className="w-3 h-3 text-text-dim" />
                        <span>{record.timestamp ? record.timestamp.toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' }) : 'Okänt datum'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isVoice && confidence !== null && (
                          <span className="text-[10px] text-accent-ai bg-accent-ai/10 border border-accent-ai/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            {confidence}% tillförlitlighet
                          </span>
                        )}
                        <Lock size={12} className="text-text-dim group-hover:text-text-muted transition-colors" />
                      </div>
                    </div>

                    <div className="text-sm text-white/90 leading-relaxed font-sans font-normal whitespace-pre-wrap">
                      {record.content}
                    </div>

                    {isVoice && record.truth && record.truth !== record.content && (
                      <div className="pt-2 mt-1 border-t border-white/5">
                        <p className="text-[10px] text-text-dim uppercase tracking-wider font-semibold">Ursprunglig transkription</p>
                        <p className="text-xs text-text-dim italic mt-0.5 break-words">"{record.truth}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
