import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthGate } from '@/core/auth/AuthGate';
import { ProjektPickerSheet } from '@/features/admin/projects/components/ProjektPickerSheet';
import { W1KompaktProjektRail } from '../components/W1KompaktProjektRail';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetProjektInner() {
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(true);

  return (
    <WidgetShell
      title="Nytt projekt"
      lead="Välj typ — samma bottom sheet som Planering och projekt-hubben."
    >
      <div className="widget-projekt-stage relative">
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Lista, anteckning, bild, video eller uppgift. Uppgifter med status hamnar i Handling.
          </p>
          <ProjektPickerSheet
            open={pickerOpen}
            onClose={() => {
              setPickerOpen(false);
              navigate('/projekt');
            }}
          />
        </div>
        <W1KompaktProjektRail
          activeId="lista"
          onNyttProjekt={() => setPickerOpen(true)}
        />
      </div>
    </WidgetShell>
  );
}

/** Widget-genväg: /widget/projekt — P2 picker sheet + W1 kompakt rail. */
export function WidgetProjektPage() {
  return (
    <AuthGate variant="widget" widgetTitle="Nytt projekt">
      <WidgetProjektInner />
    </AuthGate>
  );
}
