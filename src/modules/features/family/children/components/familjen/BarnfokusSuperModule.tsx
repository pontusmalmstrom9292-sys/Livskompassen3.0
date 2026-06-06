import type { FamiljenShell } from '../../hooks/useFamiljenShell';
import { FamiljenLivsloggTab } from './FamiljenLivsloggTab';
import { FamiljenReflektionTab } from './FamiljenReflektionTab';

export type BarnfokusSuperVariant = 'reflektion' | 'livslogg';

export type BarnfokusSuperModuleProps = {
  variant: BarnfokusSuperVariant;
  shell: FamiljenShell;
};

/**
 * Canonical router för Barnfokus + Livslogg (Familjen).
 * - reflektion: Dagens Barnfokus, balans, minnesankare
 * - livslogg: Stunder, om, favoriter per barn
 */
export function BarnfokusSuperModule({ variant, shell }: BarnfokusSuperModuleProps) {
  if (variant === 'livslogg') {
    return <FamiljenLivsloggTab shell={shell} />;
  }

  return <FamiljenReflektionTab shell={shell} />;
}
