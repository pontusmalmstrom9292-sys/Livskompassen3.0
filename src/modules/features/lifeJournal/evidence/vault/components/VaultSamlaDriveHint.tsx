import { HardDrive } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';

type Props = {
  pendingCount?: number;
  onOpenQueue: () => void;
  /** Inuti CalmCollapsible — ingen extra BentoCard. */
  embedded?: boolean;
};

/** G10 — Drive hamnar i granskningskö; ingen auto-WORM till reality_vault (SPEC §14). */
export function VaultSamlaDriveHint({ pendingCount, onOpenQueue, embedded = false }: Props) {
  const body = (
    <>
      <p className="text-xs text-text-dim">
        Filer från Google Drive sparas <strong className="font-normal text-text-muted">inte</strong>{' '}
        automatiskt som bevis. De hamnar i granskningskö — välj «→ Arkiv» när du är redo.
      </p>
      <button type="button" className="ds-btn ds-btn--secondary mt-3 text-xs" onClick={onOpenQueue}>
        {pendingCount != null && pendingCount > 0
          ? `Öppna granskningskö (${pendingCount})`
          : 'Öppna granskningskö'}
      </button>
    </>
  );

  if (embedded) {
    return <div className="space-y-2">{body}</div>;
  }

  return (
    <BentoCard
      title="Drive & oklara filer"
      description="Manuellt godkännande"
      icon={<HardDrive className="h-4 w-4 text-accent" />}
    >
      {body}
    </BentoCard>
  );
}
