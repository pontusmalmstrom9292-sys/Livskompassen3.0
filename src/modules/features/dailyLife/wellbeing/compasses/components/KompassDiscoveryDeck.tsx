import { clsx } from 'clsx';
import {
  DISCOVERY_BENTO_CATALOG,
  type DiscoveryCategoryId,
} from '../content/discoveryBentoCatalog';
import { discoveryAccentGlowClass } from '../lib/discoveryAccentGlow';

type Props = {
  className?: string;
  variant?: 'forge' | 'default';
  onSelect: (categoryId: DiscoveryCategoryId) => void;
};

export function KompassDiscoveryDeck({ className, variant = 'default', onSelect }: Props) {
  const prefix = variant === 'forge' ? 'od-forge__disc' : 'kompass-disc';

  return (
    <div className={clsx(`${prefix}-deck`, className)} aria-label="Utforska kategorier">
      <p className={clsx(`${prefix}-deck-lead`)}>
        Välj ett tema — ett kort i taget, utan prestation.
      </p>
      <div className={clsx(`${prefix}-grid`)} role="list">
        {DISCOVERY_BENTO_CATALOG.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="listitem"
            className={clsx(
              `${prefix}-card`,
              'calm-card bento-card !rounded-[14px] border-[2px] border-accent/20',
              discoveryAccentGlowClass(cat.accent),
              `${prefix}-card--${cat.accent}`,
            )}
            onClick={() => onSelect(cat.id)}
          >
            <span className={clsx(`${prefix}-card-label`)}>{cat.label_sv}</span>
            <span className={clsx(`${prefix}-card-hint`)}>{cat.lead_sv}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
