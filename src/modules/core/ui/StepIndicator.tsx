import { Check } from 'lucide-react';

export type StepIndicatorItem = {
  key: string;
  label: string;
};

type StepIndicatorProps = {
  steps: StepIndicatorItem[];
  currentKey: string;
  /** gold active + emerald complete (design-master §4) */
  variant?: 'gold-emerald';
};

export function StepIndicator({ steps, currentKey, variant = 'gold-emerald' }: StepIndicatorProps) {
  const currentIdx = steps.findIndex((s) => s.key === currentKey);

  return (
    <nav aria-label="Steg" className="mb-5 flex items-center gap-1">
      {steps.map(({ key, label }, idx) => {
        const isActive = key === currentKey;
        const isComplete = idx < currentIdx;

        const activeStyles =
          variant === 'gold-emerald'
            ? 'border-accent/50 bg-accent/10'
            : 'border-accent/50 bg-accent/10';
        const completeStyles =
          variant === 'gold-emerald'
            ? 'border-success/30 bg-success/5'
            : 'border-success/30 bg-success/5';

        return (
          <div key={key} className="flex min-w-0 flex-1 items-center gap-1">
            <div
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl border px-1 py-2 text-center transition-colors ${
                isActive ? activeStyles : isComplete ? completeStyles : 'border-border bg-transparent'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  isActive
                    ? 'bg-accent/20 text-accent'
                    : isComplete
                      ? 'bg-success/15 text-success'
                      : 'bg-surface-3 text-text-dim'
                }`}
              >
                {isComplete ? <Check className="h-3 w-3" /> : idx + 1}
              </span>
              <span
                className={`truncate text-[9px] uppercase tracking-wider ${
                  isActive
                    ? 'text-accent'
                    : isComplete
                      ? 'text-success/80'
                      : 'text-text-dim'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`hidden h-px w-2 shrink-0 sm:block ${
                  idx < currentIdx ? 'bg-success/40' : 'bg-border-strong'
                }`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
