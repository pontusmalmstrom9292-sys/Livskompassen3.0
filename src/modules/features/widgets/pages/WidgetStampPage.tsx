import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/design-system';
import { Clock, Loader2 } from 'lucide-react';
import { AuthGate } from '@/core/auth/AuthGate';
import { useStore } from '@/core/store';
import { useStampClock } from '@/features/admin/stampla/hooks/useStampClock';
import { StampClockControls } from '@/features/admin/stampla/components/StampClockControls';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetStampInner() {
  const user = useStore((s) => s.user);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const action = searchParams.get('action');
  const ranAuto = useRef(false);
  const clock = useStampClock(user?.uid);

  const { stamp, loading, busy, isClockedIn, status, flexLeft, error, success } = clock;

  useEffect(() => {
    if (!user || ranAuto.current || loading) return;
    if (action !== 'in' && action !== 'out') return;
    ranAuto.current = true;
    const type = action === 'in' ? 'IN' : 'UT';
    void stamp(type).then((ok) => {
      if (ok) {
        window.setTimeout(() => navigate('/widget/stampla', { replace: true }), 1200);
      }
    });
  }, [user, action, loading, stamp, navigate]);

  return (
    <WidgetShell
      title="Stämpel"
      lead={
        action === 'in' || action === 'out'
          ? 'Stämplar…'
          : 'In eller ut — ett tryck. Lägg till denna vy som widget på Motorola.'
      }
    >
      <div className="widget-stamp overflow-hidden rounded-3xl border border-border-strong bg-surface/35 p-4 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.7)] backdrop-blur-xl space-y-4">
        {error && (
          <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            {success}
          </p>
        )}

        <div className="widget-stamp__status">
          <Clock className="h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
          <div>
            <p className="text-sm font-medium text-text">
              {isClockedIn ? `Instämplad ${status.inTid || '—'}` : 'Inte instämplad'}
            </p>
            <p className="text-xs text-text-dim">
              {status.dagensTimmar} h idag · {flexLeft} h flex kvar
            </p>
          </div>
        </div>

        {loading || (busy && (action === 'in' || action === 'out')) ? (
          <p className="flex items-center justify-center gap-2 py-6 text-sm text-text-dim">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Laddar…
          </p>
        ) : (
          <StampClockControls
            isClockedIn={isClockedIn}
            busy={busy}
            onStampIn={() => void stamp('IN')}
            onStampOut={() => void stamp('UT')}
          />
        )}

        <Button type="button" variant="ghost" className="mt-4 w-full text-sm" onClick={() => navigate('/')}>
          Till hem
        </Button>
      </div>
    </WidgetShell>
  );
}

export function WidgetStampPage() {
  return (
    <AuthGate>
      <WidgetStampInner />
    </AuthGate>
  );
}
