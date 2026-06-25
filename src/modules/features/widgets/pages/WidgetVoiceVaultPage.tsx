import { AuthGate } from '@/core/auth/AuthGate';
import { QuickCapturePanel } from '@/features/voiceToVault/components/QuickCapturePanel';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetVoiceVaultInner() {
  return (
    <WidgetShell
      title="Bevis-röst"
      lead="Röst eller text — välj silo och bekräfta innan det sparas."
    >
      <QuickCapturePanel compact />
    </WidgetShell>
  );
}

export function WidgetVoiceVaultPage() {
  return (
    <AuthGate>
      <WidgetVoiceVaultInner />
    </AuthGate>
  );
}
