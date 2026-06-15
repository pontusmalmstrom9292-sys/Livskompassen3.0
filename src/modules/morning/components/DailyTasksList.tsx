import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listenPlanningTasks, updatePlanningTask } from '@/modules/features/admin/planning/api/planningTasksApi';
import type { PlanningTask } from '@/modules/features/admin/planning/types';
import { useStore } from '@/modules/core/store';
import { CheckCircle2, Circle, Loader2, Sparkles } from 'lucide-react';

export function DailyTasksList() {
  const user = useStore(state => state.user);
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completingTaskIds, setCompletingTaskIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = listenPlanningTasks(user.uid, (allTasks) => {
      // Filtrera fram endast 'todo'-uppgifter för denna dags-vy.
      // Uppgifter som nyligen bockats av försvinner vid nästa snapshot.
      const activeTasks = allTasks.filter(t => t.status === 'todo');
      setTasks(activeTasks);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleCompleteTask = async (taskId: string) => {
    if (!user?.uid) return;
    
    // Sätt en lokal 'loading'-state för just denna uppgift för smidig UX
    setCompletingTaskIds(prev => new Set(prev).add(taskId));
    
    try {
      await updatePlanningTask(user.uid, taskId, { status: 'done' });
      // Låt Firestore snapshot hantera borttagningen från listan
    } catch (error) {
      console.error('Kunde inte markera uppgiften som klar:', error);
      // Om det misslyckas, ta bort från completing
      setCompletingTaskIds(prev => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/20" />
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <h3 className="font-display-serif text-lg text-text">Dagens Uppgifter</h3>
      </div>
      
      {tasks.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/5 p-6 text-center">
          <p className="text-sm text-white/40">Inga öppna uppgifter i din inkorg. Njut av dagen!</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {tasks.map(task => {
              const isCompleting = completingTaskIds.has(task.id);
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="group flex items-center justify-between rounded-xl border border-white/5 bg-surface-2 p-4 transition-colors hover:border-accent/30"
                >
                  <div className="flex flex-col gap-1">
                    <p className={`text-base transition-colors ${isCompleting ? 'text-white/30 line-through' : 'text-white/90'}`}>
                      {task.title}
                    </p>
                    {task.summary && (
                      <p className={`text-sm ${isCompleting ? 'text-white/20' : 'text-white/40'}`}>
                        {task.summary}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={isCompleting}
                    className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-accent/50 transition-colors hover:bg-accent/10 hover:text-accent disabled:opacity-50"
                    aria-label="Markera som klar"
                  >
                    {isCompleting ? (
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
