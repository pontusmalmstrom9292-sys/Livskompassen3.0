import { Settings } from 'lucide-react';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { InboxRuleManager } from '@/features/admin/inboxRules/components/InboxRuleManager';
import { CognitiveLoadStrip } from '@/core/ui/CognitiveLoadStrip';

export function VaultSettingsPage() {
  return (
    <HubPageShell
      eyebrow="Valv"
      title="Inställningar"
      lead="Automatiska regler för inkorgen och Valv-konfiguration."
      headerAside={<Settings className="h-5 w-5 text-text-dim" strokeWidth={1.5} />}
      lockViewport
    >
      <div className="mx-auto max-w-5xl space-y-4 pb-12">
        <CognitiveLoadStrip
          label="Valvet Inställningar"
          hint="Dessa regler tillämpas automatiskt på filer som matas in via Drive-to-Vault."
        />
        <main className="mt-2 animate-fade-in space-y-6">
          <InboxRuleManager />
        </main>
      </div>
    </HubPageShell>
  );
}
