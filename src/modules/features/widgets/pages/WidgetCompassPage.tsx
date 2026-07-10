import { AuthGate } from '@/core/auth/AuthGate';
import { CompassModuleStrip } from '@/features/dailyLife/wellbeing/compasses/components/CompassModuleStrip';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetCompassInner() {
  return (
    <WidgetShell title="Kompass" lead="Aktiv tidskompass — ett steg.">
      <div className="space-y-4">
        <CompassModuleStrip />
      </div>
    </WidgetShell>
  );
}

export function WidgetCompassPage() {
  return (
    <AuthGate>
      <WidgetCompassInner />
    </AuthGate>
  );
}
