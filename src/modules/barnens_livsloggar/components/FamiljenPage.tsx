import { ClusterShell } from '../../core/ui/ClusterShell';
import { BarnensPage } from './BarnensPage';

export function FamiljenPage() {
  return (
    <ClusterShell
      title="Familjen"
      description="Trygg hamn · neutral loggning"
      tone="lavender"
      hint="Välj barn — ett steg i taget."
    >
      <BarnensPage embedded />
    </ClusterShell>
  );
}
