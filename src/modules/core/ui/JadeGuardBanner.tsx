import { ShieldAlert } from 'lucide-react';
import { detectJadeRisk, JADE_GUARD_MESSAGE } from '../lib/jadeGuard';
import { AlertBanner } from './AlertBanner';

type JadeGuardBannerProps = {
  text: string;
  className?: string;
};

/** Guld AlertBanner när deterministisk JADE-regex triggas. */
export function JadeGuardBanner({ text, className }: JadeGuardBannerProps) {
  const { hasRisk, triggers } = detectJadeRisk(text);
  if (!hasRisk) return null;

  return (
    <AlertBanner variant="accent" className={className}>
      <div className="flex items-start gap-2">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
        <div>
          <p className="text-accent">{JADE_GUARD_MESSAGE}</p>
          {triggers.length > 0 && (
            <p className="mt-1 text-xs text-text-dim">
              Triggare: {triggers.join(', ')}
            </p>
          )}
        </div>
      </div>
    </AlertBanner>
  );
}
