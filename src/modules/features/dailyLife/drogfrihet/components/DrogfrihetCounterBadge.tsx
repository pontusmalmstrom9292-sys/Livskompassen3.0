import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useDrogfrihetCounter } from '../hooks/useDrogfrihetCounter';

type Props = {
  uid?: string;
};

/** Skrivskyddad räknare i hubben — nollställ endast via Inställningar. */
export function DrogfrihetCounterBadge({ uid }: Props) {
  const counter = useDrogfrihetCounter(uid);

  if (!counter.started) {
    return (
      <BentoCard title="Dagar i drogfrihet" icon={<CalendarDays className="h-4 w-4" />}>
        <p className="text-sm text-text-muted">
          Räknaren är inte startad ännu.
        </p>
        <p className="mt-2 text-xs text-text-muted">
          Starta under{' '}
          <Link to="/installningar?tab=drogfrihet" className="inline-flex min-h-11 items-center text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
            Inställningar → Drogfrihet
          </Link>
          . Ingen nollställning här — så du inte råkar.
        </p>
      </BentoCard>
    );
  }

  const dayLabel = counter.dayCount === 1 ? 'dag' : 'dagar';

  return (
    <BentoCard title="Dagar i drogfrihet" icon={<CalendarDays className="h-4 w-4" />}>
      <p className="text-3xl font-display text-accent tabular-nums">
        {counter.dayCount}
        <span className="ml-2 text-base font-sans text-text-muted">{dayLabel}</span>
      </p>
      <p className="mt-2 text-xs text-text-muted">
        Sedan {counter.startDateKey}. Ändra eller nollställ under{' '}
        <Link to="/installningar?tab=drogfrihet" className="inline-flex min-h-11 items-center text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          Inställningar
        </Link>
        .
      </p>
    </BentoCard>
  );
}
