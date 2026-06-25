import { AuthGate } from '@/core/auth/AuthGate';
import { QuickCapturePanel } from '@/features/voiceToVault/components/QuickCapturePanel';
import { useQuickCaptureStore } from '@/features/voiceToVault/store/useQuickCaptureStore';
import { WidgetShell } from '../layout/WidgetShell';
import { useWidgetShellClear } from '../context/widgetShellContext';

function WidgetVoiceVaultInner() {
  const resetCapture = useQuickCaptureStore((s) => s.reset);
  useWidgetShellClear(resetCapture);

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
