import { useLocation } from 'react-router-dom';
import { AuthGate } from '@/core/auth/AuthGate';
import { BiffPublicPanel } from '@/features/family/safeHarbor/components/BiffPublicPanel';
import { HAMN_EMBEDDED_LEAD } from '@/features/family/safeHarbor/hamnCopy';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetHamnInner() {
  const location = useLocation();
  const initialMessage =
    (location.state as { prefilledMessage?: string } | null)?.prefilledMessage ?? '';

  return (
    <WidgetShell title="Hamn · BIFF" lead={HAMN_EMBEDDED_LEAD}>
      <BiffPublicPanel initialMessage={initialMessage} />
    </WidgetShell>
  );
}

/** WH4 — kompakt BIFF på widget-route. */
export function WidgetHamnPage() {
  return (
    <AuthGate variant="widget" widgetTitle="Hamn · BIFF">
      <WidgetHamnInner />
    </AuthGate>
  );
}
