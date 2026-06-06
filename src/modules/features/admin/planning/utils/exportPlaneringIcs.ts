import type { PlanningTask } from '../types';

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const ymd = (iso: string) => iso.slice(0, 10).replace(/-/g, '');

export function countPlaneringIcsExportable(tasks: PlanningTask[]): number {
  return tasks.filter((t) => t.dueAt && t.status !== 'done').length;
}

/** RFC5545 VCALENDAR — open tasks with dueAt only, no mock events. */
export function buildPlaneringIcs(tasks: PlanningTask[]): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const head = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Livskompassen//Planering//SV', 'CALSCALE:GREGORIAN'];
  const events = tasks
    .filter((t) => t.dueAt && t.status !== 'done')
    .flatMap((t) => {
      const start = ymd(t.dueAt!);
      const endD = new Date(`${t.dueAt!.slice(0, 10)}T12:00:00`);
      endD.setDate(endD.getDate() + 1);
      const end = ymd(endD.toISOString());
      return [
        'BEGIN:VEVENT',
        `UID:${t.id}@livskompassen`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:${esc(t.microStep ?? t.title)}`,
        'END:VEVENT',
      ];
    });
  return [...head, ...events, 'END:VCALENDAR'].join('\r\n');
}

export function downloadPlaneringIcs(tasks: PlanningTask[]): void {
  if (countPlaneringIcsExportable(tasks) === 0) return;
  const blob = new Blob([buildPlaneringIcs(tasks)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'livskompassen-planering.ics';
  a.click();
  URL.revokeObjectURL(url);
}
