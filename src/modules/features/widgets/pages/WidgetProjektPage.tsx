import { useNavigate } from 'react-router-dom';
import { AuthGate } from '@/core/auth/AuthGate';
import { ProjektPickerSheet } from '@/features/admin/projects/components/ProjektPickerSheet';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetProjektInner() {
  const navigate = useNavigate();

  return (
    <WidgetShell
      title="Nytt projekt"
      lead="Välj typ — samma bottom sheet som Planering och projekt-hubben."
    >
      <p className="mb-4 text-sm text-text-muted">
        Lista, anteckning, bild, video eller uppgift. Uppgifter med status hamnar i Handling.
      </p>
      <ProjektPickerSheet open onClose={() => navigate('/projekt')} />
    </WidgetShell>
  );
}

/** Widget-genväg: /widget/projekt — P2 picker sheet (ersätter direktlänk till /projekt/ny). */
export function WidgetProjektPage() {
  return (
    <AuthGate>
      <WidgetProjektInner />
    </AuthGate>
  );
}
