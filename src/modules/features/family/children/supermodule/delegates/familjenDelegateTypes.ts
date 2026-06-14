import type { FamiljenShell } from '../../hooks/useFamiljenShell';

export type { FamiljenShell };

export type FamiljenDelegateBaseProps = {
  shell: FamiljenShell;
  onSaved?: (logId?: string) => void;
};
