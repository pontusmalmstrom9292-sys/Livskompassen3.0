import { AuthGate } from '../../core/auth/AuthGate';
import { HomeQuickModules } from '../../core/home/HomeQuickModules';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetSnabbvalInner() {
  return (
    <WidgetShell
      title="Snabbval"
      lead="Dagbok, mikrosteg, frågesport och luckor — utan brus på Hem."
    >
      <HomeQuickModules />
    </WidgetShell>
  );
}

export function WidgetSnabbvalPage() {
  return (
    <AuthGate>
      <WidgetSnabbvalInner />
    </AuthGate>
  );
}
