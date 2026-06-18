import { ModuleHelpHint } from '@/core/ui/ModuleHelpHint';
import type { LifeHubPreset } from '@/core/lifeOs/lifeHubPresets';
import { getModuleHelp, type ModuleHelpId } from './moduleHelpRegistry';

type Props = {
  moduleId: ModuleHelpId;
  mode?: string | null;
  preset?: LifeHubPreset | null;
  className?: string;
};

export function ModuleHelpFromRegistry({ moduleId, mode, preset, className }: Props) {
  const entry = getModuleHelp(moduleId, mode, preset);
  if (!entry) return null;

  return (
    <ModuleHelpHint
      className={className}
      title={entry.title}
      lines={entry.lines}
      action={entry.action}
    />
  );
}
