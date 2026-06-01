import { Calendar, CalendarDays } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import type { PlaneringProviderConnection } from '../planeringInboxConnections';
import { PlaneringInboxConnectionCard } from './PlaneringInboxConnectionCard';

type Props = {
  calendar: PlaneringProviderConnection;
  disabled: boolean;
  onPrepare: () => void;
  onDisconnect: () => void;
};

/** Kalendervy — designad för Google Calendar-read när synk är live. */
export function PlaneringInkorgCalendarPanel({
  calendar,
  disabled,
  onPrepare,
  onDisconnect,
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
      >
        {prepared ? (
          <div className="planering-inbox-calendar-preview">
            <p className="text-sm text-text-muted">
              Read-only Google Calendar — möten, hämtning och deadlines i samma flöde som mejl
              → Handling.
            </p>
            <ul className="planering-inbox-calendar-preview__days" aria-hidden>
              {['Mån', 'Tis', 'Ons', 'Tor', 'Fre'].map((d) => (
                <li key={d} className="planering-inbox-calendar-preview__day">
                  <span className="planering-inbox-calendar-preview__day-label">{d}</span>
                  <span className="planering-inbox-calendar-preview__day-slot" />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-text-dim">
              ICS-export och push-påminnelser enligt PLANERINGSSIDA-SPEC (fas 2).
            </p>
          </div>
        ) : (
          <p className="text-sm text-text-dim">
            Förbered Google Kalender ovan — då kan veckan fyllas utan att du hoppar mellan appar.
          </p>
        )}
      </BentoCard>
    </div>
  );
}
