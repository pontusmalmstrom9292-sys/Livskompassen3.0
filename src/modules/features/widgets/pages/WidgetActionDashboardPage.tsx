import { useCallback, useState } from 'react';
import { AuthGate } from '@/core/auth/AuthGate';
import { useStore } from '@/core/store';
import { ActionDashboard } from '../components/ActionDashboard';
import { useActionDashboardOfflineFlush } from '../hooks/useActionDashboardOfflineFlush';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetActionDashboardInner() {
  const user = useStore((s) => s.user);
  const [flushTick, setFlushTick] = useState(0);
  const handleFlushed = useCallback((count: number) => {
    if (count > 0) setFlushTick((t) => t + 1);
  }, []);

  useActionDashboardOfflineFlush(user?.uid, { onFlushed: handleFlushed });

  return (
    <WidgetShell
      title="Åtgärder"
      lead="Snabbinmatning — stämpel, reflektion, barnlogg. Synkas automatiskt."
    >
      <ActionDashboard userId={user?.uid} flushTick={flushTick} />
    </WidgetShell>
  );
}

export function WidgetActionDashboardPage() {
  return (
    <AuthGate variant="widget" widgetTitle="Åtgärder">
      <WidgetActionDashboardInner />
    </AuthGate>
  );
}
