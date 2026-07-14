import { AuthGate } from '@/core/auth/AuthGate';
import { HomeQuickModules } from '@/core/home/HomeQuickModules';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetSnabbvalInner() {
  return (
    <WidgetShell
      title="Dagbok"
      lead="Humör, mikrosteg och luckor — utan brus på Hem."
    >
      <div className="space-y-4">
        <HomeQuickModules />
      </div>
    </WidgetShell>
  );
}

export function WidgetSnabbvalPage() {
  return (
    <AuthGate variant="widget" widgetTitle="Dagbok">
      <WidgetSnabbvalInner />
    </AuthGate>
  );
}
