import { AuthGate } from '@/core/auth/AuthGate';
import { QuickCapturePanel } from '@/features/voiceToVault/components/QuickCapturePanel';
import { WidgetShell } from '../layout/WidgetShell';

function WidgetVoiceVaultInner() {
  return (
    <WidgetShell
      title="Voice-to-Vault"
      lead="Röst eller text — routas till rätt silo utan att spara förrän du bekräftar."
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
