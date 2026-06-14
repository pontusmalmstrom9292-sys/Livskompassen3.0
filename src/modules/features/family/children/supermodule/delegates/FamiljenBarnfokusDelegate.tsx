import { BarnfokusFraganPanel } from '../../components/BarnfokusFraganPanel';
import type { BarnfokusQuestion } from '../../constants';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';

/** Locked UX §1 — delegates to BarnfokusFraganPanel without changing copy or optimistic save. */
export function FamiljenBarnfokusDelegate({ shell, onSaved }: FamiljenDelegateBaseProps) {
  const { activeChild, barnfokusMemory, handleSaveBarnfokus } = shell;

  const handleSave = async (observation: string, question: BarnfokusQuestion) => {
    const id = await handleSaveBarnfokus(observation, question);
    onSaved?.(id);
    return id;
  };

  return (
    <BarnfokusFraganPanel
      key={`barnfokus-${activeChild}`}
      childAlias={activeChild}
      memoryRows={barnfokusMemory}
      onSave={handleSave}
    />
  );
}
