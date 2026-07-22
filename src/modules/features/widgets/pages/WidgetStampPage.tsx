import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, Loader2 } from 'lucide-react';
import { AuthGate } from '@/core/auth/AuthGate';
import { useStore } from '@/core/store';
import { useStampClock } from '@/features/admin/stampla/hooks/useStampClock';
import { StampClockControls } from '@/features/admin/stampla/components/StampClockControls';
import { WidgetShell } from '../layout/WidgetShell';
import { parseWidgetDeepLinkPath } from '../WidgetDeepLinkBridge';
import { useWidgetReactivate } from '../hooks/useWidgetReactivate';

function WidgetStampInner() {
  const user = useStore((s) => s.user);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const action = searchParams.get('action');
  const ranAuto = useRef(false);
  const clock = useStampClock(user?.uid);

  const { stamp, loading, busy, isClockedIn, status, flexLeft, error, success } = clock;

  const runStampAction = useCallback(
    (nextAction: 'in' | 'out') => {
      if (!user || loading) return;
      const type = nextAction === 'in' ? 'IN' : 'UT';
      void stamp(type).then((ok) => {
        if (ok) {
          window.setTimeout(() => navigate('/widget/stampla', { replace: true }), 1200);
        }
      });
    },
    [loading, navigate, stamp, user],
  );

  useEffect(() => {
    if (!user || ranAuto.current || loading) return;
    if (action !== 'in' && action !== 'out') return;
    ranAuto.current = true;
    runStampAction(action);
  }, [user, action, loading, runStampAction]);

  useWidgetReactivate(
    useCallback(
      (path) => {
        const parsed = parseWidgetDeepLinkPath(path);
        if (parsed?.pathname !== '/widget/stampla') return;
        const nextAction = new URLSearchParams(parsed.search.replace(/^\?/, '')).get('action');
        if (nextAction !== 'in' && nextAction !== 'out') return;
        runStampAction(nextAction);
      },
      [runStampAction],
    ),
  );

  return (
    <WidgetShell
      title="Stämpel"
      lead={
        action === 'in' || action === 'out'
          ? 'Stämplar…'
          : 'In eller ut — ett tryck. Lägg till denna vy som widget på Motorola.'
      }
    >
      <div className="widget-dashboard-section widget-dashboard-section--gold widget-stamp space-y-4 p-4">
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
            <p className="text-xs text-text-muted">
              {status.dagensTimmar} h idag · {flexLeft} h flex kvar
            </p>
          </div>
        </div>

        {loading || (busy && (action === 'in' || action === 'out')) ? (
          <p className="flex items-center justify-center gap-2 py-6 text-sm text-text-muted">
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

      </div>
    </WidgetShell>
  );
}

export function WidgetStampPage() {
  return (
    <AuthGate variant="widget" widgetTitle="Stämpel">
      <WidgetStampInner />
    </AuthGate>
  );
}
