import { Button } from '@/design-system';
import { AKUT_LANDING_COPY } from '../constants';

type Props = {
  onContinue: () => void;
  onExit: () => void;
};

export function AkutLanding({ onContinue, onExit }: Props) {
  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="w-full max-w-sm rounded-xl border border-border-strong bg-surface/40 px-5 py-6 text-center">
        <p className="text-base text-accent">{AKUT_LANDING_COPY.title}</p>
        <p className="mt-3 text-sm text-text-muted">{AKUT_LANDING_COPY.body}</p>
        <p className="mt-4 text-xs text-text-dim">{AKUT_LANDING_COPY.hint}</p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Button variant="secondary" onClick={onContinue}>
          {AKUT_LANDING_COPY.continueLabel}
        </Button>
        <Button variant="ghost" className="text-sm" onClick={onExit}>
          {AKUT_LANDING_COPY.exitLabel}
        </Button>
      </div>
    </div>
  );
}
