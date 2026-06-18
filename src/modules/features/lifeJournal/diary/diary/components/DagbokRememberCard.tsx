import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import type { DagbokInputMode } from '@/features/lifeJournal/diary/supermodule/dagbokInputModes';

type Props = {
  className?: string;
  mode?: DagbokInputMode;
};

/** IHÅG-kompass: Dagbok (privat) vs Valv (bevis) — ?-widget, dold som standard. */
export function DagbokRememberCard({ className, mode }: Props) {
  return <ModuleHelpFromRegistry moduleId="dagbok" mode={mode} className={className} />;
}
