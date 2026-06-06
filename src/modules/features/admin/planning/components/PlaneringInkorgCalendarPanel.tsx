import { Calendar, CalendarDays } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import type { PlaneringProviderConnection } from '../planeringInboxConnections';
import type { PlanningTask } from '../types';
import { PlaneringInboxConnectionCard } from './PlaneringInboxConnectionCard';
import { PlaneringWeekCalendar } from './PlaneringWeekCalendar';

type Props = {
  calendar: PlaneringProviderConnection;
  disabled: boolean;
  onPrepare: () => void;
  onDisconnect: () => void;
  tasks?: PlanningTask[];
};

/** Kalendervy — designad för Google Calendar-read när synk är live. */
export function PlaneringInkorgCalendarPanel({
  calendar,
  disabled,
  onPrepare,
  onDisconnect,
  tasks = [],
}: Props) {
  const prepared = calendar.phase === 'prepared';

  return (
    <div className="space-y-4">
      <PlaneringInboxConnectionCard
        provider="google_calendar"
        icon={Calendar}
        connection={calendar}
        disabled={disabled}
        onPrepare={onPrepare}
        onDisconnect={onDisconnect}
      />

      <BentoCard
        title="Veckovy"
        description={prepared ? 'Händelser visas här efter synk' : 'Koppla kalender ovan'}
        icon={<CalendarDays className="h-4 w-4" />}
        glow="gold"
      >
        {prepared ? (
          <PlaneringWeekCalendar tasks={tasks} prepared />
        ) : (
          <p className="text-sm text-text-dim">
            Förbered Google Kalender ovan — då kan veckan fyllas utan att du hoppar mellan appar.
          </p>
        )}
      </BentoCard>
    </div>
  );
}
