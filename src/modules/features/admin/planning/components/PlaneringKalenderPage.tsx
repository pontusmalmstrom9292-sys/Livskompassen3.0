import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { LivBackLink } from '@/modules/shell/LivBackLink';
import { usePlaneringInboxConnections } from '../hooks/usePlaneringInboxConnections';
import { usePlanningTasks } from '../hooks/usePlanningTasks';
import { PlaneringInboxConnectionCard } from './PlaneringInboxConnectionCard';
import { PlaneringWeekCalendar } from './PlaneringWeekCalendar';
import { Calendar } from 'lucide-react';

/** P2 — `/planering/kalender` veckovy (read-only tasks + förbered Google Calendar). */
export function PlaneringKalenderPage() {
  const user = useStore((s) => s.user);
  const { connections, prepare, disconnect } = usePlaneringInboxConnections();
  const { tasks, loading } = usePlanningTasks();
  const calendar = connections.google_calendar;
  const prepared = calendar.phase === 'prepared';
  const accountHint = user?.email ?? '';
  const canPrepare = Boolean(user && accountHint);

  return (
    <HubPageShell
      eyebrow="Göra"
      title="Kalender"
      lead="Vecka med deadlines från Handling — synk med Google Calendar förbereds utan OAuth i prod."
      headerAside={
        <div className="flex items-center gap-2">
          <LivBackLink />
          <Link
            to="/planering?tab=inkorg&inbox=kalender"
            className="btn-pill--ghost shrink-0 p-2 text-xs text-text-muted hover:text-accent"
          >
            Inkorg
          </Link>
        </div>
      }
    >
      <PlaneringInboxConnectionCard
        provider="google_calendar"
        icon={Calendar}
        connection={calendar}
        disabled={!canPrepare}
        onPrepare={() => canPrepare && prepare('google_calendar', accountHint)}
        onDisconnect={() => disconnect('google_calendar')}
      />

      <BentoCard
        title="Veckovy"
        description={prepared ? 'Denna vecka' : 'Koppla kalender ovan'}
        icon={<CalendarDays className="h-4 w-4" />}
        glow="gold"
        className="mt-4"
      >
        {loading ? (
          <p className="text-sm text-text-dim">Laddar uppgifter…</p>
        ) : (
          <PlaneringWeekCalendar tasks={tasks} prepared={prepared} />
        )}
      </BentoCard>

      <p className="mt-4 text-center text-xs text-text-dim">
        <Link to="/planering?tab=inkorg&inbox=kalender" className="text-accent/80 hover:text-accent">
          Tillbaka till Inkorg
        </Link>
        {' · '}
        <Link to="/planering?tab=handling" className="text-accent/80 hover:text-accent">
          Handling (Kanban)
        </Link>
      </p>
    </HubPageShell>
  );
}
