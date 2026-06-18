import { NAV_PATHS } from '@/core/navigation/navTruth';
import { ModuleHelpHint } from '@/core/ui/ModuleHelpHint';
import { VAULT_UI_NAME } from '@/core/copy/evidenceCopy';
import { DAGBOK_REMEMBER_LINES } from '../constants/dagbokReminders';

type Props = {
  className?: string;
};

/** IHÅG-kompass: Dagbok (privat) vs Reality Vault (bevis) — ?-widget, dold som standard. */
export function DagbokRememberCard({ className }: Props) {
  return (
    <ModuleHelpHint
      className={className}
      title={`Dagbok vs ${VAULT_UI_NAME.toLowerCase()}`}
      lines={DAGBOK_REMEMBER_LINES}
      action={{ label: `Gå till ${VAULT_UI_NAME}`, to: NAV_PATHS.VALVET }}
    />
  );
}
