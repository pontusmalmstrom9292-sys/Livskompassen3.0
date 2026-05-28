import { Link } from 'react-router-dom';
import { Clock, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { useStampClock } from '../hooks/useStampClock';
import { StampClockControls } from './StampClockControls';

/** Full stämpelkort (Arbetsliv m.fl.) — på hem använd StampClockHomeSection. */
export function StampClockWidget() {
  const user = useStore((s) => s.user);
  const clock = useStampClock(user?.uid);

  if (!user) {
    return (
      <BentoCard title="Stämpelklocka" icon={<Clock className="h-4 w-4" />}>
        <p className="text-sm text-text-muted">Logga in under Konto för att stämpla.</p>
      </BentoCard>
    );
  }

  return (
    <BentoCard
      title="Stämpelklocka"
      icon={<Clock className="h-4 w-4" />}
      description={
        clock.isClockedIn
          ? `Instämplad sedan ${clock.status.inTid || '—'} · ${clock.status.kat || 'Arbete'}`
          : `${clock.status.dagensTimmar} h idag · ${clock.flexLeft} h flex kvar${clock.flexHint ? ` (${clock.flexHint})` : ''}`
      }
    >
      {clock.error && (
        <p className="mb-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {clock.error}
        </p>
      )}
      {clock.success && !clock.error && (
        <p className="mb-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          {clock.success}
        </p>
      )}

      {clock.loading ? (
        <p className="flex items-center gap-2 text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : (
        <>
          <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">
            {clock.isClockedIn ? 'Pågående pass' : 'Inte instämplad'}
          </p>
          <StampClockControls
            isClockedIn={clock.isClockedIn}
            busy={clock.busy}
            onStampIn={() => void clock.stamp('IN')}
            onStampOut={() => void clock.stamp('UT')}
          />
        </>
      )}
      <Link to="/arbetsliv" className="mt-3 inline-block text-xs text-accent hover:underline">
        Öppna full vy →
      </Link>
    </BentoCard>
  );
}
