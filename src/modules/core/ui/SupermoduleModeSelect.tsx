import type { ReactNode } from 'react';
import { useState } from 'react';
import { clsx } from 'clsx';

export type SupermoduleModeOption<T extends string = string> = {
  id: T;
  label: string;
  description?: string;
  icon?: ReactNode;
};

export type SupermoduleModeGlow = 'gold' | 'blue' | 'green';

type Props<T extends string> = {
  modes: SupermoduleModeOption<T>[];
  activeId: T;
  onChange: (id: T) => void;
  /** Secondary modes revealed via «Mer…» toggle. */
  moreModes?: SupermoduleModeOption<T>[];
  moreLabel?: string;
  moreDescription?: string;
  ariaLabel?: string;
  /** Segmented = single row scroll; wrap = flex-wrap grid (default). */
  layout?: 'segmented' | 'wrap';
  glow?: SupermoduleModeGlow;
  className?: string;
};

const GLOW_ACTIVE: Record<SupermoduleModeGlow, string> = {
  gold: 'module-mode-select__btn--active-gold',
  blue: 'module-mode-select__btn--active-blue',
  green: 'module-mode-select__btn--active-green',
};

/**
 * Canonical supermodule mode switcher — segmented control for Familjen + future hubs.
 * URL/state wiring stays in parent; this component is presentational only.
 */
export function SupermoduleModeSelect<T extends string>({
  modes,
  activeId,
  onChange,
  moreModes = [],
  moreLabel = 'Mer…',
  moreDescription = 'Fler lägen',
  ariaLabel = 'Välj läge',
  layout = 'wrap',
  glow = 'gold',
  className,
}: Props<T>) {
  const [showMore, setShowMore] = useState(false);
  const isMoreActive = moreModes.some((mode) => mode.id === activeId);

  const renderBtn = (mode: SupermoduleModeOption<T>) => {
    const isActive = activeId === mode.id;
    return (
      <button
        key={mode.id}
        type="button"
        onClick={() => onChange(mode.id)}
        aria-pressed={isActive}
        className={clsx(
          'module-mode-select__btn min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55',
          isActive && GLOW_ACTIVE[glow],
        )}
      >
        {mode.icon ? (
          <span className="module-mode-select__icon" aria-hidden>
            {mode.icon}
          </span>
        ) : null}
        <span className="module-mode-select__label">{mode.label}</span>
        {mode.description ? (
          <span className="module-mode-select__desc">{mode.description}</span>
        ) : null}
      </button>
    );
  };

  return (
    <nav
      className={clsx(
        'module-mode-select',
        layout === 'segmented' && 'module-mode-select--segmented',
        className,
      )}
      aria-label={ariaLabel}
    >
      {modes.map(renderBtn)}

      {moreModes.length > 0 ? (
        <>
          <button
            type="button"
            onClick={() => setShowMore((open) => !open)}
            aria-expanded={showMore || isMoreActive}
            className={clsx(
              'module-mode-select__btn min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55',
              isMoreActive && GLOW_ACTIVE[glow],
            )}
          >
            <span className="module-mode-select__label">{moreLabel}</span>
            {moreDescription ? (
              <span className="module-mode-select__desc">{moreDescription}</span>
            ) : null}
          </button>

          {(showMore || isMoreActive) && moreModes.map(renderBtn)}
        </>
      ) : null}
    </nav>
  );
}
