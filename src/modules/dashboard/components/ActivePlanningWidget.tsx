import { useState } from 'react';
import { usePlanningTasks } from '@/features/admin/planning/hooks/usePlanningTasks';
import { useActiveProjects } from '@/features/admin/projects/hooks/useProjects';
import { CheckSquare, Folder, Check } from 'lucide-react';
import { EmptyState } from '@/core/ui/EmptyState';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';

export function ActivePlanningWidget() {
  const { tasks, loading: tasksLoading, moveTask, user } = usePlanningTasks();
  const { projects, loading: projectsLoading } = useActiveProjects();
  const [completingIds, setCompletingIds] = useState<string[]>([]);

  if (!user) return null;

  const handleCompleteTask = async (taskId: string) => {
    setCompletingIds((prev) => [...prev, taskId]);
    try {
      await moveTask(taskId, 'done');
    } catch (err) {
      console.error('Failed to complete task:', err);
      // Revert if error occurs
      setCompletingIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  // Filter tasks to show only active ones (todo/waiting) that are not currently completing
  const activeTasks = tasks
    .filter(
      (task) =>
        (task.status === 'todo' || task.status === 'waiting') &&
        !completingIds.includes(task.id)
    )
    .slice(0, 5);

  const activeProjects = projects.slice(0, 5);

  const hasTasks = activeTasks.length > 0;
  const hasProjects = activeProjects.length > 0;

  // Project map for title lookup
  const projectMap = new Map(projects.map((p) => [p.id, p.title]));

  return (
    <div className="dashboard-card w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md transition-[border-color,box-shadow] focus-within:border-accent/35 focus-within:ring-1 focus-within:ring-accent/20">
      {/* Widget Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <Folder className="w-5 h-5 text-accent animate-pulse" />
        <div>
          <h2 className="text-xl font-medium text-white/90">Aktivt Arbetsflöde</h2>
          <p className="text-xs text-text-muted mt-0.5">Din workbench för pågående projekt och prioriterade uppgifter</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Active Tasks */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-text-muted border-b border-white/5 pb-2">
            <CheckSquare className="w-4 h-4 text-accent/80" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Prioriterade Uppgifter</h3>
          </div>

          {tasksLoading ? (
            <HubPanelSkeleton label="Hämtar uppgifter…" lines={3} />
          ) : !hasTasks ? (
            <EmptyState
              className="border-dashed border-border/25 bg-surface-2/30 py-6 text-center shadow-none"
              title="Klart för nu"
              message="Alla uppgifter avklarade. Snyggt jobbat!"
            />
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-surface-2 border border-border/40 hover:border-border transition-all duration-[var(--ds-duration-fast)] hover:bg-surface-3 group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleCompleteTask(task.id)}
                      className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/20 transition-all duration-[var(--ds-duration-fast)] hover:border-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 group/check"
                      aria-label={`Markera uppgift som klar: ${task.title}`}
                    >
                      <Check className="h-3.5 w-3.5 text-accent opacity-0 transition-opacity group-hover/check:opacity-100" aria-hidden />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm text-white/95 font-medium leading-normal break-words">
                        {task.title}
                      </p>
                      {task.summary && (
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-1 break-words">{task.summary}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {task.status === 'waiting' && (
                      <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded-full font-medium">
                        Väntar
                      </span>
                    )}
                    {task.projectId && projectMap.has(task.projectId) && (
                      <span className="text-[10px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-medium max-w-[100px] truncate">
                        {projectMap.get(task.projectId)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active Projects */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-text-muted border-b border-white/5 pb-2">
            <Folder className="w-4 h-4 text-accent/80" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Pågående Projekt</h3>
          </div>

          {projectsLoading ? (
            <HubPanelSkeleton label="Hämtar projekt…" lines={3} />
          ) : !hasProjects ? (
            <EmptyState
              className="border-dashed border-border/25 bg-surface-2/30 py-6 text-center shadow-none"
              message="Inga pågående projekt just nu."
            />
          ) : (
            <div className="space-y-3">
              {activeProjects.map((project) => {
                // Count active/waiting tasks belonging to this project
                const projectTaskCount = tasks.filter(
                  (t) => t.projectId === project.id && (t.status === 'todo' || t.status === 'waiting')
                ).length;

                return (
                  <div
                    key={project.id}
                    className="p-3.5 rounded-xl bg-surface-2 border border-border/40 hover:border-border transition-all duration-[var(--ds-duration-fast)] hover:bg-surface-3 flex flex-col space-y-1 group"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="text-sm font-medium text-white/95 leading-normal break-words">
                        {project.title}
                      </h4>
                      <span className="text-[10px] bg-accent-ai/10 text-accent-ai border border-accent-ai/20 px-2.5 py-0.5 rounded-full font-medium shrink-0">
                        {projectTaskCount} {projectTaskCount === 1 ? 'uppgift' : 'uppgifter'}
                      </span>
                    </div>
                    {project.createdAt && (
                      <span className="text-[10px] text-text-muted font-mono">
                        Skapat:{' '}
                        {new Date(project.createdAt).toLocaleDateString('sv-SE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
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
