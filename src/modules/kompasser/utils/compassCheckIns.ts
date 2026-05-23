import type { CheckInRow } from '../../core/firebase/firestore';
import type { CompassFlow } from './compassTime';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function isTodayCheckIn(row: CheckInRow): boolean {
  return row.createdAt?.slice(0, 10) === todayKey();
}

function matchesFlow(row: CheckInRow, flow: Extract<CompassFlow, 'day' | 'evening'>): boolean {
  if (flow === 'day') {
    return row.taskCategory === 'day' || row.questionId === 'compass_day';
  }
  return (
    row.taskCategory === 'evening' ||
    row.questionId === 'compass_evening' ||
    row.optionSelected === 'kasam'
  );
}

export function findTodayCheckInForFlow(
  rows: CheckInRow[],
  flow: Extract<CompassFlow, 'day' | 'evening'>,
): CheckInRow | undefined {
  return rows.find((row) => isTodayCheckIn(row) && matchesFlow(row, flow));
}
