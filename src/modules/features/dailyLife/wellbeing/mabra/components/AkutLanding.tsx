import { Button, textStyles } from '@/design-system';
import { AKUT_LANDING_COPY } from '../constants';

type Props = {
  onContinue: () => void;
  onExit: () => void;
};

export function AkutLanding({ onContinue, onExit }: Props) {
  return (
    <div className="flex flex-col items-center space-y-6 py-4 motion-safe:animate-fade-in">
      <div className="calm-card w-full max-w-sm px-5 py-6 text-center">
        <p className={`${textStyles.eyebrow} text-accent/90`}>Akut</p>
        <p className="mt-2 font-display-serif text-lg text-accent">{AKUT_LANDING_COPY.title}</p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{AKUT_LANDING_COPY.body}</p>
        <p className="mt-4 text-xs leading-relaxed text-text-muted">{AKUT_LANDING_COPY.hint}</p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Button
          variant="secondary"
          className="min-h-14 w-full text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
          onClick={onContinue}
        >
          {AKUT_LANDING_COPY.continueLabel}
        </Button>
        <Button
          variant="ghost"
          className="min-h-11 w-full text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
          onClick={onExit}
        >
          {AKUT_LANDING_COPY.exitLabel}
        </Button>
      </div>
    </div>
  );
}
