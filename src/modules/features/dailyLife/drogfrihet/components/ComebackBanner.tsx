/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { COMEBACK_COPY, LAPSE_VS_RELAPSE } from '../content/aterfallContent';
import { setComebackPending } from '../lib/recoveryPlanLocal';

type Props = {
  uid?: string;
  onOpenSos: () => void;
  onOpenPlan: () => void;
  onDismiss: () => void;
};

/** Visas efter nollställning — AVE-skyddad ton. */
export function ComebackBanner({ uid, onOpenSos, onOpenPlan, onDismiss }: Props) {
  return (
    <BentoCard title={COMEBACK_COPY.title} glow="green">
      <p className="text-sm text-accent">{COMEBACK_COPY.lead}</p>
      <p className="mt-2 text-xs text-text-muted">{LAPSE_VS_RELAPSE.ave}</p>
      <div className="mt-4 flex flex-col gap-2">
        <Button
          type="button"
          variant="accent"
          className="--accent min-h-[48px]"
          onClick={() => {
            setComebackPending(uid, false);
            onOpenSos();
          }}
        >
          {COMEBACK_COPY.ctaSos}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="--secondary min-h-[48px]"
          onClick={() => {
            setComebackPending(uid, false);
            onOpenPlan();
          }}
        >
          {COMEBACK_COPY.ctaPlan}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="--ghost min-h-[44px]"
          onClick={() => {
            setComebackPending(uid, false);
            onDismiss();
          }}
        >
          {COMEBACK_COPY.ctaDone}
        </Button>
      </div>
    </BentoCard>
  );
}
