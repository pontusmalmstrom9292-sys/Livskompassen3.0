/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import { AuthGate } from '@/core/auth/AuthGate';
import { WidgetModulerBoard } from '../components/WidgetModulerBoard';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetModulerInner() {
  return (
    <WidgetShell
      title="Mina moduler"
      lead="Nedräkning, checklista, sparmål och notiser — bara här, utan app-nav."
    >
      <WidgetModulerBoard />
    </WidgetShell>
  );
}

/** v3 — konfigurerbara hemmoduler på fristående widget-route. */
export function WidgetModulerPage() {
  return (
    <AuthGate variant="widget" widgetTitle="Mina moduler">
      <WidgetModulerInner />
    </AuthGate>
  );
}
