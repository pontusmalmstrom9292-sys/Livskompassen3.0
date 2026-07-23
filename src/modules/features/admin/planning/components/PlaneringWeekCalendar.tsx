import { Button } from '@/design-system';
import type { PlanningTask } from '../types';
import {
  countPlaneringIcsExportable,
  downloadPlaneringIcs,
} from '../utils/exportPlaneringIcs';
import { getPlaneringWeekDays } from '../utils/planeringWeekDays';
import { isPlanningTaskOverdue } from '../utils/planningDueDate';

type Props = {
  tasks: PlanningTask[];
  prepared?: boolean;
};

/** Veckovy — uppgifter med dueAt i aktuell vecka (P2, utan Google OAuth). */
export function PlaneringWeekCalendar({ tasks, prepared = true }: Props) {
  const days = getPlaneringWeekDays();
  const weekIsos = new Set(days.map((d) => d.iso));

  const exportableCount = countPlaneringIcsExportable(tasks);
  const byDay = new Map<string, PlanningTask[]>();
  for (const task of tasks) {
    if (!task.dueAt || task.status === 'done') continue;
    const iso = task.dueAt.slice(0, 10);
    if (!weekIsos.has(iso)) continue;
    const list = byDay.get(iso) ?? [];
    list.push(task);
    byDay.set(iso, list);
  }

  return (
    <div className="planering-inbox-calendar-preview">
      <p className="text-sm text-text-muted">
        {prepared
          ? 'Deadlines från Handling denna vecka. Google Calendar-synk kommer i senare fas.'
          : 'Koppla kalender ovan — veckan fylls med deadlines från dina uppgifter.'}
      </p>
      <ul className="planering-inbox-calendar-preview__days">
        {days.map((day) => {
          const dayTasks = byDay.get(day.iso) ?? [];
          return (
            <li key={day.iso} className="planering-inbox-calendar-preview__day">
              <span
                className={`planering-inbox-calendar-preview__day-label ${
                  day.isToday ? 'text-accent' : ''
                }`}
              >
                {day.label}
              </span>
              <div className="planering-inbox-calendar-preview__day-slot flex flex-col gap-1 p-1.5">
                {dayTasks.length === 0 ? (
                  <span className="text-[10px] text-text-muted">—</span>
                ) : (
                  dayTasks.map((task) => (
                    <span
                      key={task.id}
                      className={`rounded-md border px-1.5 py-0.5 text-[10px] leading-snug ${
                        isPlanningTaskOverdue(task.dueAt, task.status)
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-100/90'
                          : 'border-border/40 bg-surface-3/60 text-text-muted'
                      }`}
                      title={task.title}
                    >
                      {task.microStep ?? task.title}
                    </span>
                  ))
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="disabled:opacity-40 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          disabled={exportableCount === 0}
          onClick={() => downloadPlaneringIcs(tasks)}
        >
          Exportera ICS ({exportableCount})
        </Button>
        <span className="text-xs text-text-muted">
          Manuell kalender — riktiga deadlines, inga mock-händelser.
        </span>
      </div>
    </div>
  );
}
