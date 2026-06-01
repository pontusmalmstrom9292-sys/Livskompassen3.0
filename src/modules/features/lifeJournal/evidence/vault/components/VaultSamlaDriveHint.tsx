import { HardDrive } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';

type Props = {
  pendingCount?: number;
  onOpenQueue: () => void;
};

/** G10 — Drive hamnar i granskningskö; ingen auto-WORM till reality_vault (SPEC §14). */
export function VaultSamlaDriveHint({ pendingCount, onOpenQueue }: Props) {
  return (
    <BentoCard
      title="Drive & oklara filer"
      description="Manuellt godkännande"
      icon={<HardDrive className="h-4 w-4 text-accent" />}
    >
      <p className="text-xs text-text-dim">
        Filer från Google Drive sparas <strong className="font-normal text-text-muted">inte</strong>{' '}
        automatiskt som bevis. De hamnar i granskningskö — välj «→ Bevis» när du är redo.
      </p>
      <button type="button" className="btn-pill--secondary mt-3 text-xs" onClick={onOpenQueue}>
        {pendingCount != null && pendingCount > 0
          ? `Öppna granskningskö (${pendingCount})`
          : 'Öppna granskningskö'}
      </button>
    </BentoCard>
  );
}
