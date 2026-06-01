import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Clock, Smartphone } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { useStampClock } from '../hooks/useStampClock';
import { StampClockControls } from './StampClockControls';

const STORAGE_COLLAPSED = 'livskompassen_stamp_home_collapsed';

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_COLLAPSED) !== 'false';
  } catch {
    return true;
  }
}

function writeCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(STORAGE_COLLAPSED, collapsed ? 'true' : 'false');
  } catch {
    /* ignore */
  }
}

/** Hem — hopfällbar stämpelklocka (standard: minimerad). */
export function StampClockHomeSection() {
  const user = useStore((s) => s.user);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const clock = useStampClock(user?.uid);

  useEffect(() => {
    writeCollapsed(collapsed);
  }, [collapsed]);

  if (!user) return null;

  const statusLine = clock.isClockedIn
    ? `Instämplad ${clock.status.inTid || '—'}`
    : `${clock.status.dagensTimmar} h idag · ${clock.flexLeft} h flex`;

  if (collapsed) {
    return (
      <section className="stamp-home-strip" aria-label="Stämpelklocka — minimerad">
        <div className="stamp-home-strip__main">
          <Clock className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-text">{statusLine}</p>
            <p className="truncate text-[10px] text-text-dim">
              {clock.isClockedIn ? clock.status.kat || 'Arbete' : clock.flexHint || 'Stämpla från hemskärmen'}
            </p>
          </div>
          <StampClockControls
            compact
            isClockedIn={clock.isClockedIn}
            busy={clock.busy}
            onStampIn={() => void clock.stamp('IN')}
            onStampOut={() => void clock.stamp('UT')}
          />
          <button
            type="button"
            className="stamp-home-strip__expand"
            aria-label="Visa stämpelklocka"
            aria-expanded={false}
            onClick={() => setCollapsed(false)}
          >
            <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
        <p className="stamp-home-strip__hint">
          <Smartphone className="inline h-3 w-3" strokeWidth={1.5} aria-hidden /> Motorola: lägg widget{' '}
          <strong>Stämpel</strong> på hemskärmen — bara In/Ut.
        </p>
      </section>
    );
  }

  return (
    <div className="stamp-home-expanded">
      <div className="stamp-home-expanded__toolbar">
        <button
          type="button"
          className="stamp-home-expanded__hide"
          onClick={() => setCollapsed(true)}
        >
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Minimera
        </button>
        <Link to="/widget/stampla" className="stamp-home-expanded__widget-link">
          <Smartphone className="h-3 w-3" strokeWidth={1.5} aria-hidden />
          Hemskärms-widget
        </Link>
      </div>
      <BentoCard
        title="Stämpelklocka"
        icon={<Clock className="h-4 w-4" />}
        description={
          clock.isClockedIn
            ? `Instämplad sedan ${clock.status.inTid || '—'}`
            : `${statusLine}${clock.flexHint ? ` (${clock.flexHint})` : ''}`
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
          <p className="text-sm text-text-dim">Laddar…</p>
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
          Full vy i Arbetsliv →
        </Link>
      </BentoCard>
    </div>
  );
}
